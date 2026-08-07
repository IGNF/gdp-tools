import { LruMemoryCache } from './lruMemoryCache';

const featureInfoPayloadCache = new LruMemoryCache<string>(128);

/** Réponse GetFeatureInfo déjà récupérée (clé = URL WMS complète). */
export function getCachedFeatureInfoPayload(url: string): string | undefined {
  return featureInfoPayloadCache.get(url);
}

export function setCachedFeatureInfoPayload(url: string, payload: string): void {
  featureInfoPayloadCache.set(url, payload);
}

export function clearGeodesyFeatureInfoCache(): void {
  featureInfoPayloadCache.clear();
}

export function getGeodesyFeatureInfoCacheStats(): { entryCount: number; sizeBytes: number } {
  let sizeBytes = 0;

  featureInfoPayloadCache.forEach((payload, key) => {
    sizeBytes += key.length * 2;
    sizeBytes += payload.length * 2;
  });

  return {
    entryCount: featureInfoPayloadCache.entryCount,
    sizeBytes,
  };
}
