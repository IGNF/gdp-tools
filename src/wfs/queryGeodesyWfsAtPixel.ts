import Feature from 'ol/Feature';
import type Geometry from 'ol/geom/Geometry';
import type Map from 'ol/Map';
import type { Pixel } from 'ol/pixel';

import type { GeodesyLayerId } from '../catalog/geodesyCatalog';
import { getGeodesyCatalogFromMap } from '../catalog/getGeodesyCatalogFromMap';
import { GEODESY_LAYER_ID_PROPERTY } from '../constants/wms';
import type { GeodesyWfsLayerId } from '../constants/wfs';
import { geodesyWfsFeatureMatchesDomaines } from '../constants/wfsDomainLayers';
import { getGeodesyWfsClusterSelectInteraction } from '../interaction/geodesyWfsClusterSelect';
import type { GeodesyFeatureInfoHit } from '../wms/queryGeodesyAtCoordinate';
import {
  isGeodesyWfsExplodedClusterFeature,
  isGeodesyWfsMultiClusterFeature,
  isGeodesyWfsVectorLayer,
} from './geodesyWfsLayerUtils';
import { resolveGeodesyWfsHitFeature } from './resolveGeodesyWfsHitFeature';

export interface QueryGeodesyWfsAtPixelOptions {
  /** Tolérance en pixels autour du clic (défaut : 5). */
  hitTolerance?: number;
  /** Limite aux couches WFS visibles (défaut : `catalog.wfsUiLayerIds`). */
  layerIds?: readonly GeodesyLayerId[];
}

function resolveWfsSourceLayerId(
  catalog: ReturnType<typeof getGeodesyCatalogFromMap>,
  layerId: GeodesyLayerId,
): GeodesyWfsLayerId {
  const domainLayer = catalog.wfsDomainLayers.find((entry) => entry.id === layerId);
  if (domainLayer && catalog.wfsDomainSourceLayerId) {
    return catalog.wfsDomainSourceLayerId;
  }

  return layerId as GeodesyWfsLayerId;
}

/** Résout l’identifiant de couche UI (domaine) à partir de la feature WFS. */
function resolveWfsDisplayLayerId(
  catalog: ReturnType<typeof getGeodesyCatalogFromMap>,
  feature: Feature<Geometry>,
  allowedLayerIds: ReadonlySet<GeodesyLayerId>,
): GeodesyLayerId | null {
  const featureLayerId = feature.get(GEODESY_LAYER_ID_PROPERTY) as GeodesyLayerId | undefined;

  if (featureLayerId && allowedLayerIds.has(featureLayerId)) {
    return featureLayerId;
  }

  const domainSourceLayerId = catalog.wfsDomainSourceLayerId;
  if (!domainSourceLayerId || catalog.wfsDomainLayers.length === 0) {
    return null;
  }

  if (featureLayerId !== undefined && featureLayerId !== domainSourceLayerId) {
    return null;
  }

  for (const domainLayer of catalog.wfsDomainLayers) {
    if (!allowedLayerIds.has(domainLayer.id)) {
      continue;
    }

    if (geodesyWfsFeatureMatchesDomaines(feature, domainLayer.domaines)) {
      return domainLayer.id;
    }
  }

  return null;
}

function buildWfsHit(
  catalog: ReturnType<typeof getGeodesyCatalogFromMap>,
  layerId: GeodesyLayerId,
  feature: Feature<Geometry>,
  layerTitle?: string,
): GeodesyFeatureInfoHit {
  const domainDefinition = catalog.wfsDomainLayers.find((entry) => entry.id === layerId);
  const sourceLayerId = resolveWfsSourceLayerId(catalog, layerId);
  const definition = catalog.wfsLayers.find((entry) => entry.id === sourceLayerId);

  return {
    layerTitle: layerTitle ?? domainDefinition?.title ?? definition?.title ?? 'Géodésie WFS',
    layerId,
    feature,
  };
}

function resolveExplodedClusterHit(
  clusterFeature: Feature<Geometry>,
  coordinate: number[],
  catalog: ReturnType<typeof getGeodesyCatalogFromMap>,
  allowedLayerIds: Set<GeodesyLayerId>,
): GeodesyFeatureInfoHit | null {
  if (!isGeodesyWfsExplodedClusterFeature(clusterFeature)) {
    return null;
  }

  const resolvedFeature = resolveGeodesyWfsHitFeature(clusterFeature, coordinate);
  const layerId = resolveWfsDisplayLayerId(catalog, resolvedFeature, allowedLayerIds);
  if (!layerId) {
    return null;
  }

  return buildWfsHit(catalog, layerId, resolvedFeature);
}

