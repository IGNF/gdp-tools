import {
  createGeodesyCatalog,
  type GeodesyCatalog,
  type GeodesyCatalogOptions,
  type GeodesyLayerId,
} from '../catalog/geodesyCatalog';
import type { GeodesyWfsLayerId } from '../constants/wfs';
import {
  GEODESY_PUBLIC_ATTRIBUTE_KEYS,
  type GeodesyPublicAttributeKey,
} from './geodesyPublicAttributeKeys';

/** Flux WMS proposés en profil grand public (TOUT reste technique pour GetFeatureInfo). */
export const GEODESY_PUBLIC_WMS_UI_LAYER_IDS = ['RBF', 'RDF', 'RN'] as const;

/** Couches actives par défaut (profil grand public). */
export const GEODESY_PUBLIC_DEFAULT_ACTIVE: readonly GeodesyLayerId[] = ['RBF'];

export interface CreateGeodesyPublicCatalogOptions extends GeodesyCatalogOptions {
  /**
   * Clé API WFS privé (GDP). Ignorée si {@link enableWfsLayers} est false.
   */
  wfsApiKey?: string;
  /**
   * Ajoute les flux WFS en complément du WMS (défaut : false — affichage tuiles seul).
   */
  enableWfsLayers?: boolean;
  /** Surcharge des champs fiche repère (défaut : {@link GEODESY_PUBLIC_ATTRIBUTE_KEYS}). */
  attributeKeys?: readonly GeodesyPublicAttributeKey[] | readonly string[];
}

function resolvePublicWfsLayerIds(
  options: CreateGeodesyPublicCatalogOptions,
): readonly GeodesyWfsLayerId[] {
  if (options.wfsLayerIds?.length) {
    return options.wfsLayerIds;
  }

  if (options.wfsLayers?.length) {
    return options.wfsLayers.map((layer) => layer.id);
  }

  if (!options.enableWfsLayers) {
    return [];
  }

  const apiKey = options.wfsApiKey?.trim();
  return apiKey ? (['DATA_GEOD', 'GDP'] as const) : (['DATA_GEOD'] as const);
}

/**
 * Catalogue « grand public » : tuiles WMS RBF / RDF / nivellement, GetFeatureInfo via TOUT,
 * fiche repère courte. WFS et annexes désactivés par défaut.
 *
 * Préférer {@link createGeodesyCatalogForProfile}('public', options) pour brancher un profil.
 */
export function createGeodesyPublicCatalog(
  options: CreateGeodesyPublicCatalogOptions = {},
): GeodesyCatalog {
  const wfsLayerIds = resolvePublicWfsLayerIds(options);
  const publicWmsLayerIds = [...GEODESY_PUBLIC_WMS_UI_LAYER_IDS, 'TOUT'] as const;

  return createGeodesyCatalog({
    ...options,
    layerIds: options.layerIds ?? publicWmsLayerIds,
    uiLayerIds: options.uiLayerIds ?? GEODESY_PUBLIC_WMS_UI_LAYER_IDS,
    dataLayerId: options.dataLayerId ?? 'TOUT',
    attributeKeys: options.attributeKeys ?? GEODESY_PUBLIC_ATTRIBUTE_KEYS,
    wfsLayerIds,
    wfsUiLayerIds: options.wfsUiLayerIds ?? wfsLayerIds,
    wfsApiKey: options.wfsApiKey?.trim() || undefined,
    wfsCluster: options.wfsCluster ?? { enabled: false },
    annexLayerIds: options.annexLayerIds ?? [],
    annexUiLayerIds: options.annexUiLayerIds ?? [],
  });
}
