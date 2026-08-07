import {
  EXCLUDED_GEODESY_ATTRIBUTE_KEYS,
  isExcludedGeodesyAttributeKey,
} from '../interaction/geodesyFeatureAttributes';
import {
  GEODESIE_DATA_ATTRIBUTE_KEYS,
  GEODESY_ATTRIBUTE_LABELS,
  getGeodesyAttributeLabel,
} from '../constants/geodesyAttributeLabels';

/** Clés utilisées pour le titre de la popup / fiche repère (ordre de priorité). */
export const DEFAULT_GEODESY_TITLE_KEYS = [
  'nom',
  'NOM',
  'libelle',
  'LIBELLE',
  'name',
  'NAME',
  'id',
  'ID',
  'code',
  'CODE',
  '_caption',
] as const;

export interface GeodesyAttributeCatalog {
  attributeKeys: readonly string[];
  excludedKeys: readonly string[];
  titleKeys: readonly string[];
  labels: Readonly<Record<string, string>>;
}

export interface GeodesyAttributeCatalogOptions {
  /**
   * Champs affichables dans la popup / fiche repère (ordre respecté).
   * Défaut : {@link GEODESIE_DATA_ATTRIBUTE_KEYS} (catalogue IGN complet).
   */
  attributeKeys?: readonly string[];
  /** Champs techniques exclus en plus des exclusions par défaut. */
  excludedKeys?: readonly string[];
  /** Clés pour déduire le titre affiché. */
  titleKeys?: readonly string[];
  /** Surcharge des libellés (fusionnés avec {@link GEODESY_ATTRIBUTE_LABELS}). */
  labels?: Readonly<Record<string, string>>;
}

function uniqueKeys(keys: readonly string[]): string[] {
  const seen = new Set<string>();
  return keys.filter((key) => {
    const normalized = key.toLowerCase();
    if (seen.has(normalized)) {
      return false;
    }
    seen.add(normalized);
    return true;
  });
}

/** Construit un catalogue d’attributs GEODESIE_DATA (liste IGN complète par défaut). */
export function createGeodesyAttributeCatalog(
  options: GeodesyAttributeCatalogOptions = {},
): GeodesyAttributeCatalog {
  const attributeKeys = uniqueKeys(options.attributeKeys ?? GEODESIE_DATA_ATTRIBUTE_KEYS);
  const excludedKeys = uniqueKeys([
    ...EXCLUDED_GEODESY_ATTRIBUTE_KEYS,
    ...(options.excludedKeys ?? []),
  ]);
  const titleKeys = uniqueKeys(options.titleKeys ?? DEFAULT_GEODESY_TITLE_KEYS);

  return {
    attributeKeys,
    excludedKeys,
    titleKeys,
    labels: { ...GEODESY_ATTRIBUTE_LABELS, ...(options.labels ?? {}) },
  };
}

/** Catalogue IGN complet (tous les attributs documentés). */
export const DEFAULT_GEODESY_ATTRIBUTE_CATALOG = createGeodesyAttributeCatalog();

export function getGeodesyAttributeLabelFromCatalog(
  key: string,
  catalog: GeodesyAttributeCatalog = DEFAULT_GEODESY_ATTRIBUTE_CATALOG,
): string {
  const normalizedKey = key.toLowerCase();
  const label = catalog.labels[normalizedKey];
  if (label) {
    return label;
  }

  return getGeodesyAttributeLabel(key);
}

export function isExcludedGeodesyAttributeKeyForCatalog(
  key: string,
  catalog: GeodesyAttributeCatalog = DEFAULT_GEODESY_ATTRIBUTE_CATALOG,
): boolean {
  if (isExcludedGeodesyAttributeKey(key)) {
    return true;
  }

  const normalizedKey = key.toLowerCase();
  return catalog.excludedKeys.some((candidate) => candidate.toLowerCase() === normalizedKey);
}

/** Retourne le titre popup / fiche à partir des propriétés du point. */
export function resolveGeodesyPopupTitle(
  properties: Record<string, unknown>,
  catalog: GeodesyAttributeCatalog = DEFAULT_GEODESY_ATTRIBUTE_CATALOG,
  fallback = 'Point géodésique',
): string {
  for (const key of catalog.titleKeys) {
    const value = properties[key];
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      return String(value);
    }
  }

  return fallback;
}

/**
 * Filtre et ordonne les entrées attributs selon le catalogue.
 * Seuls les champs non vides présents dans {@link GeodesyAttributeCatalog.attributeKeys} sont conservés.
 */
export function selectGeodesyDisplayEntries(
  entries: Array<[string, string]>,
  catalog: GeodesyAttributeCatalog = DEFAULT_GEODESY_ATTRIBUTE_CATALOG,
): Array<[string, string]> {
  const byKeyLower = new Map<string, [string, string]>();

  for (const entry of entries) {
    const [key, value] = entry;
    if (!value.trim()) {
      continue;
    }
    byKeyLower.set(key.toLowerCase(), entry);
  }

  return catalog.attributeKeys.flatMap((key) => {
    const entry = byKeyLower.get(key.toLowerCase());
    return entry ? [entry] : [];
  });
}
