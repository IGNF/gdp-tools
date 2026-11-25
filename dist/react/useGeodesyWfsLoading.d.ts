import type Map from 'ol/Map';
import type { GeodesyCatalog } from '../catalog/geodesyCatalog';
import type { GeodesyLayerVisibility } from '../geodesyLayerVisibility';
import { type GeodesyMapLoadingState } from '../geodesyMapLoadingState';
export interface UseGeodesyWfsLoadingOptions {
    catalog: GeodesyCatalog;
    visibility: GeodesyLayerVisibility;
    /** Affiche le suivi de chargement (désactivable par l’app hôte). @default true */
    showIndicator?: boolean;
    /**
     * Délai avant d’afficher l’indicateur (évite la pastille sur les chargements courts).
     * @default 0
     */
    showAfterMs?: number;
}
export interface UseGeodesyWfsLoadingResult extends GeodesyMapLoadingState {
    /** Durée écoulée depuis le début du chargement en cours (ms). */
    elapsedMs: number;
}
/** Suit les chargements WMS tuiles et WFS bbox des couches géodésie visibles. */
export declare function useGeodesyWfsLoading(map: Map | null, options: UseGeodesyWfsLoadingOptions): UseGeodesyWfsLoadingResult;
//# sourceMappingURL=useGeodesyWfsLoading.d.ts.map