import {
  GDP_POINT_REPORT_THEME_ATTRIBUTE_KEYS,
  GEODESY_POINT_REPORT_MANDATORY_ATTRIBUTE_KEYS,
  GEODESY_POINT_REPORT_THEME_ATTRIBUTE_KEYS,
} from './geodesyPointReportConstants';
import { coerceGeodesyPointReportListValue, isGdpThemeMoveAttributeName } from './geodesyPointReportListValues';
import {
  buildGeodesyPointReportPrefillMap,
  matchGeodesyPointReportThemeAttributeName,
  resolveGeodesyPointReportPrefillValue,
} from './geodesyPointReportPrefill';
import type { GeodesyPointReportContext } from './geodesyPointReportContext';

export interface GeodesyPointReportAutofilledAttribute {
  name: string;
  default?: string;
  values?: readonly string[];
}

export interface GeodesyPointReportThemeAttributeDef {
  name: string;
  default?: string;
  values?: readonly string[];
}

export interface SelectGeodesyPointReportThemeAttributesOptions {
  /**
   * Clés de repli si `themeAttributeNames` est vide.
   * Défaut : {@link GEODESY_POINT_REPORT_THEME_ATTRIBUTE_KEYS} (compat pof-mobile).
   */
  keys?: readonly string[];
  /** Noms exacts du thème EspaceCo — source de vérité, la liste peut évoluer. */
  themeAttributeNames?: readonly string[];
  /** Saisie app (prioritaire sur le préremplissage WFS). */
  formAttributes?: Record<string, string>;
  /** Champs auto du thème (valeurs WFS ou `default`). */
  autofilledAttributes?: readonly GeodesyPointReportAutofilledAttribute[];
  /** Définitions thème (listes `values`) pour aligner les valeurs envoyées. */
  themeAttributeDefs?: readonly GeodesyPointReportThemeAttributeDef[];
}

/** Attributs identifiants toujours requis pour le signalement (`id`, `domaine`). */
export function buildGeodesyPointReportMandatoryThemeAttributes(
  context: GeodesyPointReportContext,
): Record<string, string> {
  const prefillMap = buildGeodesyPointReportPrefillMap(context);
  const attributes: Record<string, string> = {};

  for (const key of GEODESY_POINT_REPORT_MANDATORY_ATTRIBUTE_KEYS) {
    const value = resolveGeodesyPointReportPrefillValue(context, key, prefillMap);
    if (value) {
      attributes[key] = value;
    }
  }

  return attributes;
}

function resolveFormValueForThemeKey(
  themeKey: string,
  formAttributes: Record<string, string>,
): string | undefined {
  const direct = formAttributes[themeKey]?.trim();
  if (direct) {
    return direct;
  }

  for (const [name, rawValue] of Object.entries(formAttributes)) {
    const value = rawValue.trim();
    if (!value) {
      continue;
    }

    if (matchGeodesyPointReportThemeAttributeName(name, [themeKey])) {
      return value;
    }
  }

  return undefined;
}

function findThemeAttributeDef(
  attributeName: string,
  defs: readonly GeodesyPointReportThemeAttributeDef[],
): GeodesyPointReportThemeAttributeDef | undefined {
  return defs.find(
    (entry) =>
      entry.name === attributeName ||
      matchGeodesyPointReportThemeAttributeName(entry.name, [attributeName]) !== undefined ||
      matchGeodesyPointReportThemeAttributeName(attributeName, [entry.name]) !== undefined,
  );
}

function coerceAttributeRecord(
  attributes: Record<string, string>,
  defs: readonly GeodesyPointReportThemeAttributeDef[],
): Record<string, string> {
  const coerced: Record<string, string> = {};

  for (const [name, rawValue] of Object.entries(attributes)) {
    const def = findThemeAttributeDef(name, defs);
    const next = coerceGeodesyPointReportListValue(name, rawValue, def?.values ?? []);
    if (next) {
      coerced[name] = next;
    } else if (!def?.values?.length) {
      coerced[name] = rawValue;
    }
  }

  return coerced;
}

