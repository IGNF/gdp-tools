import type Map from 'ol/Map';
import type { GeodesyCatalog } from '../catalog/geodesyCatalog';
import type { GeodesyLayerVisibility } from '../geodesyLayerVisibility';
import { type GeodesyWfsLoadingState } from '../wfs/geodesyWfsLoadingState';
export interface UseGeodesyWfsLoadingOptions {
    catalog: GeodesyCatalog;
    visibility: GeodesyLayerVisibility;
    /** Affiche le suivi de chargement (désactivable par l’app hôte). @default true */
    showIndicator?: boolean;
}
export interface UseGeodesyWfsLoadingResult extends GeodesyWfsLoadingState {
    /** Durée écoulée depuis le début du chargement en cours (ms). */
    elapsedMs: number;
}
/** Suit les requêtes WFS bbox en cours pour les couches géodésie visibles. */
export declare function useGeodesyWfsLoading(map: Map | null, options: UseGeodesyWfsLoadingOptions): UseGeodesyWfsLoadingResult;
//# sourceMappingURL=useGeodesyWfsLoading.d.ts.map