import { resolveGeodesyImageDisplayUrl } from '../cache/geodesyImageCache';
import type { GeodesyAttributeCatalog } from '../catalog/geodesyAttributeCatalog';
import { getGeodesyAttributeLabelFromCatalog } from '../catalog/geodesyAttributeCatalog';
import {
  getGeodesyScalarPropertyEntries,
  isGeodesyAttributeImageUrl,
} from '../interaction/geodesyFeatureAttributes';

export interface GeodesyPointPhoto {
  key: string;
  label: string;
  url: string;
  displayUrl: string;
}

/** Extrait les photos officielles du repère (champs `*_url` image). */
export function collectGeodesyPointPhotos(
  properties: Record<string, unknown>,
  attributeCatalog?: GeodesyAttributeCatalog,
): GeodesyPointPhoto[] {
  return getGeodesyScalarPropertyEntries(properties, attributeCatalog)
    .filter(([key, value]) => isGeodesyAttributeImageUrl(key, value))
    .map(([key, value]) => {
      const url = value.trim();
      return {
        key,
        label: getGeodesyAttributeLabelFromCatalog(key, attributeCatalog),
        url,
        displayUrl: resolveGeodesyImageDisplayUrl(url),
      };
    });
}
