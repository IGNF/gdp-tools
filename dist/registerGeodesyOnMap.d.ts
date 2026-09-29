import type Map from 'ol/Map';
import LayerGroup from 'ol/layer/Group';
import type { GeodesyCatalog } from './catalog/geodesyCatalog';
import type { GeodesyLayerVisibility } from './geodesyLayerVisibility';
import type { GeodesyWfsAttributeFilterValues } from './constants/wfsAttributeFilters';
import { type RegisterGeodesyPopupOptions } from './interaction/geodesyPopup';
export declare function getGeodesyLayerGroup(map: Map): LayerGroup | null;
export interface RegisterGeodesyOnMapOptions {
    catalog?: GeodesyCatalog;
    visibility?: Partial<GeodesyLayerVisibility>;
    attributeFilterValues?: GeodesyWfsAttributeFilterValues;
    popup?: RegisterGeodesyPopupOptions | boolean;
}
/** Ajoute le groupe de couches géodésie à la carte. Retourne une fonction de nettoyage. */
export declare function registerGeodesyOnMap(map: Map, options?: RegisterGeodesyOnMapOptions): () => void;
//# sourceMappingURL=registerGeodesyOnMap.d.ts.map