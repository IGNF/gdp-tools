import type Feature from 'ol/Feature';
import type Geometry from 'ol/geom/Geometry';
import type BaseLayer from 'ol/layer/Base';
import VectorLayer from 'ol/layer/Vector';
import { getUid } from 'ol/util';

import { GEODESY_LAYER_ID_PROPERTY } from '../constants/wms';
import { GEODESY_LAYER_KIND_PROPERTY } from '../constants/wfs';
import { GEODESY_WFS_DATA_LAYER_PROPERTY } from '../constants/wfsDomainLayers';
import type { GeodesyLayerId } from '../catalog/geodesyCatalog';

export function isGeodesyWfsVectorLayer(
  layer: BaseLayer,
  allowedLayerIds: ReadonlySet<GeodesyLayerId>,
): layer is VectorLayer {
  if (!(layer instanceof VectorLayer)) {
    return false;
  }

  if (layer.get(GEODESY_WFS_DATA_LAYER_PROPERTY) === true) {
    return false;
  }

  if (!layer.getVisible()) {
    return false;
  }

  if (layer.get(GEODESY_LAYER_KIND_PROPERTY) !== 'wfs') {
    return false;
  }

  const layerId = layer.get(GEODESY_LAYER_ID_PROPERTY) as GeodesyLayerId | undefined;
  return layerId !== undefined && allowedLayerIds.has(layerId);
}

export function dedupeGeodesyWfsClusterMembers(
  members: readonly Feature<Geometry>[],
): Feature<Geometry>[] {
  const seen = new Set<string>();
  const unique: Feature<Geometry>[] = [];

  for (const member of members) {
    const key =
      member.getId() !== undefined ? String(member.getId()) : getUid(member);
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    unique.push(member);
  }

  return unique;
}

export function getGeodesyWfsClusterMembers(
  feature: Feature<Geometry>,
): Feature<Geometry>[] {
  const members = feature.get('features') as Feature<Geometry>[] | undefined;
  if (!members?.length) {
    return [feature];
  }

  return dedupeGeodesyWfsClusterMembers(members);
}

export function getGeodesyWfsClusterMemberCount(feature: Feature<Geometry>): number {
  const members = feature.get('features') as Feature<Geometry>[] | undefined;
  if (!members?.length) {
    return 1;
  }

  return dedupeGeodesyWfsClusterMembers(members).length;
}

export function isGeodesyWfsMultiClusterFeature(feature: Feature<Geometry>): boolean {
  return getGeodesyWfsClusterMemberCount(feature) > 1;
}

export function isGeodesyWfsExplodedClusterFeature(feature: Feature<Geometry>): boolean {
  return feature.get('selectclusterfeature') === true;
}
