import type Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import type { GeodesyCatalog } from '../catalog/geodesyCatalog';
import { type GeodesyWfsAttributeFilterValuesHolder } from '../constants/wfsAttributeFilters';
import type { GeodesyWfsLayerId } from '../constants/wfs';
export interface GeodesyWfsClusterGeometryFilterOptions {
    catalog: GeodesyCatalog;
    domaines?: readonly string[];
    attributeFilterValues?: GeodesyWfsAttributeFilterValuesHolder;
    domainSourceLayerId?: GeodesyWfsLayerId;
}
/** Exclut du clustering les entités hors domaine ou filtres attributs actifs. */
export declare function createGeodesyWfsClusterGeometryFunction(options: GeodesyWfsClusterGeometryFilterOptions): (feature: Feature) => Point | null;
//# sourceMappingURL=geodesyWfsClusterGeometry.d.ts.map