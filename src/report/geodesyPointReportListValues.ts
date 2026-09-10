import { matchGeodesyPointReportThemeAttributeName } from './geodesyPointReportPrefill';

/**
 * Valeurs liste EspaceCo `gps` du thème `gdp-tools` (communauté 96).
 * Repli si le thème n’a pas encore été chargé.
 */
export const GDP_THEME_GPS_VALUES = [
  'NON RENSEIGNE',
  'EXPLOITABLE DIRECTEMENT PAR GPS',
  'INEXPLOITABLE PAR GPS',
  'AUCUNE INFORMATION',
  'EXPLOITABLE PAR GPS DEPUIS UNE STATION EXCENTREE',
] as const;

/** Codes WFS `expl_gpscode` (`rn_gps_eploit_code`) → valeur thème. */
const GDP_THEME_GPS_BY_CODE: Record<string, (typeof GDP_THEME_GPS_VALUES)[number]> = {
  E: 'EXPLOITABLE DIRECTEMENT PAR GPS',
  R: 'EXPLOITABLE PAR GPS DEPUIS UNE STATION EXCENTREE',
  I: 'INEXPLOITABLE PAR GPS',
  N: 'NON RENSEIGNE',
};

/** Codes WFS `etatcode` / `etat` (`rn_etat_code`) → libellé. */
const GDP_THEME_ETAT_BY_CODE: Record<string, string> = {
  D: 'DETRUIT',
  E: 'BON ETAT',
  I: 'IMPRENABLE',
  M: 'MAUVAIS ETAT',
  N: 'NON RETROUVE',
  P: 'PRESUME DEPLACE',
  Y: 'DETRUIT APRES OBSERVATION',
};

export function normalizeGeodesyPointReportComparableValue(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

/** Retourne l’option liste EspaceCo correspondant à `value`, ou `undefined`. */
export function matchGeodesyPointReportListValue(
  value: string,
  allowedValues: readonly string[],
): string | undefined {
  const trimmed = value.trim();
  if (!trimmed || allowedValues.length === 0) {
    return undefined;
  }

  const exact = allowedValues.find((option) => option === trimmed);
  if (exact) {
    return exact;
  }

  const comparable = normalizeGeodesyPointReportComparableValue(trimmed);
  return allowedValues.find(
    (option) => normalizeGeodesyPointReportComparableValue(option) === comparable,
  );
}

function expandGdpThemeGpsCandidate(raw: string): string {
  const code = raw.trim().toUpperCase();
  return GDP_THEME_GPS_BY_CODE[code] ?? raw;
}

function expandGdpThemeEtatCandidate(raw: string): string {
  const code = raw.trim().toUpperCase();
  return GDP_THEME_ETAT_BY_CODE[code] ?? raw;
}

export function isGdpThemeGpsAttributeName(name: string): boolean {
  return matchGeodesyPointReportThemeAttributeName(name, ['gps']) !== undefined;
}

export function isGdpThemeEtatAttributeName(name: string): boolean {
  return matchGeodesyPointReportThemeAttributeName(name, ['etat']) !== undefined;
}

export function isGdpThemeMoveAttributeName(name: string): boolean {
  return matchGeodesyPointReportThemeAttributeName(name, ['move']) !== undefined;
}

function expandGdpThemeMoveCandidate(raw: string): string {
  const comparable = normalizeGeodesyPointReportComparableValue(raw);
  if (['true', '1', 'oui', 'yes'].includes(comparable)) {
    return 'true';
  }
  if (['false', '0', 'non', 'no'].includes(comparable)) {
    return 'false';
  }
  return raw;
}

/**
 * Aligne une valeur WFS / formulaire sur une option de liste EspaceCo.
 * `gps` : codes `E|R|I|N` et libellés RN → valeurs du thème `gdp-tools`.
 */
export function coerceGeodesyPointReportListValue(
  attributeName: string,
  rawValue: string,
  allowedValues: readonly string[] = [],
): string | undefined {
  const trimmed = rawValue.trim();
  const isGps = isGdpThemeGpsAttributeName(attributeName);
  const isEtat = isGdpThemeEtatAttributeName(attributeName);
  const isMove = isGdpThemeMoveAttributeName(attributeName);
  const allowed =
    allowedValues.length > 0 ? allowedValues : isGps ? GDP_THEME_GPS_VALUES : [];

  const candidates = [
    trimmed,
    isGps ? expandGdpThemeGpsCandidate(trimmed) : undefined,
    isEtat ? expandGdpThemeEtatCandidate(trimmed) : undefined,
    isMove ? expandGdpThemeMoveCandidate(trimmed) : undefined,
  ].filter((entry): entry is string => Boolean(entry?.trim()));

  if (allowed.length === 0) {
    return candidates[0];
  }

  for (const candidate of candidates) {
    const matched = matchGeodesyPointReportListValue(candidate, allowed);
    if (matched) {
      return matched;
    }
  }

  if (isGps) {
    return (
      matchGeodesyPointReportListValue('NON RENSEIGNE', allowed) ??
      matchGeodesyPointReportListValue('AUCUNE INFORMATION', allowed) ??
      allowed[0]
    );
  }

  if (isMove) {
    return matchGeodesyPointReportListValue('false', allowed) ?? allowed[0];
  }

  return undefined;
}
