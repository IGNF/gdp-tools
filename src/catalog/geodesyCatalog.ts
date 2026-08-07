import {
  GEODESY_DATA_LAYER_ID,
  GEODESY_WMS_GP_OL_EXT,
  GEODESY_WMS_LAYERS,
  GEODESY_WMS_URL,
  type GeodesyWmsLayerDefinition,
  type GeodesyWmsLayerId,
} from '../constants/wms';
import {
  GEODESY_ANNEX_LAYERS,
  type GeodesyAnnexLayerDefinition,
  type GeodesyAnnexLayerId,
} from '../constants/annex';
import type { GeodesyWfsLayerId } from '../constants/wfs';
import {
  type GeodesyWfsAttributeFilterDefinition,
} from '../constants/wfsAttributeFilters';
import {
  type GeodesyWfsDomainLayerDefinition,
  type GeodesyWfsDomainLayerId,
} from '../constants/wfsDomainLayers';
import {
  GEODESY_WFS_LAYERS,
  GEODESY_WFS_PRIVATE_URL,
  isGeodesyWfsLayerActive,
  type GeodesyWfsLayerDefinition,
} from '../constants/wfs';
import {
  DEFAULT_GEODESY_WFS_PICTO_URL_MAPS,
} from '../constants/geodesyPictoUrls';
import type { GeodesyPictoUrlMap } from '../style/geodesyWfsPictoStyle';
import {
  resolveGeodesyWfsClusterConfig,
  type GeodesyWfsClusterConfig,
  type GeodesyWfsClusterOptions,
} from '../constants/wfsCluster';
import {
  createGeodesyAttributeCatalog,
  type GeodesyAttributeCatalog,
  type GeodesyAttributeCatalogOptions,
} from './geodesyAttributeCatalog';

/** Identifiant de couche géodésie (WMS, WFS, annexe ou filtre domaine WFS). */
export type GeodesyLayerId =
  | GeodesyWmsLayerId
  | GeodesyWfsLayerId
  | GeodesyWfsDomainLayerId
  | GeodesyAnnexLayerId;

/** Propriété OpenLayers du groupe géodésie : catalogue résolu enregistré à l’init. */
export const GEODESY_CATALOG_PROPERTY = 'geodesyCatalog';

export interface GeodesyCatalog {
  layers: readonly GeodesyWmsLayerDefinition[];
  layerIds: readonly GeodesyWmsLayerId[];
  uiLayers: readonly GeodesyWmsLayerDefinition[];
  uiLayerIds: readonly GeodesyWmsLayerId[];
  dataLayerId: GeodesyWmsLayerId;
  networkLayerIds: readonly GeodesyWmsLayerId[];
  wmsUrl: string;
  wmsGpOlExt: string;
  attributes: GeodesyAttributeCatalog;
  wfsLayers: readonly GeodesyWfsLayerDefinition[];
  wfsLayerIds: readonly GeodesyWfsLayerId[];
  wfsUiLayers: readonly GeodesyWfsLayerDefinition[];
  wfsUiLayerIds: readonly GeodesyLayerId[];
  /** Filtres d’affichage WFS par champ `domaine` (profil expert). */
  wfsDomainLayers: readonly GeodesyWfsDomainLayerDefinition[];
  wfsDomainLayerIds: readonly GeodesyWfsDomainLayerId[];
  /** Flux WFS chargé une fois ; les couches domaine filtrent sa source. */
  wfsDomainSourceLayerId?: GeodesyWfsLayerId;
  /** Filtres attributs WFS (booléen, date, texte, choix — profil expert). */
  wfsAttributeFilters: readonly GeodesyWfsAttributeFilterDefinition[];
  wfsUrl: string;
  wfsApiKey?: string;
  wfsDataProjection: string;
  wfsBboxPaddingRatio: number;
  wfsUseCacheBuster: boolean;
  /** Symboles par couche WFS : code `picto` → URL (défaut IGN + surcharges catalogue). */
  wfsPictoUrlMaps: Readonly<Partial<Record<GeodesyWfsLayerId, GeodesyPictoUrlMap>>>;
  /** Regroupement animé des entités WFS (ol-ext AnimatedCluster). */
  wfsCluster: GeodesyWfsClusterConfig;
  annexLayers: readonly GeodesyAnnexLayerDefinition[];
  annexLayerIds: readonly GeodesyAnnexLayerId[];
  annexUiLayers: readonly GeodesyAnnexLayerDefinition[];
  annexUiLayerIds: readonly GeodesyAnnexLayerId[];
}

