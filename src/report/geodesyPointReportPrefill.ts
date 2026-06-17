import { GEODESY_POINT_REPORT_MANDATORY_ATTRIBUTE_KEYS } from './geodesyPointReportConstants';
import type { GeodesyPointReportContext } from './geodesyPointReportContext';

function readGeodesyPointReportId(properties: Record<string, unknown>): string | undefined {
  for (const key of ['id', 'ID'] as const) {
    const raw = properties[key];
    if (raw === null || raw === undefined) {
      continue;
    }

    const normalized = String(raw).trim();
    if (normalized) {
      return normalized;
    }
  }

  return undefined;
}

/** Alias connus entre champs thème EspaceCo et propriétés repère GEODESIE_DATA. */
const CANONICAL_ATTRIBUTE_ALIASES: Record<string, readonly string[]> = {
  id: ['id', 'identifiant', 'geodesyid', 'geodesy_id', 'id_repere', 'idrepere'],
  domaine: ['domaine', 'domain', 'code_domaine'],
  nom: ['nom', 'name', 'libelle', 'libelle_repere'],
  no: ['no', 'numero', 'numero_repere', 'num_repere'],
  type: ['type', 'groupe_type', 'groupetype'],
  etat: ['etat', 'state'],
  commune: ['commune', 'nom_commune'],
};

export function normalizeGeodesyPointReportAttributeName(name: string): string {
  return name.trim().toLowerCase();
}

function registerPrefillValue(
  map: Record<string, string>,
  key: string,
  value: unknown,
): void {
  if (value === null || value === undefined) {
    return;
  }

  const normalized = String(value).trim();
  if (!normalized) {
    return;
  }

  const name = normalizeGeodesyPointReportAttributeName(key);
  if (!map[name]) {
    map[name] = normalized;
  }
}

/** Index insensible à la casse de toutes les propriétés repère exploitables. */
export function buildGeodesyPointReportPrefillMap(
  context: GeodesyPointReportContext,
): Record<string, string> {
  const map: Record<string, string> = {};

  for (const [key, value] of Object.entries(context.properties)) {
    registerPrefillValue(map, key, value);
  }

  const businessId = context.geodesyId ?? readGeodesyPointReportId(context.properties);
  registerPrefillValue(map, 'id', businessId);
  registerPrefillValue(map, 'domaine', context.properties.domaine ?? context.properties.DOMAINE);

  return map;
}

function expandAttributeLookupNames(attributeName: string): string[] {
  const normalized = normalizeGeodesyPointReportAttributeName(attributeName);
  const names = new Set<string>([normalized]);

  for (const [canonical, aliases] of Object.entries(CANONICAL_ATTRIBUTE_ALIASES)) {
    const canonicalNorm = normalizeGeodesyPointReportAttributeName(canonical);
    const aliasNorms = aliases.map((alias) => normalizeGeodesyPointReportAttributeName(alias));

    if (normalized === canonicalNorm || aliasNorms.includes(normalized)) {
      names.add(canonicalNorm);
      for (const alias of aliasNorms) {
        names.add(alias);
      }
    }
  }

  return [...names];
}

export function isGeodesyPointReportMandatoryAttributeName(name: string): boolean {
  const normalized = normalizeGeodesyPointReportAttributeName(name);
  return GEODESY_POINT_REPORT_MANDATORY_ATTRIBUTE_KEYS.some(
    (key) => key.toLowerCase() === normalized,
  );
}

/** True si le repère cliqué possède un identifiant géodésique exploitable. */
export function isGeodesyPointReportExistingRepere(context: GeodesyPointReportContext): boolean {
  return resolveGeodesyPointReportPrefillValue(context, 'id') !== undefined;
}

/** Valeur préremplie pour un champ thème (comparaison insensible à la casse + alias). */
export function resolveGeodesyPointReportPrefillValue(
  context: GeodesyPointReportContext,
  attributeName: string,
  prefillMap: Record<string, string> = buildGeodesyPointReportPrefillMap(context),
): string | undefined {
  for (const lookup of expandAttributeLookupNames(attributeName)) {
    const value = prefillMap[lookup];
    if (value) {
      return value;
    }
  }

  return undefined;
}

/**
 * Champs `id` / `domaine` : affichés et préremplis seulement si le repère en fournit une valeur.
 * Les autres champs thème restent visibles.
 */
export function shouldShowGeodesyPointReportThemeAttribute(
  context: GeodesyPointReportContext,
  attributeName: string,
  prefillMap: Record<string, string> = buildGeodesyPointReportPrefillMap(context),
): boolean {
  if (!isGeodesyPointReportMandatoryAttributeName(attributeName)) {
    return true;
  }

  return resolveGeodesyPointReportPrefillValue(context, attributeName, prefillMap) !== undefined;
}
