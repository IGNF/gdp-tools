import { resolveGeodesyImageDisplayUrl } from '../cache/geodesyImageCache';
import {
  DEFAULT_GEODESY_ATTRIBUTE_CATALOG,
  isExcludedGeodesyAttributeKeyForCatalog,
  type GeodesyAttributeCatalog,
} from '../catalog/geodesyAttributeCatalog';
import { getGeodesyAttributeLabel } from '../constants/geodesyAttributeLabels';

/** Champs techniques ou non affichables dans les popups / fiches repère. */
export const EXCLUDED_GEODESY_ATTRIBUTE_KEYS = [
  'geometry',
  'boundedBy',
  'coordinate',
] as const;

const EXCLUDED_GEODESY_ATTRIBUTE_KEYS_SET = new Set(
  EXCLUDED_GEODESY_ATTRIBUTE_KEYS.map((key) => key.toLowerCase()),
);

export function isExcludedGeodesyAttributeKey(key: string): boolean {
  return key.startsWith('_') || EXCLUDED_GEODESY_ATTRIBUTE_KEYS_SET.has(key.toLowerCase());
}

export { getGeodesyAttributeLabel };

/** Alias conservé pour compatibilité. */
export function formatGeodesyAttributeLabel(key: string): string {
  return getGeodesyAttributeLabel(key);
}

function isUrlAttributeKey(key: string): boolean {
  const normalizedKey = key.toLowerCase();
  return normalizedKey.includes('url') || normalizedKey === 'lien' || normalizedKey === 'link';
}

function isUrlValue(value: string): boolean {
  return /^https?:\/\//i.test(value.trim());
}

/** Valeur absente ou chaîne vide (espaces ignorés). */
export function isEmptyGeodesyAttributeValue(value: unknown): boolean {
  if (value === null || value === undefined) {
    return true;
  }

  if (typeof value === 'object') {
    return true;
  }

  return String(value).trim() === '';
}

export function isGeodesyAttributeUrl(key: string, value: unknown): boolean {
  if (isEmptyGeodesyAttributeValue(value)) {
    return false;
  }

  const stringValue = String(value).trim();

  return isUrlAttributeKey(key) || isUrlValue(stringValue);
}

export function isGeodesyAttributePicto(key: string): boolean {
  return key.toLowerCase() === 'picto';
}

/** Champs *_url photo / croquis géodésie (hors PDF et autres liens). */
export function isGeodesyAttributeImageUrl(key: string, value: unknown): boolean {
  if (!isGeodesyAttributeUrl(key, value)) {
    return false;
  }

  const normalizedKey = key.toLowerCase();
  if (normalizedKey === 'url_pdf') {
    return false;
  }

  return (
    /^img\d*_url$/.test(normalizedKey) ||
    /^groupe_img\d*_url$/.test(normalizedKey) ||
    /^groupe_croquis\d*_url$/.test(normalizedKey)
  );
}

function escapeGeodesyAttributeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function formatGeodesyAttributeUrlHtml(value: unknown): string {
  const url = String(value).trim();
  const escapedUrl = escapeGeodesyAttributeHtml(url);

  return `<a href="${escapedUrl}" target="_blank" rel="noopener noreferrer">${escapedUrl}</a>`;
}

/** Miniature cliquable pour les URLs d’images dans la popup ol-ext. */
export function formatGeodesyAttributeImageUrlHtml(value: unknown, label = 'Image'): string {
  const url = String(value).trim();
  const displayUrl = resolveGeodesyImageDisplayUrl(url);
  const escapedUrl = escapeGeodesyAttributeHtml(url);
  const escapedDisplayUrl = escapeGeodesyAttributeHtml(displayUrl);
  const escapedLabel = escapeGeodesyAttributeHtml(label);

  return `<div class="geodesy-attribute-image">
  <a class="geodesy-attribute-image__link" href="${escapedUrl}" target="_blank" rel="noopener noreferrer" title="Ouvrir ${escapedLabel}">
    <img class="geodesy-attribute-image__thumb" src="${escapedDisplayUrl}" alt="${escapedLabel}" loading="lazy" />
    <span class="geodesy-attribute-image__caption">Ouvrir</span>
  </a>
</div>`;
}

export function getGeodesyScalarPropertyEntries(
  properties: Record<string, unknown>,
  attributeCatalog: GeodesyAttributeCatalog = DEFAULT_GEODESY_ATTRIBUTE_CATALOG,
): Array<[string, string]> {
  return Object.keys(properties).flatMap((key) => {
    if (isExcludedGeodesyAttributeKeyForCatalog(key, attributeCatalog)) {
      return [];
    }

    const value = properties[key];
    if (isEmptyGeodesyAttributeValue(value)) {
      return [];
    }

    return [[key, String(value).trim()]];
  });
}