/**
 * Construit les attributs thème à envoyer (whitelist thème ou clés de repli).
 * N’ajoute jamais le dump de fiche WFS ni de sketch.
 */
export function selectGeodesyPointReportThemeAttributes(
  context: GeodesyPointReportContext,
  options: SelectGeodesyPointReportThemeAttributesOptions = {},
): Record<string, string> {
  const prefillMap = buildGeodesyPointReportPrefillMap(context);
  const formAttributes = options.formAttributes ?? {};
  const themeAttributeNames = (options.themeAttributeNames ?? []).filter((name) => name.trim());
  const keys =
    themeAttributeNames.length > 0
      ? themeAttributeNames
      : (options.keys ?? GEODESY_POINT_REPORT_THEME_ATTRIBUTE_KEYS);

  const attributes: Record<string, string> = {};

  for (const key of keys) {
    const fromForm = resolveFormValueForThemeKey(key, formAttributes);
    if (fromForm) {
      attributes[key] = fromForm;
      continue;
    }

    const candidate = resolveGeodesyPointReportPrefillValue(context, key, prefillMap);
    if (candidate) {
      attributes[key] = candidate;
    }
  }

  for (const attribute of options.autofilledAttributes ?? []) {
    if (attributes[attribute.name] !== undefined) {
      continue;
    }

    const fromContext = resolveGeodesyPointReportPrefillValue(
      context,
      attribute.name,
      prefillMap,
    );
    if (fromContext) {
      attributes[attribute.name] = fromContext;
      continue;
    }

    if (attribute.default) {
      attributes[attribute.name] = attribute.default;
    }
  }

  for (const [name, rawValue] of Object.entries(formAttributes)) {
    const value = rawValue.trim();
    if (!value) {
      continue;
    }

    const targetName = matchGeodesyPointReportThemeAttributeName(name, keys);
    if (!targetName) {
      continue;
    }

    attributes[targetName] = value;
  }

  for (const key of keys) {
    if (isGdpThemeMoveAttributeName(key) && attributes[key] === undefined) {
      attributes[key] = 'false';
    }
  }

  return coerceAttributeRecord(
    mergeGeodesyPointReportMandatoryThemeAttributes(context, attributes),
    options.themeAttributeDefs ?? options.autofilledAttributes ?? [],
  );
}

/**
 * Attributs thème collaboratif préremplis depuis le point géodésique.
 * Sans options : comportement historique (pof-mobile).
 */
export function buildGeodesyPointReportThemeAttributes(
  context: GeodesyPointReportContext,
  options?: SelectGeodesyPointReportThemeAttributesOptions,
): Record<string, string> {
  return selectGeodesyPointReportThemeAttributes(context, options);
}

/** Attributs thème GDP (`id`, `domaine`, `etat`, `gps`, `move`) + champs du thème EspaceCo. */
export function buildGdpPointReportThemeAttributes(
  context: GeodesyPointReportContext,
  options?: Omit<SelectGeodesyPointReportThemeAttributesOptions, 'keys'>,
): Record<string, string> {
  const themeNames = (options?.themeAttributeNames ?? []).filter((name) => name.trim());
  const mergedNames = [...themeNames];

  for (const key of GDP_POINT_REPORT_THEME_ATTRIBUTE_KEYS) {
    if (matchGeodesyPointReportThemeAttributeName(key, mergedNames)) {
      continue;
    }
    mergedNames.push(key);
  }

  return selectGeodesyPointReportThemeAttributes(context, {
    ...options,
    themeAttributeNames: mergedNames,
    keys: GDP_POINT_REPORT_THEME_ATTRIBUTE_KEYS,
  });
}

/** Fusionne les attributs thème en garantissant `id` et `domaine`. */
export function mergeGeodesyPointReportMandatoryThemeAttributes(
  context: GeodesyPointReportContext,
  themeAttributes: Record<string, string>,
): Record<string, string> {
  return {
    ...themeAttributes,
    ...buildGeodesyPointReportMandatoryThemeAttributes(context),
  };
}
