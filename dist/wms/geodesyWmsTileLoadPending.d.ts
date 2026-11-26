export interface GeodesyWmsTileLoadPendingState {
    pendingCount: number;
    isLoading: boolean;
}
type GeodesyWmsTileLoadPendingListener = (state: GeodesyWmsTileLoadPendingState) => void;
/** Début du chargement effectif d’une tuile WMS géodésie (chargeur custom). */
export declare function beginGeodesyWmsTileLoad(): void;
/** Fin du chargement d’une tuile WMS géodésie (succès image, erreur ou timeout). */
export declare function endGeodesyWmsTileLoad(): void;
export declare function getGeodesyWmsTileLoadPendingState(): GeodesyWmsTileLoadPendingState;
export declare function subscribeGeodesyWmsTileLoadPending(listener: GeodesyWmsTileLoadPendingListener): () => void;
export {};
//# sourceMappingURL=geodesyWmsTileLoadPending.d.ts.map