export interface GeodesyCatalogOptions extends GeodesyAttributeCatalogOptions {
  /**
   * Catalogue complet des couches (prioritaire sur {@link layerIds}).
   * Par défaut : {@link GEODESY_WMS_LAYERS}.
   */
  layers?: readonly GeodesyWmsLayerDefinition[];
  /** Sous-ensemble du catalogue IGN par identifiant (ex. exclure GRAVI). */
  layerIds?: readonly GeodesyWmsLayerId[];
  /**
   * Couches proposées dans les sélecteurs UI.
   * Défaut : toutes les couches du catalogue sauf {@link dataLayerId}.
   */
  uiLayerIds?: readonly GeodesyWmsLayerId[];
  /** Couche attributs GetFeatureInfo. Défaut : `TOUT`. */
  dataLayerId?: GeodesyWmsLayerId;
  /**
   * Couches réseau pour le filtrage `groupe_type` au clic.
   * Défaut : toutes sauf {@link dataLayerId}.
   */
  networkLayerIds?: readonly GeodesyWmsLayerId[];
  wmsUrl?: string;
  wmsGpOlExt?: string;
  /** Catalogue attributs (prioritaire sur attributeKeys / excludedKeys…). */
  attributes?: GeodesyAttributeCatalog;
  /** Catalogue WFS complet (prioritaire sur {@link wfsLayerIds}). */
  wfsLayers?: readonly GeodesyWfsLayerDefinition[];
  /** Sous-ensemble des flux WFS (publics ou privés avec {@link wfsApiKey}). */
  wfsLayerIds?: readonly GeodesyWfsLayerId[];
  /** Couches WFS proposées dans les sélecteurs UI. Défaut : toutes les couches WFS actives. */
  wfsUiLayerIds?: readonly GeodesyWfsLayerId[];
  wfsUrl?: string;
  /** Clé API pour les flux WFS privés (`requiresApiKey: true`). */
  wfsApiKey?: string;
  /** Projection des coordonnées dans la réponse CSV. */
  wfsDataProjection?: string;
  /** Marge relative autour de l’emprise pour le paramètre bbox (ex. 0.05). */
  wfsBboxPaddingRatio?: number;
  /** Ajoute le paramètre `_t` anti-cache aux requêtes WFS. */
  wfsUseCacheBuster?: boolean;
  /** Surcharge des symboles WFS (fusionnée avec {@link DEFAULT_GEODESY_WFS_PICTO_URL_MAPS}). */
  wfsPictoUrlMaps?: Partial<Record<GeodesyWfsLayerId, GeodesyPictoUrlMap>>;
  /** Clustering WFS (défaut : activé). Passer `{ enabled: false }` pour afficher chaque repère. */
  wfsCluster?: GeodesyWfsClusterOptions;
  /**
   * Couches switcher filtrées par `domaine` (ex. rsgf/rsgo → Géodésie).
   * Si non vide, remplace {@link wfsUiLayerIds} et masque le flux source dans l’UI.
   */
  wfsDomainLayers?: readonly GeodesyWfsDomainLayerDefinition[];
  /** Flux WFS source des filtres domaine (défaut : DATA_GEOD si actif, sinon GDP). */
  wfsDomainSourceLayerId?: GeodesyWfsLayerId;
  /** Filtres attributs proposés dans l’UI cliente (défaut : aucun). */
  wfsAttributeFilters?: readonly GeodesyWfsAttributeFilterDefinition[];
  /** Catalogue annexes complet (prioritaire sur {@link annexLayerIds}). */
  annexLayers?: readonly GeodesyAnnexLayerDefinition[];
  /** Sous-ensemble des flux annexes (fichiers texte Géoplateforme). */
  annexLayerIds?: readonly GeodesyAnnexLayerId[];
  /** Couches annexes proposées dans les sélecteurs UI. Défaut : toutes les couches annexes actives. */
  annexUiLayerIds?: readonly GeodesyAnnexLayerId[];
}

function uniqueLayerIds(ids: readonly GeodesyWmsLayerId[]): GeodesyWmsLayerId[] {
  return Array.from(new Set(ids));
}

function pickLayers(
  source: readonly GeodesyWmsLayerDefinition[],
  layerIds: readonly GeodesyWmsLayerId[],
): GeodesyWmsLayerDefinition[] {
  const byId = new Map(source.map((layer) => [layer.id, layer]));
  return layerIds.flatMap((id) => {
    const layer = byId.get(id);
    return layer ? [layer] : [];
  });
}

