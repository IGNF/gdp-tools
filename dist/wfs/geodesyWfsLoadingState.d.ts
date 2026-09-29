import type Map from 'ol/Map';
import VectorSource from 'ol/source/Vector';
export interface GeodesyWfsLoadingState {
    /** Nombre de requêtes WFS bbox en cours sur les sources suivies. */
    pendingCount: number;
    /** Au moins une requête WFS bbox est en cours. */
    isLoading: boolean;
}
/** Sources vectorielles WFS qui chargent les entités (emprise courante, pas l’intégralité du flux). */
export declare function collectGeodesyWfsVectorSources(map: Map): VectorSource[];
export declare function getGeodesyWfsLoadingState(map: Map): GeodesyWfsLoadingState;
/** Écoute les chargements WFS bbox des couches géodésie sur la carte. */
export declare function subscribeGeodesyWfsLoading(map: Map, listener: (state: GeodesyWfsLoadingState) => void): () => void;
//# sourceMappingURL=geodesyWfsLoadingState.d.ts.map