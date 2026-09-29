import type Map from 'ol/Map';
import { type GeodesyCatalog, type GeodesyLayerId } from './catalog/geodesyCatalog';
export type GeodesyLayerVisibility = Partial<Record<GeodesyLayerId, boolean>>;
export declare function defaultGeodesyLayerVisibility(activeIds?: GeodesyLayerId[], catalog?: GeodesyCatalog): GeodesyLayerVisibility;
/** Lit la visibilité actuelle des sous-couches géodésie sur la carte. */
export declare function getGeodesyLayersVisibility(map: Map): GeodesyLayerVisibility;
/** Active ou masque une ou plusieurs couches géodésie. */
export declare function setGeodesyLayersVisibility(map: Map, visibility: Partial<GeodesyLayerVisibility>): void;
/** Affiche ou masque une seule couche géodésie. */
export declare function setGeodesyLayerVisible(map: Map, layerId: GeodesyLayerId, visible: boolean): void;
/** True si au moins une sous-couche géodésie UI est visible. */
export declare function isAnyGeodesyLayerVisible(map: Map): boolean;
//# sourceMappingURL=geodesyLayerVisibility.d.ts.map