import type { StyleFunction, StyleLike } from 'ol/style/Style';
import type { GeodesyWfsAttributeFilterDefinition, GeodesyWfsAttributeFilterValuesHolder } from '../constants/wfsAttributeFilters';
import type { GeodesyWfsLayerId } from '../constants/wfs';
/** Style WFS masquant entités hors domaine et/ou filtres attributs actifs. */
export declare function createGeodesyWfsDisplayFilterStyleFunction(pointStyle: StyleLike, options?: {
    domaines?: readonly string[];
    attributeFilters?: readonly GeodesyWfsAttributeFilterDefinition[];
    attributeFilterValues?: GeodesyWfsAttributeFilterValuesHolder;
    domainSourceLayerId?: GeodesyWfsLayerId;
    cluster?: boolean;
}): StyleFunction;
//# sourceMappingURL=geodesyWfsDisplayFilterStyle.d.ts.map