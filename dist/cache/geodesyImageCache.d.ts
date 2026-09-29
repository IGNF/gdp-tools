import type Feature from 'ol/Feature';
import type Geometry from 'ol/geom/Geometry';
import type { GeodesyFeatureInfoHit } from '../wms/queryGeodesyAtCoordinate';
/** URL d’affichage (blob locale si déjà en cache, sinon URL distante). */
export declare function resolveGeodesyImageDisplayUrl(url: string): string;
export declare function collectGeodesyImageUrlsFromProperties(properties: Record<string, unknown>): string[];
export declare function collectGeodesyImageUrlsFromHits(hits: GeodesyFeatureInfoHit[]): string[];
export declare function collectGeodesyImageUrlsFromFeatures(features: Feature<Geometry>[]): string[];
/** Précharge une image géodésie (pattern blob → object URL, comme les tuiles EspaceCo). */
export declare function prefetchGeodesyImage(url: string): Promise<string>;
export declare function prefetchGeodesyImages(urls: readonly string[]): Promise<void>;
export declare function prefetchGeodesyImagesFromHits(hits: GeodesyFeatureInfoHit[]): Promise<void>;
/** Remplace les `src` distants par des blob URLs déjà mises en cache. */
export declare function rewriteGeodesyHtmlSnippetImages(htmlSnippet: string): Promise<string>;
export declare function clearGeodesyImageCache(): void;
export declare function getGeodesyImageCacheStats(): {
    entryCount: number;
    sizeBytes: number;
};
//# sourceMappingURL=geodesyImageCache.d.ts.map