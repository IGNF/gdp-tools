import LayerGroup from 'ol/layer/Group';
import { type GeodesyCatalog } from '../catalog/geodesyCatalog';
import { type GeodesyWfsAttributeFilterValues } from '../constants/wfsAttributeFilters';
import type { GeodesyLayerVisibility } from '../geodesyLayerVisibility';
export interface CreateGeodesyLayerGroupOptions {
    /** Catalogue des couches (catalogue IGN complet par défaut). */
    catalog?: GeodesyCatalog;
    /** Visibilité initiale par identifiant (RBF, RDF, RN, GDP…). */
    visibility?: Partial<GeodesyLayerVisibility>;
    /** Valeurs initiales des filtres attributs WFS (profil expert). */
    attributeFilterValues?: GeodesyWfsAttributeFilterValues;
}
export declare function createGeodesyLayerGroup(options?: CreateGeodesyLayerGroupOptions): LayerGroup;
//# sourceMappingURL=geodesyLayerGroup.d.ts.map