import type Map from 'ol/Map';
import TileWMS from 'ol/source/TileWMS';
export interface GeodesyWmsLoadingState {
    /** Nombre de tuiles WMS géodésie en cours de chargement. */
    pendingCount: number;
    /** Au moins une tuile WMS géodésie est en cours de chargement. */
    isLoading: boolean;
}
/** Sources TileWMS des couches WMS géodésie dans le groupe carte. */
export declare function collectGeodesyWmsTileSources(map: Map): TileWMS[];
export declare function getGeodesyWmsLoadingState(_map: Map): GeodesyWmsLoadingState;
/** Écoute les chargements de tuiles WMS des couches géodésie sur la carte. */
export declare function subscribeGeodesyWmsLoading(map: Map, listener: (state: GeodesyWmsLoadingState) => void): () => void;
//# sourceMappingURL=geodesyWmsLoadingState.d.ts.map