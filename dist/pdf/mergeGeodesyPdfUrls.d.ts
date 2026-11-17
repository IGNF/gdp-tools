import type { GeodesyPdfFetchFn } from './geodesyPdfFetch';
export interface MergeGeodesyPdfSkippedUrl {
    url: string;
    reason: string;
}
export interface MergeGeodesyPdfUrlsProgress {
    phase: 'fetch' | 'merge';
    completed: number;
    total: number;
}
export interface MergeGeodesyPdfUrlsOptions {
    /** URLs de fiches PDF (doublons ignorés, ordre conservé). */
    urls: readonly string[];
    fetchPdf?: GeodesyPdfFetchFn;
    signal?: AbortSignal;
    onProgress?: (progress: MergeGeodesyPdfUrlsProgress) => void;
}
export interface MergeGeodesyPdfUrlsResult {
    pdfBytes: Uint8Array;
    mergedCount: number;
    skipped: readonly MergeGeodesyPdfSkippedUrl[];
}
export declare class MergeGeodesyPdfUrlsError extends Error {
    constructor(message: string);
}
export declare function buildMergedGeodesyPdfFilename(date?: Date): string;
export declare function mergeGeodesyPdfUrls(options: MergeGeodesyPdfUrlsOptions): Promise<MergeGeodesyPdfUrlsResult>;
//# sourceMappingURL=mergeGeodesyPdfUrls.d.ts.map