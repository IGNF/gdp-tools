import {
  buildGeodesyPointDisplay,
  formatMapCoordinateSubtitle,
  type BuildGeodesyPointDisplayOptions,
} from '../report/geodesyPointDisplay';
import { buildGeodesyPointReportContext } from '../report/geodesyPointReportContext';
import type { QueryGeodesyAtClickOptions } from '../interaction/queryGeodesyAtClick';
import { clearGeodesyWfsClusterExplosion, getGeodesyWfsClusterSelectInteraction } from '../interaction/geodesyWfsClusterSelect';
import { isAnyGeodesyLayerVisible } from '../geodesyLayerVisibility';
import { getGeodesyCatalogFromMap } from '../catalog/getGeodesyCatalogFromMap';
import { queryGeodesyAnnexAtPixel } from '../annex/queryGeodesyAnnexAtPixel';
import { queryGeodesyAtCoordinate } from '../wms/queryGeodesyAtCoordinate';
import type { GeodesyFeatureInfoHit } from '../wms/queryGeodesyAtCoordinate';
import {
  buildGeodesyWfsHitFromExplodedClusterFeature,
  hasGeodesyWfsMultiClusterAtPixel,
  queryGeodesyWfsAtPixel,
} from '../wfs/queryGeodesyWfsAtPixel';
import type Map from 'ol/Map';
import type { MapBrowserEvent } from 'ol';
import type Feature from 'ol/Feature';
import type Geometry from 'ol/geom/Geometry';
import { listen, unlistenByKey } from 'ol/events';
import type { SelectEvent } from 'ol/interaction/Select';
import { isGeodesyWfsExplodedClusterFeature } from '../wfs/geodesyWfsLayerUtils';
import { toLonLat } from 'ol/proj';
import type { Coordinate } from 'ol/coordinate';
import Point from 'ol/geom/Point';
import { useCallback, useEffect, useState } from 'react';

export interface GeodesyCoordinateClick {
  longitude: number;
  latitude: number;
  subtitle: string;
}

export type GeodesyMapClickResult =
  | {
      kind: 'geodesy';
      display: ReturnType<typeof buildGeodesyPointDisplay>;
      reportContext: ReturnType<typeof buildGeodesyPointReportContext>;
    }
  | { kind: 'coordinate'; coordinate: GeodesyCoordinateClick };

export interface UseGeodesyMapClickOptions extends BuildGeodesyPointDisplayOptions {
  enabled?: boolean;
  isMapReady?: boolean;
  query?: QueryGeodesyAtClickOptions;
}

function buildCoordinateClickResult(coordinate: Coordinate): GeodesyMapClickResult {
  const [longitude, latitude] = toLonLat(coordinate);
  return {
    kind: 'coordinate',
    coordinate: {
      longitude,
      latitude,
      subtitle: formatMapCoordinateSubtitle(longitude, latitude),
    },
  };
}

function buildGeodesyClickResult(
  hit: GeodesyFeatureInfoHit,
  coordinate: Coordinate,
  displayOptions: BuildGeodesyPointDisplayOptions,
): GeodesyMapClickResult {
  return {
    kind: 'geodesy',
    display: buildGeodesyPointDisplay(hit, coordinate, displayOptions),
    reportContext: buildGeodesyPointReportContext(hit, coordinate, {
      ...displayOptions,
      attributeCatalog: displayOptions.attributeCatalog,
    }),
  };
}

function buildDisplayOptions(
  map: Map,
  options: Pick<
    UseGeodesyMapClickOptions,
    'attributeCatalog' | 'externalUrlSource' | 'transformExternalUrl' | 'pictoUrlMaps'
  >,
): BuildGeodesyPointDisplayOptions {
  return {
    attributeCatalog: options.attributeCatalog,
    geodesyCatalog: getGeodesyCatalogFromMap(map),
    externalUrlSource: options.externalUrlSource,
    transformExternalUrl: options.transformExternalUrl,
    pictoUrlMaps: options.pictoUrlMaps,
  };
}