function queryExplodedClusterAtPixel(
  map: Map,
  pixel: Pixel,
  coordinate: number[],
  catalog: ReturnType<typeof getGeodesyCatalogFromMap>,
  allowedLayerIds: Set<GeodesyLayerId>,
  hitTolerance: number,
): GeodesyFeatureInfoHit | null {
  const overlayLayer = getGeodesyWfsClusterSelectInteraction(map)?.getLayer() ?? null;

  if (overlayLayer?.getVisible()) {
    let overlayHit: GeodesyFeatureInfoHit | null = null;

    map.forEachFeatureAtPixel(
      pixel,
      (feature, layer) => {
        if (layer !== overlayLayer) {
          return;
        }

        overlayHit = resolveExplodedClusterHit(
          feature as Feature<Geometry>,
          coordinate,
          catalog,
          allowedLayerIds,
        );
        return overlayHit !== null;
      },
      {
        hitTolerance,
        layerFilter: (layer) => layer === overlayLayer,
      },
    );

    if (overlayHit) {
      return overlayHit;
    }
  }

  let hit: GeodesyFeatureInfoHit | null = null;

  map.forEachFeatureAtPixel(
    pixel,
    (feature) => {
      hit = resolveExplodedClusterHit(
        feature as Feature<Geometry>,
        coordinate,
        catalog,
        allowedLayerIds,
      );
      return hit !== null;
    },
    { hitTolerance },
  );

  return hit;
}

/** Construit un hit WFS à partir d’une feature éclatée (SelectCluster). */
export function buildGeodesyWfsHitFromExplodedClusterFeature(
  map: Map,
  clusterFeature: Feature<Geometry>,
  coordinate: number[],
  options: QueryGeodesyWfsAtPixelOptions = {},
): GeodesyFeatureInfoHit | null {
  const catalog = getGeodesyCatalogFromMap(map);
  const allowedLayerIds = new Set(options.layerIds ?? catalog.wfsUiLayerIds);

  if (allowedLayerIds.size === 0) {
    return null;
  }

  return resolveExplodedClusterHit(clusterFeature, coordinate, catalog, allowedLayerIds);
}

/** Indique qu’un cluster WFS multi-points a été cliqué (éclatement SelectCluster attendu). */
export function hasGeodesyWfsMultiClusterAtPixel(
  map: Map,
  pixel: Pixel,
  options: QueryGeodesyWfsAtPixelOptions = {},
): boolean {
  const catalog = getGeodesyCatalogFromMap(map);
  if (!catalog.wfsCluster.enabled) {
    return false;
  }

  const hitTolerance = options.hitTolerance ?? 5;
  const allowedLayerIds = new Set(options.layerIds ?? catalog.wfsUiLayerIds);

  if (allowedLayerIds.size === 0) {
    return false;
  }

  let found = false;

  map.forEachFeatureAtPixel(
    pixel,
    (feature, layer) => {
      if (!isGeodesyWfsVectorLayer(layer, allowedLayerIds)) {
        return;
      }

      if (isGeodesyWfsMultiClusterFeature(feature as Feature<Geometry>)) {
        found = true;
        return true;
      }
    },
    {
      hitTolerance,
      layerFilter: (layer) => isGeodesyWfsVectorLayer(layer, allowedLayerIds),
    },
  );

  return found;
}

/**
 * Retourne l’entité WFS géodésie la plus proche du clic (couches visibles uniquement).
 * Les attributs proviennent directement de la feature GeoJSON chargée.
 */
export function queryGeodesyWfsAtPixel(
  map: Map,
  pixel: Pixel,
  options: QueryGeodesyWfsAtPixelOptions = {},
): GeodesyFeatureInfoHit[] {
  const catalog = getGeodesyCatalogFromMap(map);
  const hitTolerance = options.hitTolerance ?? 5;
  const allowedLayerIds = new Set(options.layerIds ?? catalog.wfsUiLayerIds);

  if (allowedLayerIds.size === 0) {
    return [];
  }

  const coordinate = map.getCoordinateFromPixel(pixel);

  const explodedHit = queryExplodedClusterAtPixel(
    map,
    pixel,
    coordinate,
    catalog,
    allowedLayerIds,
    hitTolerance,
  );
  if (explodedHit) {
    return [explodedHit];
  }

  let hit: GeodesyFeatureInfoHit | null = null;

  map.forEachFeatureAtPixel(
    pixel,
    (feature, layer) => {
      if (!isGeodesyWfsVectorLayer(layer, allowedLayerIds)) {
        return;
      }

      const clusterFeature = feature as Feature<Geometry>;
      if (catalog.wfsCluster.enabled && isGeodesyWfsMultiClusterFeature(clusterFeature)) {
        return;
      }

      const layerId = layer.get(GEODESY_LAYER_ID_PROPERTY) as GeodesyLayerId;
      const resolvedFeature = resolveGeodesyWfsHitFeature(clusterFeature, coordinate);

      hit = buildWfsHit(
        catalog,
        layerId,
        resolvedFeature,
        layer.get('title') as string | undefined,
      );

      return true;
    },
    {
      hitTolerance,
      layerFilter: (layer) => isGeodesyWfsVectorLayer(layer, allowedLayerIds),
    },
  );

  return hit ? [hit] : [];
}
