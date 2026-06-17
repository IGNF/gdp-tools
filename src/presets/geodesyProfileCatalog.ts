import type {
  GeodesyCatalog,
  GeodesyCatalogOptions,
  GeodesyLayerId,
} from '../catalog/geodesyCatalog';
import {
  createDefaultGeodesyWfsAttributeFilterValues,
  DEFAULT_GEODESY_EXPERT_WFS_ATTRIBUTE_FILTERS,
  type GeodesyWfsAttributeFilterDefinition,
  type GeodesyWfsAttributeFilterValues,
} from '../constants/wfsAttributeFilters';
import {
  createGeodesyExpertCatalog,
  defaultGeodesyExpertActiveLayerIds,
  type CreateGeodesyExpertCatalogOptions,
} from './geodesyExpertCatalog';
import {
  createGeodesyPublicCatalog,
  GEODESY_PUBLIC_DEFAULT_ACTIVE,
} from './geodesyPublicCatalog';

/** Profil d’affichage géodésie : grand public (WMS) ou expert (WFS, filtres, annexes). */
export type GeodesyProfile = 'public' | 'expert';

export interface CreateGeodesyCatalogForProfileOptions extends GeodesyCatalogOptions {
  /** @deprecated Profil public : WFS désactivé. Utiliser le profil `expert`. */
  enableWfsLayers?: boolean;
}

export function isGeodesyProfile(value: unknown): value is GeodesyProfile {
  return value === 'public' || value === 'expert';
}

/** Catalogue résolu selon le profil (public ou expert). */
export function createGeodesyCatalogForProfile(
  profile: GeodesyProfile,
  options: CreateGeodesyCatalogForProfileOptions = {},
): GeodesyCatalog {
  if (profile === 'expert') {
    return createGeodesyExpertCatalog(options);
  }

  return createGeodesyPublicCatalog(options);
}

/** Couches actives par défaut pour un profil. */
export function defaultGeodesyActiveLayerIdsForProfile(
  profile: GeodesyProfile,
  options: Pick<CreateGeodesyExpertCatalogOptions, 'wfsApiKey' | 'wfsLayerIds' | 'wfsDomainLayers'> = {},
): readonly GeodesyLayerId[] {
  if (profile === 'expert') {
    return defaultGeodesyExpertActiveLayerIds(options);
  }

  return GEODESY_PUBLIC_DEFAULT_ACTIVE;
}

/** Valeurs initiales des filtres attributs WFS (expert uniquement). */
export function defaultGeodesyWfsAttributeFilterValuesForProfile(
  profile: GeodesyProfile,
  options: {
    wfsAttributeFilters?: readonly GeodesyWfsAttributeFilterDefinition[];
  } = {},
): GeodesyWfsAttributeFilterValues {
  if (profile !== 'expert') {
    return {};
  }

  const filters = options.wfsAttributeFilters ?? DEFAULT_GEODESY_EXPERT_WFS_ATTRIBUTE_FILTERS;
  return createDefaultGeodesyWfsAttributeFilterValues(filters);
}
