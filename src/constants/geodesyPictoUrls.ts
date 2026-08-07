import type { GeodesyWfsLayerId } from './wfs';
import {
  GEODESY_PICTO_SYMBOL_BASE_URL,
  normalizeGeodesyPictoCode,
  resolveGeodesyPictoUrl,
  type GeodesyPictoUrlMap,
} from '../style/geodesyWfsPictoStyle';

const symbol = (filename: string): string => `${GEODESY_PICTO_SYMBOL_BASE_URL}/${filename}`;

/** Fusionne les tables picto de plusieurs flux WFS. */
export function mergeGeodesyPictoUrlMaps(
  pictoUrlMaps: Readonly<Partial<Record<GeodesyWfsLayerId, GeodesyPictoUrlMap>>>,
): GeodesyPictoUrlMap {
  const merged: Record<string, string> = {};

  for (const map of Object.values(pictoUrlMaps)) {
    if (map) {
      Object.assign(merged, map);
    }
  }

  return merged;
}

/**
 * Résout l’URL du symbole IGN à partir du code `picto` et des tables du catalogue.
 * Cherche d’abord la couche WFS source, puis l’union de toutes les tables.
 */
export function resolveGeodesyPictoImageUrl(
  pictoCode: unknown,
  options: {
    pictoUrlMaps?: Readonly<Partial<Record<GeodesyWfsLayerId, GeodesyPictoUrlMap>>>;
    layerId?: string;
  } = {},
): string | undefined {
  const code = normalizeGeodesyPictoCode(pictoCode);
  if (!code) {
    return undefined;
  }

  const pictoUrlMaps = options.pictoUrlMaps ?? DEFAULT_GEODESY_WFS_PICTO_URL_MAPS;

  if (options.layerId) {
    const layerMap = pictoUrlMaps[options.layerId as GeodesyWfsLayerId];
    if (layerMap) {
      const layerUrl = resolveGeodesyPictoUrl(layerMap, code);
      if (layerUrl) {
        return layerUrl;
      }
    }
  }

  return resolveGeodesyPictoUrl(mergeGeodesyPictoUrlMaps(pictoUrlMaps), code);
}

/**
 * Correspondance code `picto` (flux GDP) → URL symbole Géoplateforme.
 * Convention fichiers : `{réseau}_{bon|bad|del}_15.gif` (ex. `rbf_bon_15.gif`).
 */
export const GEODESY_GDP_PICTO_URLS: GeodesyPictoUrlMap = {
  PT_RN_GOOD: symbol('rn_bon_15.gif'),
  PT_RN_BAD: symbol('rn_bad_15.gif'),
  PT_RN_DEL: symbol('rn_del_15.gif'),
  PT_RN_TRIPLET_GOOD: symbol('rn_triplet_15.gif'),
  PT_RN_TRIPLET_BAD: symbol('rn_triplet_15.gif'),
  PT_RN_TRIPLET_DEL: symbol('rn_triplet_15.gif'),
  PT_RDF_GOOD: symbol('rdf_bon_15.gif'),
  PT_RDF_BAD: symbol('rdf_bad_15.gif'),
  PT_RDF_DEL: symbol('rdf_del_15.gif'),
  PT_RBF_GOOD: symbol('rbf_bon_15.gif'),
  PT_RBF_BAD: symbol('rbf_bad_15.gif'),
  PT_RBF_DEL: symbol('rbf_del_15.gif'),

  PT_RN_CANEX_GOOD: symbol('rn_canex_bon_15.gif'),
  PT_RN_CANEX_BAD: symbol('rn_canex_bad_15.gif'),
  PT_RN_CANEX_DEL: symbol('rn_canex_del_15.gif'),


  PT_RDF_CANEX_GOOD: symbol('rdf_canex_bon_15.gif'),
  PT_RDF_CANEX_BAD: symbol('rdf_canex_bad_15.gif'),
  PT_RDF_CANEX_DEL: symbol('rdf_canex_del_15.gif'),


  PT_RN_CANEX_TRIPLET_GOOD: symbol('rn_canex_bon_15.gif'),
  PT_RN_CANEX_TRIPLET_BAD: symbol('rn_canex_bad_15.gif'),
  PT_RN_CANEX_TRIPLET_DEL: symbol('rn_canex_del_15.gif'),
};

/** Tables picto par défaut pour les couches WFS documentées. */
export const DEFAULT_GEODESY_WFS_PICTO_URL_MAPS: Readonly<
  Partial<Record<GeodesyWfsLayerId, GeodesyPictoUrlMap>>
> = {
  DATA_GEOD: GEODESY_GDP_PICTO_URLS,
  GDP: GEODESY_GDP_PICTO_URLS,
};
