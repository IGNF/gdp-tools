import type Map from 'ol/Map';
import { type GeodesyWfsAttributeFilterValues, type GeodesyWfsAttributeFilterValuesHolder } from './constants/wfsAttributeFilters';
export declare function getGeodesyWfsAttributeFilterValuesHolder(map: Map): GeodesyWfsAttributeFilterValuesHolder | null;
/** Lit les valeurs de filtres attributs WFS actives sur la carte. */
export declare function getGeodesyWfsAttributeFilterValues(map: Map): GeodesyWfsAttributeFilterValues;
/** Active ou met à jour les filtres attributs WFS (profil expert). */
export declare function setGeodesyWfsAttributeFilterValues(map: Map, values: GeodesyWfsAttributeFilterValues): void;
/** Réinitialise tous les filtres attributs WFS. */
export declare function clearGeodesyWfsAttributeFilterValues(map: Map): void;
//# sourceMappingURL=geodesyWfsAttributeFilters.d.ts.map