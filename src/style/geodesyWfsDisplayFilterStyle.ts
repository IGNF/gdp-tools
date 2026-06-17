import Feature from 'ol/Feature';
import type { StyleFunction, StyleLike } from 'ol/style/Style';

import type {
  GeodesyWfsAttributeFilterDefinition,
  GeodesyWfsAttributeFilterValuesHolder,
} from '../constants/wfsAttributeFilters';
import { geodesyWfsFeatureMatchesAttributeFilters } from '../constants/wfsAttributeFilters';
import type { GeodesyWfsLayerId } from '../constants/wfs';
import { geodesyWfsFeatureMatchesDomaines } from '../constants/wfsDomainLayers';
import { wrapGeodesyWfsStyleForCluster } from './geodesyWfsClusterStyle';

/** Style WFS masquant entités hors domaine et/ou filtres attributs actifs. */
export function createGeodesyWfsDisplayFilterStyleFunction(
  pointStyle: StyleLike,
  options: {
    domaines?: readonly string[];
    attributeFilters?: readonly GeodesyWfsAttributeFilterDefinition[];
    attributeFilterValues?: GeodesyWfsAttributeFilterValuesHolder;
    domainSourceLayerId?: GeodesyWfsLayerId;
    cluster?: boolean;
  } = {},
): StyleFunction {
  const baseStyleFn: StyleFunction =
    typeof pointStyle === 'function' ? pointStyle : () => pointStyle;

  const styleFn = options.cluster ? wrapGeodesyWfsStyleForCluster(baseStyleFn) : baseStyleFn;
  const domaines = options.domaines ?? [];
  const attributeFilters = options.attributeFilters ?? [];
  const valuesHolder = options.attributeFilterValues;

  return (feature, resolution) => {
    if (!(feature instanceof Feature)) {
      return styleFn(feature, resolution);
    }

    if (domaines.length > 0 && !geodesyWfsFeatureMatchesDomaines(feature, domaines)) {
      return [];
    }

    const filterValues = valuesHolder?.values ?? {};
    if (
      attributeFilters.length > 0 &&
      !geodesyWfsFeatureMatchesAttributeFilters(feature, attributeFilters, filterValues, {
        domainSourceLayerId: options.domainSourceLayerId,
        auxiliaryPropertiesByLayerId: valuesHolder?.auxiliaryPropertiesByLayerId,
      })
    ) {
      return [];
    }

    return styleFn(feature, resolution);
  };
}
