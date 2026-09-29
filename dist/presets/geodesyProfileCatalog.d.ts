import type { GeodesyCatalog, GeodesyCatalogOptions, GeodesyLayerId } from '../catalog/geodesyCatalog';
import { type GeodesyWfsAttributeFilterDefinition, type GeodesyWfsAttributeFilterValues } from '../constants/wfsAttributeFilters';
import { type CreateGeodesyExpertCatalogOptions } from './geodesyExpertCatalog';
/** Profil d’affichage géodésie : grand public (WMS) ou expert (WFS, filtres, annexes). */
export type GeodesyProfile = 'public' | 'expert';
export interface CreateGeodesyCatalogForProfileOptions extends GeodesyCatalogOptions {
    /** @deprecated Profil public : WFS désactivé. Utiliser le profil `expert`. */
    enableWfsLayers?: boolean;
}
export declare function isGeodesyProfile(value: unknown): value is GeodesyProfile;
/** Catalogue résolu selon le profil (public ou expert). */
export declare function createGeodesyCatalogForProfile(profile: GeodesyProfile, options?: CreateGeodesyCatalogForProfileOptions): GeodesyCatalog;
/** Couches actives par défaut pour un profil. */
export declare function defaultGeodesyActiveLayerIdsForProfile(profile: GeodesyProfile, options?: Pick<CreateGeodesyExpertCatalogOptions, 'wfsApiKey' | 'wfsLayerIds' | 'wfsDomainLayers'>): readonly GeodesyLayerId[];
/** Valeurs initiales des filtres attributs WFS (expert uniquement). */
export declare function defaultGeodesyWfsAttributeFilterValuesForProfile(profile: GeodesyProfile, options?: {
    wfsAttributeFilters?: readonly GeodesyWfsAttributeFilterDefinition[];
}): GeodesyWfsAttributeFilterValues;
//# sourceMappingURL=geodesyProfileCatalog.d.ts.map