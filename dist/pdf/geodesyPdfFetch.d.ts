/** Chemin same-origin du proxy de téléchargement PDF (Vite dev / Apache qualif). */
export declare const DEFAULT_GEODESY_PDF_FETCH_PROXY_PATH = "/__gdp-pdf";
export type GeodesyPdfFetchFn = (url: string, signal?: AbortSignal) => Promise<Uint8Array>;
export declare class GeodesyPdfFetchError extends Error {
    url: string;
    status?: number;
    constructor(message: string, url: string, status?: number);
}
/** Hôtes autorisés pour le relais serveur (évite l’open proxy). */
export declare function isAllowedGeodesyPdfFetchUrl(urlString: string): boolean;
export declare function isGeodesyPdfBytes(bytes: Uint8Array): boolean;
export declare function fetchGeodesyPdfBytes(url: string, options?: {
    signal?: AbortSignal;
    fetchImpl?: typeof fetch;
}): Promise<Uint8Array>;
/** Relais same-origin : `GET {proxyMount}?url=…` (contourne CORS côté navigateur). */
export declare function createGeodesyPdfProxyFetch(proxyMountPath: string): GeodesyPdfFetchFn;
/**
 * Panier web : tente d’abord le téléchargement CORS direct (ex. annexes `data.geopf.fr`),
 * puis le proxy same-origin si le direct échoue (CORS absent, qualif sans Apache `__gdp-pdf`).
 */
export declare function createGeodesyPdfFetchWithProxyFallback(proxyMountPath: string): GeodesyPdfFetchFn;
//# sourceMappingURL=geodesyPdfFetch.d.ts.map