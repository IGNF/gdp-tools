import { clearGeodesyFeatureInfoCache, getGeodesyFeatureInfoCacheStats } from './geodesyFeatureInfoCache';
import { clearGeodesyImageCache, getGeodesyImageCacheStats } from './geodesyImageCache';

export interface GeodesyCacheStats {
  featureInfoEntryCount: number;
  featureInfoSizeBytes: number;
  imageEntryCount: number;
  imageSizeBytes: number;
}

export function getGeodesyCacheStats(): GeodesyCacheStats {
  const featureInfo = getGeodesyFeatureInfoCacheStats();
  const images = getGeodesyImageCacheStats();

  return {
    featureInfoEntryCount: featureInfo.entryCount,
    featureInfoSizeBytes: featureInfo.sizeBytes,
    imageEntryCount: images.entryCount,
    imageSizeBytes: images.sizeBytes,
  };
}

export function clearAllGeodesyCaches(): void {
  clearGeodesyFeatureInfoCache();
  clearGeodesyImageCache();
}
