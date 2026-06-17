import {
  createGeodesyCatalog,
  type GeodesyCatalog,
  type GeodesyCatalogOptions,
  type GeodesyLayerId,
} from '../catalog/geodesyCatalog';
import { GEODESIE_DATA_ATTRIBUTE_KEYS } from '../constants/geodesyAttributeLabels';
import type { GeodesyWfsLayerId } from '../constants/wfs';
import { DEFAULT_GEODESY_WFS_DOMAIN_LAYERS } from '../constants/wfsDomainLayers';
import {
  DEFAULT_GEODESY_EXPERT_WFS_ATTRIBUTE_FILTERS,
} from '../constants/wfsAttributeFilters';

/** Couche WFS source par défaut (flux public GEODESIE:data_geod). */
export const GEODESY_EXPERT_WFS_PRIMARY_LAYER: GeodesyWfsLayerId = 'DATA_GEOD';

/** Couche WFS optionnelle (flux privé GDP, si clé API). */
export const GEODESY_EXPERT_WFS_FALLBACK_LAYER: GeodesyWfsLayerId = 'GDP';

export interface CreateGeodesyExpertCatalogOptions extends GeodesyCatalogOptions {
  /** Clé API WFS privé — ajoute GDP en option à DATA_GEOD. */
  wfsApiKey?: string;
}

function resolveExpertWfsLayerIds(
  options: CreateGeodesyExpertCatalogOptions,
): readonly GeodesyWfsLayerId[] {
  if (options.wfsLayerIds?.length) {
    return options.wfsLayerIds;
  }

  if (options.wfsLayers?.length) {
    return options.wfsLayers.map((layer) => layer.id);
  }

  const apiKey = options.wfsApiKey?.trim();
  return apiKey ? (['DATA_GEOD', 'GDP'] as const) : (['DATA_GEOD'] as const);
}

function resolveExpertDomainLayers(
  options: CreateGeodesyExpertCatalogOptions,
): readonly (typeof DEFAULT_GEODESY_WFS_DOMAIN_LAYERS)[number][] {
  if (options.wfsDomainLayers !== undefined) {
    return options.wfsDomainLayers;
  }

  return DEFAULT_GEODESY_WFS_DOMAIN_LAYERS;
}

function resolveExpertAttributeFilters(
  options: CreateGeodesyExpertCatalogOptions,
): readonly (typeof DEFAULT_GEODESY_EXPERT_WFS_ATTRIBUTE_FILTERS)[number][] {
  if (options.wfsAttributeFilters !== undefined) {
    return options.wfsAttributeFilters;
  }

  return DEFAULT_GEODESY_EXPERT_WFS_ATTRIBUTE_FILTERS;
}

/** Couches actives par défaut (profil expert) — filtres domaine ou flux WFS unique. */
export function defaultGeodesyExpertActiveLayerIds(
  options: Pick<
    CreateGeodesyExpertCatalogOptions,
    'wfsApiKey' | 'wfsLayerIds' | 'wfsDomainLayers'
  > = {},
): readonly GeodesyLayerId[] {
  const domainLayers = resolveExpertDomainLayers(options);
  if (domainLayers.length > 0) {
    return domainLayers.map((layer) => layer.id);
  }

  const wfsLayerIds = resolveExpertWfsLayerIds(options);
  const primary = wfsLayerIds.includes(GEODESY_EXPERT_WFS_PRIMARY_LAYER)
    ? GEODESY_EXPERT_WFS_PRIMARY_LAYER
    : wfsLayerIds[0];

  return primary ? [primary] : [];
}

/**
 * Catalogue « expert » : affichage WFS (DATA_GEOD + GDP optionnel), attributs GEODESIE_DATA complets,
 * TOUT WMS réservé au secours GetFeatureInfo. Filtres domaine dans le switcher par défaut.
 */
export function createGeodesyExpertCatalog(
  options: CreateGeodesyExpertCatalogOptions = {},
): GeodesyCatalog {
  const wfsLayerIds = resolveExpertWfsLayerIds(options);
  const wfsDomainLayers = resolveExpertDomainLayers(options);
  const wfsAttributeFilters = resolveExpertAttributeFilters(options);
  return createGeodesyCatalog({
    ...options,
    layerIds: options.layerIds ?? ['TOUT'],
    uiLayerIds: options.uiLayerIds ?? [],
    networkLayerIds: options.networkLayerIds ?? [],
    dataLayerId: options.dataLayerId ?? 'TOUT',
    attributeKeys: options.attributeKeys ?? GEODESIE_DATA_ATTRIBUTE_KEYS,
    wfsLayerIds,
    wfsUiLayerIds: options.wfsUiLayerIds ?? wfsLayerIds,
    wfsDomainLayers,
    wfsDomainSourceLayerId:
      options.wfsDomainSourceLayerId ??
      (wfsLayerIds.includes(GEODESY_EXPERT_WFS_PRIMARY_LAYER)
        ? GEODESY_EXPERT_WFS_PRIMARY_LAYER
        : undefined),
    wfsAttributeFilters,
    wfsApiKey: options.wfsApiKey?.trim() || undefined,
    annexLayerIds: options.annexLayerIds ?? ['GDP_RGP2'],
    annexUiLayerIds: options.annexUiLayerIds ?? ['GDP_RGP2'],
  });
}
