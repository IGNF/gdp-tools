import Feature from 'ol/Feature';
import type { StyleFunction, StyleLike } from 'ol/style/Style';

import { geodesyWfsFeatureMatchesDomaines } from '../constants/wfsDomainLayers';
import { wrapGeodesyWfsStyleForCluster } from './geodesyWfsClusterStyle';

/** Style WFS masquant les entités hors codes `domaine` (point ou cluster). */
export function createGeodesyWfsDomainFilterStyleFunction(
  pointStyle: StyleLike,
  domaines: readonly string[],
  options: { cluster?: boolean } = {},
): StyleFunction {
  const baseStyleFn: StyleFunction =
    typeof pointStyle === 'function' ? pointStyle : () => pointStyle;

  const styleFn = options.cluster
    ? wrapGeodesyWfsStyleForCluster(baseStyleFn)
    : baseStyleFn;

  return (feature, resolution) => {
    if (!(feature instanceof Feature)) {
      return styleFn(feature, resolution);
    }

    if (!geodesyWfsFeatureMatchesDomaines(feature, domaines)) {
      return [];
    }

    return styleFn(feature, resolution);
  };
}