function resolveLayers(options: GeodesyCatalogOptions): readonly GeodesyWmsLayerDefinition[] {
  if (options.layers?.length) {
    return options.layers;
  }

  const base = GEODESY_WMS_LAYERS;
  if (options.layerIds?.length) {
    return pickLayers(base, uniqueLayerIds(options.layerIds));
  }

  return base;
}

function uniqueWfsLayerIds(ids: readonly GeodesyWfsLayerId[]): GeodesyWfsLayerId[] {
  return Array.from(new Set(ids));
}

function pickWfsLayers(
  source: readonly GeodesyWfsLayerDefinition[],
  layerIds: readonly GeodesyWfsLayerId[],
): GeodesyWfsLayerDefinition[] {
  const byId = new Map(source.map((layer) => [layer.id, layer]));
  return layerIds.flatMap((id) => {
    const layer = byId.get(id);
    return layer ? [layer] : [];
  });
}

function resolveWfsDomainSourceLayerId(
  preferred: GeodesyWfsLayerId | undefined,
  activeWfsLayerIds: readonly GeodesyWfsLayerId[],
): GeodesyWfsLayerId {
  if (preferred && activeWfsLayerIds.includes(preferred)) {
    return preferred;
  }

  if (activeWfsLayerIds.includes('DATA_GEOD')) {
    return 'DATA_GEOD';
  }

  if (activeWfsLayerIds.includes('GDP')) {
    return 'GDP';
  }

  const first = activeWfsLayerIds[0];
  if (!first) {
    throw new Error(
      '[gdp-tools] wfsDomainLayers require at least one active WFS layer in the catalog.',
    );
  }

  return first;
}

function uniqueAnnexLayerIds(ids: readonly GeodesyAnnexLayerId[]): GeodesyAnnexLayerId[] {
  return Array.from(new Set(ids));
}

function pickAnnexLayers(
  source: readonly GeodesyAnnexLayerDefinition[],
  layerIds: readonly GeodesyAnnexLayerId[],
): GeodesyAnnexLayerDefinition[] {
  const byId = new Map(source.map((layer) => [layer.id, layer]));
  return layerIds.flatMap((id) => {
    const layer = byId.get(id);
    return layer ? [layer] : [];
  });
}

function resolveAnnexLayers(
  options: GeodesyCatalogOptions,
): readonly GeodesyAnnexLayerDefinition[] {
  if (options.annexLayers?.length) {
    return options.annexLayers;
  }

  if (options.annexLayerIds?.length) {
    return pickAnnexLayers(GEODESY_ANNEX_LAYERS, uniqueAnnexLayerIds(options.annexLayerIds));
  }

  return [];
}

function resolveWfsLayers(
  options: GeodesyCatalogOptions,
): readonly GeodesyWfsLayerDefinition[] {
  let layers: GeodesyWfsLayerDefinition[] = [];

  if (options.wfsLayers?.length) {
    layers = [...options.wfsLayers];
  } else if (options.wfsLayerIds?.length) {
    layers = pickWfsLayers(GEODESY_WFS_LAYERS, uniqueWfsLayerIds(options.wfsLayerIds));
  } else {
    return [];
  }

  return layers.filter((layer) => isGeodesyWfsLayerActive(layer, options.wfsApiKey));
}

