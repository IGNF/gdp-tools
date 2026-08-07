import type Feature from 'ol/Feature';
import Point from 'ol/geom/Point';

import type { GeodesyCatalog } from '../catalog/geodesyCatalog';
import {
  geodesyWfsFeatureMatchesAttributeFilters,
  type GeodesyWfsAttributeFilterValuesHolder,
} from '../constants/wfsAttributeFilters';
import type { GeodesyWfsLayerId } from '../constants/wfs';
import { geodesyWfsFeatureMatchesDomaines } from '../constants/wfsDomainLayers';

export interface GeodesyWfsClusterGeometryFilterOptions {
  catalog: GeodesyCatalog;
  domaines?: readonly string[];
  attributeFilterValues?: GeodesyWfsAttributeFilterValuesHolder;
  domainSourceLayerId?: GeodesyWfsLayerId;
}

/** Exclut du clustering les entités hors domaine ou filtres attributs actifs. */
export function createGeodesyWfsClusterGeometryFunction(
  options: GeodesyWfsClusterGeometryFilterOptions,
): (feature: Feature) => Point | null {
  const { catalog, domaines, attributeFilterValues, domainSourceLayerId } = options;
  const attributeFilters = catalog.wfsAttributeFilters;
  const filterContext = {
    domainSourceLayerId,
    auxiliaryPropertiesByLayerId: attributeFilterValues?.auxiliaryPropertiesByLayerId,
  };

  return (feature) => {
    const geometry = feature.getGeometry();
    if (!(geometry instanceof Point)) {
      return null;
    }

    if (domaines?.length && !geodesyWfsFeatureMatchesDomaines(feature, domaines)) {
      return null;
    }

    const filterValues = attributeFilterValues?.values ?? {};
    if (
      attributeFilters.length > 0 &&
      !geodesyWfsFeatureMatchesAttributeFilters(
        feature,
        attributeFilters,
        filterValues,
        filterContext,
      )
    ) {
      return null;
    }

    return geometry;
  };
}
