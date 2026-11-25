import type Map from 'ol/Map';

import {
  getGeodesyWfsLoadingState,
  subscribeGeodesyWfsLoading,
  type GeodesyWfsLoadingState,
} from './wfs/geodesyWfsLoadingState';
import {
  getGeodesyWmsLoadingState,
  subscribeGeodesyWmsLoading,
} from './wms/geodesyWmsLoadingState';

/** Chargements WMS tuiles + WFS bbox des couches géodésie. */
export type GeodesyMapLoadingState = GeodesyWfsLoadingState;

export function getGeodesyMapLoadingState(map: Map): GeodesyMapLoadingState {
  const wfs = getGeodesyWfsLoadingState(map);
  const wms = getGeodesyWmsLoadingState(map);

  return {
    pendingCount: wfs.pendingCount + wms.pendingCount,
    isLoading: wfs.isLoading || wms.isLoading,
  };
}

/** Écoute les chargements WMS et WFS géodésie sur la carte. */
export function subscribeGeodesyMapLoading(
  map: Map,
  listener: (state: GeodesyMapLoadingState) => void,
): () => void {
  let wfsState = getGeodesyWfsLoadingState(map);
  let wmsState = getGeodesyWmsLoadingState(map);

  const notify = (): void => {
    listener({
      pendingCount: wfsState.pendingCount + wmsState.pendingCount,
      isLoading: wfsState.isLoading || wmsState.isLoading,
    });
  };

  const unsubscribeWfs = subscribeGeodesyWfsLoading(map, (state) => {
    wfsState = state;
    notify();
  });
  const unsubscribeWms = subscribeGeodesyWmsLoading(map, (state) => {
    wmsState = state;
    notify();
  });

  notify();

  return () => {
    unsubscribeWfs();
    unsubscribeWms();
  };
}