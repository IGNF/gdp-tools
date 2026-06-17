/** Valeur par défaut du paramètre `source` sur les liens externes IGN. */
export const DEFAULT_GEODESY_EXTERNAL_URL_SOURCE = 'gdp-tools';

export function resolveGeodesyExternalUrlSource(source?: string): string {
  const trimmed = source?.trim();
  return trimmed || DEFAULT_GEODESY_EXTERNAL_URL_SOURCE;
}

/** Ajoute `source=…` à une URL externe (sans écraser les paramètres existants). */
export function appendGeodesySourceParam(
  url: string,
  source: string = DEFAULT_GEODESY_EXTERNAL_URL_SOURCE,
): string {
  const resolvedSource = resolveGeodesyExternalUrlSource(source);
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}source=${encodeURIComponent(resolvedSource)}`;
}

/** Fabrique un transformateur d’URL externe pour une application cliente. */
export function createGeodesyExternalUrlTransform(
  source: string = DEFAULT_GEODESY_EXTERNAL_URL_SOURCE,
): (url: string) => string {
  const resolvedSource = resolveGeodesyExternalUrlSource(source);
  return (url: string) => appendGeodesySourceParam(url, resolvedSource);
}
