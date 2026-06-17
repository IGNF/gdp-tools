import {
  GEODESY_POINT_REPORT_MANDATORY_ATTRIBUTE_KEYS,
  GEODESY_POINT_REPORT_THEME_ATTRIBUTE_KEYS,
} from './geodesyPointReportConstants';
import {
  buildGeodesyPointReportPrefillMap,
  resolveGeodesyPointReportPrefillValue,
} from './geodesyPointReportPrefill';
import type { GeodesyPointReportContext } from './geodesyPointReportContext';

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

/** Attributs thème collaboratif préremplis depuis le point géodésique. */
export function buildGeodesyPointReportThemeAttributes(
  context: GeodesyPointReportContext,
): Record<string, string> {
  const prefillMap = buildGeodesyPointReportPrefillMap(context);
  const attributes = buildGeodesyPointReportMandatoryThemeAttributes(context);

  for (const key of GEODESY_POINT_REPORT_THEME_ATTRIBUTE_KEYS) {
    if (attributes[key] !== undefined) {
      continue;
    }

    const value = resolveGeodesyPointReportPrefillValue(context, key, prefillMap);
    if (value) {
      attributes[key] = value;
    }
  }

  return attributes;
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
