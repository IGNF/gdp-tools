import type Feature from 'ol/Feature';
import type Geometry from 'ol/geom/Geometry';

import {
  getGeodesyScalarPropertyEntries,
  isGeodesyAttributeImageUrl,
} from '../interaction/geodesyFeatureAttributes';
import type { GeodesyFeatureInfoHit } from '../wms/queryGeodesyAtCoordinate';
import { LruMemoryCache } from './lruMemoryCache';

interface CachedGeodesyImage {
  objectUrl: string;
  sizeBytes: number;
}

function normalizeImageUrl(url: string): string {
  return url.trim();
}

function revokeCachedImage(entry: CachedGeodesyImage): void {
  URL.revokeObjectURL(entry.objectUrl);
}

const imageCache = new LruMemoryCache<CachedGeodesyImage>(64, (entry) => {
  revokeCachedImage(entry);
});
const inflightFetches = new Map<string, Promise<string>>();

/** URL d’affichage (blob locale si déjà en cache, sinon URL distante). */
export function resolveGeodesyImageDisplayUrl(url: string): string {
  const normalizedUrl = normalizeImageUrl(url);
  return imageCache.get(normalizedUrl)?.objectUrl ?? normalizedUrl;
}

export function collectGeodesyImageUrlsFromProperties(
  properties: Record<string, unknown>,
): string[] {
  return getGeodesyScalarPropertyEntries(properties)
    .filter(([key, value]) => isGeodesyAttributeImageUrl(key, value))
    .map(([, value]) => normalizeImageUrl(value));
}

export function collectGeodesyImageUrlsFromHits(hits: GeodesyFeatureInfoHit[]): string[] {
  const urls = new Set<string>();

  for (const hit of hits) {
    for (const url of collectGeodesyImageUrlsFromProperties(hit.feature.getProperties())) {
      urls.add(url);
    }
  }

  return Array.from(urls);
}

export function collectGeodesyImageUrlsFromFeatures(
  features: Feature<Geometry>[],
): string[] {
  const urls = new Set<string>();

  for (const feature of features) {
    for (const url of collectGeodesyImageUrlsFromProperties(feature.getProperties())) {
      urls.add(url);
    }
  }

  return Array.from(urls);
}

async function fetchAndCacheGeodesyImage(url: string): Promise<string> {
  const normalizedUrl = normalizeImageUrl(url);
  const cached = imageCache.get(normalizedUrl);
  if (cached) {
    return cached.objectUrl;
  }

  const response = await fetch(normalizedUrl);
  if (!response.ok) {
    return normalizedUrl;
  }

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  imageCache.set(normalizedUrl, { objectUrl, sizeBytes: blob.size });
  return objectUrl;
}

/** Précharge une image géodésie (pattern blob → object URL, comme les tuiles EspaceCo). */
export async function prefetchGeodesyImage(url: string): Promise<string> {
  const normalizedUrl = normalizeImageUrl(url);
  const cached = imageCache.get(normalizedUrl);
  if (cached) {
    return cached.objectUrl;
  }

  const inflight = inflightFetches.get(normalizedUrl);
  if (inflight) {
    return inflight;
  }

  const promise = fetchAndCacheGeodesyImage(normalizedUrl).finally(() => {
    inflightFetches.delete(normalizedUrl);
  });
  inflightFetches.set(normalizedUrl, promise);
  return promise;
}

export async function prefetchGeodesyImages(urls: readonly string[]): Promise<void> {
  await Promise.all(urls.map((url) => prefetchGeodesyImage(url)));
}

export async function prefetchGeodesyImagesFromHits(hits: GeodesyFeatureInfoHit[]): Promise<void> {
  await prefetchGeodesyImages(collectGeodesyImageUrlsFromHits(hits));
}

/** Remplace les `src` distants par des blob URLs déjà mises en cache. */
export async function rewriteGeodesyHtmlSnippetImages(htmlSnippet: string): Promise<string> {
  const parser = new DOMParser();
  const document = parser.parseFromString(htmlSnippet, 'text/html');
  const images = document.querySelectorAll('img[src]');

  if (images.length === 0) {
    return htmlSnippet;
  }

  const imageUrls = Array.from(images)
    .map((image) => image.getAttribute('src'))
    .filter((src): src is string => Boolean(src?.trim()));

  await prefetchGeodesyImages(imageUrls);

  images.forEach((image) => {
    const src = image.getAttribute('src');
    if (!src) {
      return;
    }

    image.setAttribute('src', resolveGeodesyImageDisplayUrl(src));
  });

  const table = document.querySelector('table.featureInfo');
  return table?.outerHTML ?? document.body.innerHTML;
}

export function clearGeodesyImageCache(): void {
  imageCache.forEach((entry) => {
    revokeCachedImage(entry);
  });
  imageCache.clear();
  inflightFetches.clear();
}

export function getGeodesyImageCacheStats(): { entryCount: number; sizeBytes: number } {
  let sizeBytes = 0;

  imageCache.forEach((entry) => {
    sizeBytes += entry.sizeBytes;
  });

  return {
    entryCount: imageCache.entryCount,
    sizeBytes,
  };
}
