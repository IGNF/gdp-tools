import type { Coordinate } from 'ol/coordinate';
import Feature from 'ol/Feature';
import type Geometry from 'ol/geom/Geometry';

import { dedupeGeodesyWfsClusterMembers } from './geodesyWfsLayerUtils';

/**
 * Résout la feature WFS « métier » lors d’un clic sur un cluster ol/source/Cluster.
 * Si plusieurs points sont regroupés, retourne le plus proche du clic.
 */
export function resolveGeodesyWfsHitFeature(
  feature: Feature<Geometry>,
  coordinate?: Coordinate,
): Feature<Geometry> {
  const members = dedupeGeodesyWfsClusterMembers(
    (feature.get('features') as Feature<Geometry>[] | undefined) ?? [],
  );
  if (!members.length) {
    return feature;
  }

  if (members.length === 1) {
    return members[0];
  }

  if (!coordinate) {
    return members[0];
  }

  let closestFeature = members[0];
  let closestDistanceSq = Number.POSITIVE_INFINITY;

  for (const member of members) {
    const geometry = member.getGeometry();
    if (!geometry) {
      continue;
    }

    const nearest = geometry.getClosestPoint(coordinate);
    const dx = nearest[0] - coordinate[0];
    const dy = nearest[1] - coordinate[1];
    const distanceSq = dx * dx + dy * dy;

    if (distanceSq < closestDistanceSq) {
      closestDistanceSq = distanceSq;
      closestFeature = member;
    }
  }

  return closestFeature;
}
