import type Map from 'ol/Map';
import { type GeodesyWfsLoadingState } from './wfs/geodesyWfsLoadingState';
/** Chargements WMS tuiles + WFS bbox des couches géodésie. */
export type GeodesyMapLoadingState = GeodesyWfsLoadingState;
export declare function getGeodesyMapLoadingState(map: Map): GeodesyMapLoadingState;
/** Écoute les chargements WMS et WFS géodésie sur la carte. */
export declare function subscribeGeodesyMapLoading(map: Map, listener: (state: GeodesyMapLoadingState) => void): () => void;
//# sourceMappingURL=geodesyMapLoadingState.d.ts.map