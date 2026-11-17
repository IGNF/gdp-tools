import type { Extent } from 'ol/extent';
import type Feature from 'ol/Feature';
import type Geometry from 'ol/geom/Geometry';
import Point from 'ol/geom/Point';
import type Map from 'ol/Map';
import { getUid } from 'ol/util';

import type { GeodesyLayerId } from '../catalog/geodesyCatalog';
import { getGeodesyCatalogFromMap } from '../catalog/getGeodesyCatalogFromMap';
import { GEODESY_LAYER_ID_PROPERTY } from '../constants/wms';
import type { GeodesyFeatureInfoHit } from '../wms/queryGeodesyAtCoordinate';
import {
  getGeodesyWfsClusterMembers,
  isGeodesyWfsVectorLayer,
} from './geodesyWfsLayerUtils';

export interface CollectGeodesyWfsHitsInMapExtentOptions {
  layerIds?: readonly GeodesyLayerId[];
}

function resolveMemberCoordinate(feature: Feature<Geometry>): number[] | null {
  const geometry = feature.getGeometry();
  if (geometry instanceof Point) {
    return geometry.getCoordinates();
  }

  const stored = feature.get('coordinate') as number[] | undefined;
  return stored ?? null;
}

function buildHitDedupeKey(layerId: GeodesyLayerId, feature: Feature<Geometry>, coordinate: number[]): string {
  const featureId = feature.getId();
  if (featureId !== undefined && featureId !== null) {
    return `${layerId}:${String(featureId)}`;
  }

  const rawId = feature.get('id') ?? feature.get('no') ?? feature.get('ID');
  if (rawId !== undefined && rawId !== null) {
    return `${layerId}:${String(rawId)}`;
  }

  return `${layerId}:${getUid(feature)}:${coordinate.join(',')}`;
}

/** Repères WFS visibles intersectant une emprise carte (déplie les clusters). */
export function collectGeodesyWfsHitsInMapExtent(
  map: Map,
  extent: Extent,
  options: CollectGeodesyWfsHitsInMapExtentOptions = {},
): GeodesyFeatureInfoHit[] {
  const catalog = getGeodesyCatalogFromMap(map);
  const allowedLayerIds = new Set(options.layerIds ?? catalog.wfsUiLayerIds);

  if (allowedLayerIds.size === 0) {
    return [];
  }

  const hits: GeodesyFeatureInfoHit[] = [];
  const seen = new Set<string>();

  for (const layer of map.getLayers().getArray()) {
    if (!isGeodesyWfsVectorLayer(layer, allowedLayerIds)) {
      continue;
    }

    const layerId = layer.get(GEODESY_LAYER_ID_PROPERTY) as GeodesyLayerId;
    const source = layer.getSource();
    if (!source) {
      continue;
    }

    const domainDefinition = catalog.wfsDomainLayers.find((entry) => entry.id === layerId);
    const sourceLayerId = catalog.wfsDomainSourceLayerId ?? layerId;
    const definition = catalog.wfsLayers.find((entry) => entry.id === sourceLayerId);
    const layerTitle = domainDefinition?.title ?? definition?.title ?? 'Géodésie WFS';

    source.forEachFeatureIntersectingExtent(extent, (feature) => {
      const members = getGeodesyWfsClusterMembers(feature as Feature<Geometry>);

      for (const member of members) {
        const coordinate = resolveMemberCoordinate(member);
        if (!coordinate) {
          continue;
        }

        const dedupeKey = buildHitDedupeKey(layerId, member, coordinate);
        if (seen.has(dedupeKey)) {
          continue;
        }

        seen.add(dedupeKey);
        hits.push({
          layerId,
          feature: member,
          layerTitle,
        });
      }
    });
  }

  return hits;
}
