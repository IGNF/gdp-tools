import type Tile from 'ol/Tile';
/** Timeout tuile WMS géodésie (libère les connexions HTTP vers data.geopf.fr). */
export declare const GEODESY_WMS_TILE_TIMEOUT_MS = 6000;
/** Limite de requêtes WMS géodésie simultanées (laisse de la place au WMTS fond de carte). */
export declare const GEODESY_WMS_MAX_CONCURRENT_TILE_LOADS = 2;
interface GeodesyWmsTileLoadOptions {
    timeoutMs?: number;
    maxConcurrent?: number;
}
/**
 * Chargeur de tuiles WMS géodésie :
 * - timeout court (évite de bloquer le pool HTTP du navigateur) ;
 * - concurrence limitée (WMTS fond de carte sur le même hôte).
 */
export declare function createGeodesyWmsTileLoadFunction(options?: GeodesyWmsTileLoadOptions): (tile: Tile, src: string) => void;
/** Chargeur partagé par toutes les couches WMS géodésie. */
export declare const geodesyWmsTileLoadFunction: (tile: Tile, src: string) => void;
export {};
//# sourceMappingURL=geodesyWmsTileLoad.d.ts.map