import type Map from 'ol/Map';
import type BaseLayer from 'ol/layer/Base';
import LayerGroup from 'ol/layer/Group';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';

import { GEODESY_LAYER_ID_PROPERTY } from '../constants/wms';
import { getGeodesyLayerGroup } from '../registerGeodesyOnMap';
import {
  getGeodesyWmsTileLoadPendingState,
  subscribeGeodesyWmsTileLoadPending,
} from './geodesyWmsTileLoadPending';

export interface GeodesyWmsLoadingState {
  /** Nombre de tuiles WMS géodésie en cours de chargement. */
  pendingCount: number;
  /** Au moins une tuile WMS géodésie est en cours de chargement. */
  isLoading: boolean;
}

/** Sources TileWMS des couches WMS géodésie dans le groupe carte. */
export function collectGeodesyWmsTileSources(map: Map): TileWMS[] {
  const group = getGeodesyLayerGroup(map);
  if (!group) {
    return [];
  }

  const sources = new Set<TileWMS>();

  const visitLayer = (layer: BaseLayer): void => {
    if (layer instanceof LayerGroup) {
      layer.getLayers().forEach(visitLayer);
      return;
    }

    if (!(layer instanceof TileLayer)) {
      return;
    }

    if (!layer.get(GEODESY_LAYER_ID_PROPERTY)) {
      return;
    }

    const source = layer.getSource();
    if (source instanceof TileWMS) {
      sources.add(source);
    }
  };

  group.getLayers().forEach(visitLayer);
  return [...sources];
}

export function getGeodesyWmsLoadingState(_map: Map): GeodesyWmsLoadingState {
  return getGeodesyWmsTileLoadPendingState();
}

/** Suit les chargements du chargeur WMS géodésie partagé (`geodesyWmsTileLoadFunction`). */
export function subscribeGeodesyWmsLoading(
  _map: Map,
  listener: (state: GeodesyWmsLoadingState) => void,
): () => void {
  return subscribeGeodesyWmsTileLoadPending(listener);
}