/** Clic carte headless : point géodésique ou coordonnée libre (sans UI ni navigation). */
export function useGeodesyMapClick(
  map: Map | null,
  options: UseGeodesyMapClickOptions = {},
): {
  pendingClick: GeodesyMapClickResult | null;
  clearPendingClick: () => void;
} {
  const {
    enabled = true,
    isMapReady = false,
    query,
    attributeCatalog,
    externalUrlSource,
    transformExternalUrl,
    pictoUrlMaps,
  } = options;

  const [pendingClick, setPendingClick] = useState<GeodesyMapClickResult | null>(null);

  const clearPendingClick = useCallback(() => {
    if (map) {
      clearGeodesyWfsClusterExplosion(map);
    }
    setPendingClick(null);
  }, [map]);

  useEffect(() => {
    if (!map || !enabled || !isMapReady) {
      return;
    }

    let queryGeneration = 0;
    let explodedClusterClickHandled = false;

    const clusterSelect = getGeodesyWfsClusterSelectInteraction(map);
    const clusterSelectKey = clusterSelect?.on('select', (event) => {
      const selectEvent = event as SelectEvent;
      const selected = selectEvent.selected[0] as Feature<Geometry> | undefined;
      if (!selected || !isGeodesyWfsExplodedClusterFeature(selected)) {
        return;
      }

      const mapBrowserEvent = selectEvent.mapBrowserEvent as MapBrowserEvent<PointerEvent> | undefined;
      const geometry = selected.getGeometry();
      const clickCoordinate =
        mapBrowserEvent?.coordinate ??
        (geometry instanceof Point ? geometry.getCoordinates() : undefined);

      if (!clickCoordinate) {
        return;
      }

      const displayOptions = buildDisplayOptions(map, {
        attributeCatalog,
        externalUrlSource,
        transformExternalUrl,
        pictoUrlMaps,
      });
      const hit = buildGeodesyWfsHitFromExplodedClusterFeature(
        map,
        selected,
        clickCoordinate,
        query?.wfs,
      );

      if (!hit) {
        return;
      }

      explodedClusterClickHandled = true;
      queryGeneration += 1;
      setPendingClick(buildGeodesyClickResult(hit, clickCoordinate, displayOptions));
    });

    const clickKey = listen(map, 'singleclick', (event) => {
      const mapEvent = event as MapBrowserEvent<PointerEvent>;

      if (explodedClusterClickHandled) {
        explodedClusterClickHandled = false;
        return;
      }

      const hasActiveClusterExplosion =
        (clusterSelect?.getLayer()?.getSource()?.getFeatures().length ?? 0) > 0;
      if (hasActiveClusterExplosion) {
        return;
      }

      const displayOptions = buildDisplayOptions(map, {
        attributeCatalog,
        externalUrlSource,
        transformExternalUrl,
        pictoUrlMaps,
      });
      const preferWfs = query?.preferWfs ?? true;

      if (preferWfs) {
        const wfsHits = queryGeodesyWfsAtPixel(map, mapEvent.pixel, query?.wfs);
        if (wfsHits.length > 0) {
          setPendingClick(
            buildGeodesyClickResult(wfsHits[0], mapEvent.coordinate, displayOptions),
          );
          return;
        }

        const annexHits = queryGeodesyAnnexAtPixel(map, mapEvent.pixel, query?.annex);
        if (annexHits.length > 0) {
          setPendingClick(
            buildGeodesyClickResult(annexHits[0], mapEvent.coordinate, displayOptions),
          );
          return;
        }

        if (hasGeodesyWfsMultiClusterAtPixel(map, mapEvent.pixel, query?.wfs)) {
          return;
        }
      }

      void (async () => {
        const generation = ++queryGeneration;
        const coordinateResult = buildCoordinateClickResult(mapEvent.coordinate);

        try {
          setPendingClick(coordinateResult);

          if (!isAnyGeodesyLayerVisible(map)) {
            return;
          }

          const wmsHits = await queryGeodesyAtCoordinate(map, mapEvent.coordinate, query?.wms);
          if (generation !== queryGeneration) {
            return;
          }

          if (wmsHits.length > 0) {
            setPendingClick(
              buildGeodesyClickResult(wmsHits[0], mapEvent.coordinate, displayOptions),
            );
            return;
          }

          if (!preferWfs) {
            return;
          }

          if (hasGeodesyWfsMultiClusterAtPixel(map, mapEvent.pixel, query?.wfs)) {
            return;
          }

          const wfsHits = queryGeodesyWfsAtPixel(map, mapEvent.pixel, query?.wfs);
          if (generation !== queryGeneration) {
            return;
          }

          if (wfsHits.length > 0) {
            setPendingClick(
              buildGeodesyClickResult(wfsHits[0], mapEvent.coordinate, displayOptions),
            );
            return;
          }

          const annexHits = queryGeodesyAnnexAtPixel(map, mapEvent.pixel, query?.annex);
          if (generation !== queryGeneration) {
            return;
          }

          if (annexHits.length > 0) {
            setPendingClick(
              buildGeodesyClickResult(annexHits[0], mapEvent.coordinate, displayOptions),
            );
          }
        } catch {
          if (generation !== queryGeneration) {
            return;
          }

          setPendingClick(coordinateResult);
        }
      })();
    });

    return () => {
      queryGeneration += 1;
      if (clusterSelectKey) {
        unlistenByKey(clusterSelectKey);
      }
      unlistenByKey(clickKey);
    };
  }, [
    attributeCatalog,
    enabled,
    externalUrlSource,
    isMapReady,
    map,
    pictoUrlMaps,
    query,
    transformExternalUrl,
  ]);

  return { pendingClick, clearPendingClick };
}