/** Construit un catalogue géodésie (catalogue IGN complet par défaut). */
export function createGeodesyCatalog(options: GeodesyCatalogOptions = {}): GeodesyCatalog {
  const layers = resolveLayers(options);
  const layerIds = layers.map((layer) => layer.id);
  const dataLayerId = options.dataLayerId ?? GEODESY_DATA_LAYER_ID;

  if (!layerIds.includes(dataLayerId)) {
    throw new Error(
      `[gdp-tools] dataLayerId "${dataLayerId}" must be included in the catalog layers.`,
    );
  }

  const defaultNetworkIds = layerIds.filter((id) => id !== dataLayerId);
  const networkLayerIds = uniqueLayerIds(options.networkLayerIds ?? defaultNetworkIds).filter((id) =>
    layerIds.includes(id),
  );

  const defaultUiIds = layerIds.filter((id) => id !== dataLayerId);
  const uiLayerIds = uniqueLayerIds(options.uiLayerIds ?? defaultUiIds).filter((id) =>
    layerIds.includes(id),
  );
  const uiLayers = pickLayers(layers, uiLayerIds);
  const attributes =
    options.attributes ??
    createGeodesyAttributeCatalog({
      attributeKeys: options.attributeKeys,
      excludedKeys: options.excludedKeys,
      titleKeys: options.titleKeys,
      labels: options.labels,
    });

  const wfsLayers = resolveWfsLayers(options);
  const wfsLayerIds = wfsLayers.map((layer) => layer.id);
  const wfsUiLayerIds = uniqueWfsLayerIds(options.wfsUiLayerIds ?? wfsLayerIds).filter((id) =>
    wfsLayerIds.includes(id),
  );
  const wfsUiLayers = pickWfsLayers(wfsLayers, wfsUiLayerIds);
  const wfsDomainLayers = options.wfsDomainLayers ?? [];
  const wfsDomainLayerIds = wfsDomainLayers.map((layer) => layer.id);
  const wfsAttributeFilters = options.wfsAttributeFilters ?? [];
  const wfsDomainSourceLayerId =
    wfsDomainLayers.length > 0
      ? resolveWfsDomainSourceLayerId(options.wfsDomainSourceLayerId, wfsLayerIds)
      : undefined;
  const resolvedWfsUiLayerIds: GeodesyLayerId[] =
    wfsDomainLayers.length > 0 ? [...wfsDomainLayerIds] : [...wfsUiLayerIds];
  const annexLayers = resolveAnnexLayers(options);
  const annexLayerIds = annexLayers.map((layer) => layer.id);
  const annexUiLayerIds = uniqueAnnexLayerIds(options.annexUiLayerIds ?? annexLayerIds).filter(
    (id) => annexLayerIds.includes(id),
  );
  const annexUiLayers = pickAnnexLayers(annexLayers, annexUiLayerIds);

  return {
    layers,
    layerIds,
    uiLayers,
    uiLayerIds,
    dataLayerId,
    networkLayerIds,
    wmsUrl: options.wmsUrl ?? GEODESY_WMS_URL,
    wmsGpOlExt: options.wmsGpOlExt ?? GEODESY_WMS_GP_OL_EXT,
    attributes,
    wfsLayers,
    wfsLayerIds,
    wfsUiLayers,
    wfsUiLayerIds: resolvedWfsUiLayerIds,
    wfsDomainLayers,
    wfsDomainLayerIds,
    wfsDomainSourceLayerId,
    wfsAttributeFilters,
    wfsUrl: options.wfsUrl ?? GEODESY_WFS_PRIVATE_URL,
    wfsApiKey: options.wfsApiKey,
    wfsDataProjection: options.wfsDataProjection ?? 'EPSG:4326',
    wfsBboxPaddingRatio: options.wfsBboxPaddingRatio ?? 0.05,
    wfsUseCacheBuster: options.wfsUseCacheBuster ?? true,
    wfsPictoUrlMaps: {
      ...DEFAULT_GEODESY_WFS_PICTO_URL_MAPS,
      ...(options.wfsPictoUrlMaps ?? {}),
    },
    wfsCluster: resolveGeodesyWfsClusterConfig(options.wfsCluster),
    annexLayers,
    annexLayerIds,
    annexUiLayers,
    annexUiLayerIds,
  };
}

/** Catalogue IGN complet (toutes les couches documentées). */
export const DEFAULT_GEODESY_CATALOG = createGeodesyCatalog();

export function getLayerDefinition(
  catalog: GeodesyCatalog,
  layerId: GeodesyWmsLayerId,
): GeodesyWmsLayerDefinition | undefined {
  return catalog.layers.find((layer) => layer.id === layerId);
}

export function getLayerStackIndex(
  catalog: GeodesyCatalog,
  layerId: GeodesyWmsLayerId,
): number {
  const index = catalog.layerIds.indexOf(layerId);
  return index >= 0 ? index : catalog.layerIds.length;
}

/** Identifiants WMS + WFS (ou filtres domaine) + annexes du catalogue. */
export function getGeodesyCatalogLayerIds(catalog: GeodesyCatalog): GeodesyLayerId[] {
  if (catalog.wfsDomainLayerIds.length > 0) {
    const sourceIds = catalog.wfsDomainSourceLayerId ? [catalog.wfsDomainSourceLayerId] : [];
    return [...catalog.layerIds, ...sourceIds, ...catalog.wfsDomainLayerIds, ...catalog.annexLayerIds];
  }

  return [...catalog.layerIds, ...catalog.wfsLayerIds, ...catalog.annexLayerIds];
}
