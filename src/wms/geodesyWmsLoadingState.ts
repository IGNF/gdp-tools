import type Map from 'ol/Map';
import type BaseLayer from 'ol/layer/Base';
import LayerGroup from 'ol/layer/Group';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';
import type { EventsKey } from 'ol/events';
import { unByKey } from 'ol/Observable';

import { GEODESY_LAYER_GROUP_NAME, GEODESY_LAYER_ID_PROPERTY } from '../constants/wms';
import { getGeodesyLayerGroup } from '../registerGeodesyOnMap';

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
  return {
    pendingCount: 0,
    isLoading: false,
  };
}

/** Écoute les chargements de tuiles WMS des couches géodésie sur la carte. */
export function subscribeGeodesyWmsLoading(
  map: Map,
  listener: (state: GeodesyWmsLoadingState) => void,
): () => void {
  const sourceKeys: EventsKey[] = [];
  let pendingCount = 0;

  const notify = (): void => {
    listener({
      pendingCount,
      isLoading: pendingCount > 0,
    });
  };

  const bindSources = (): void => {
    sourceKeys.forEach(unByKey);
    sourceKeys.length = 0;
    pendingCount = 0;

    for (const source of collectGeodesyWmsTileSources(map)) {
      sourceKeys.push(
        source.on('tileloadstart', () => {
          pendingCount += 1;
          notify();
        }),
        source.on('tileloadend', () => {
          pendingCount = Math.max(0, pendingCount - 1);
          notify();
        }),
        source.on('tileloaderror', () => {
          pendingCount = Math.max(0, pendingCount - 1);
          notify();
        }),
      );
    }

    notify();
  };

  bindSources();

  if (collectGeodesyWmsTileSources(map).length === 0) {
    window.setTimeout(bindSources, 0);
  }

  const layerKeys: EventsKey[] = [
    map.getLayers().on('add', (event) => {
      const layer = event.element;
      if (layer.get('name') === GEODESY_LAYER_GROUP_NAME) {
        bindSources();
      }
    }),
    map.getLayers().on('remove', (event) => {
      const layer = event.element;
      if (layer.get('name') === GEODESY_LAYER_GROUP_NAME) {
        bindSources();
      }
    }),
  ];

  return () => {
    sourceKeys.forEach(unByKey);
    layerKeys.forEach(unByKey);
  };
}