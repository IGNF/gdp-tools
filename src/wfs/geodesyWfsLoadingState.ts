import type Map from 'ol/Map';
import type BaseLayer from 'ol/layer/Base';
import LayerGroup from 'ol/layer/Group';
import VectorLayer from 'ol/layer/Vector';
import Cluster from 'ol/source/Cluster';
import VectorSource from 'ol/source/Vector';
import type { EventsKey } from 'ol/events';
import { unByKey } from 'ol/Observable';

import { GEODESY_LAYER_GROUP_NAME } from '../constants/wms';
import { GEODESY_LAYER_KIND_PROPERTY } from '../constants/wfs';
import { GEODESY_WFS_DATA_LAYER_PROPERTY } from '../constants/wfsDomainLayers';
import { getGeodesyLayerGroup } from '../registerGeodesyOnMap';
import {
  getGeodesyWmsLoadingState,
  subscribeGeodesyWmsLoading,
} from '../wms/geodesyWmsTileLoad';

export interface GeodesyWfsLoadingState {
  /** Nombre de requêtes WFS bbox en cours sur les sources suivies. */
  pendingCount: number;
  /** Au moins une requête WFS bbox est en cours. */
  isLoading: boolean;
}

function unwrapWfsVectorSource(
  source: VectorSource | Cluster | null | undefined,
): VectorSource | null {
  if (!source) {
    return null;
  }

  if (source instanceof Cluster) {
    const inner = source.getSource();
    return inner instanceof VectorSource ? inner : null;
  }

  return source instanceof VectorSource ? source : null;
}

/** Sources vectorielles WFS qui chargent les entités (emprise courante, pas l’intégralité du flux). */
export function collectGeodesyWfsVectorSources(map: Map): VectorSource[] {
  const group = getGeodesyLayerGroup(map);
  if (!group) {
    return [];
  }

  const sources = new Set<VectorSource>();

  const visitLayer = (layer: BaseLayer): void => {
    if (layer instanceof LayerGroup) {
      layer.getLayers().forEach(visitLayer);
      return;
    }

    if (!(layer instanceof VectorLayer)) {
      return;
    }

    const isDataLayer = layer.get(GEODESY_WFS_DATA_LAYER_PROPERTY) === true;
    const isWfsLayer = layer.get(GEODESY_LAYER_KIND_PROPERTY) === 'wfs';

    if (!isDataLayer && !isWfsLayer) {
      return;
    }

    const vectorSource = unwrapWfsVectorSource(layer.getSource());
    if (vectorSource) {
      sources.add(vectorSource);
    }
  };

  group.getLayers().forEach(visitLayer);
  return [...sources];
}

function getSourcePendingCount(source: VectorSource): number {
  const loading = (source as VectorSource & { loading?: number | boolean }).loading;
  if (loading === false || loading === undefined) {
    return 0;
  }

  const numeric = Number(loading);
  return Number.isFinite(numeric) ? Math.max(0, numeric) : 0;
}

export function getGeodesyWfsLoadingState(map: Map): GeodesyWfsLoadingState {
  const pendingCount = collectGeodesyWfsVectorSources(map).reduce(
    (total, source) => total + getSourcePendingCount(source),
    0,
  );

  return {
    pendingCount,
    isLoading: pendingCount > 0,
  };
}

/** Écoute les chargements WFS bbox des couches géodésie sur la carte. */
export function subscribeGeodesyWfsLoading(
  map: Map,
  listener: (state: GeodesyWfsLoadingState) => void,
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

    for (const source of collectGeodesyWfsVectorSources(map)) {
      sourceKeys.push(
        source.on('featuresloadstart', () => {
          pendingCount += 1;
          notify();
        }),
        source.on('featuresloadend', () => {
          pendingCount = Math.max(0, pendingCount - 1);
          notify();
        }),
        source.on('featuresloaderror', () => {
          pendingCount = Math.max(0, pendingCount - 1);
          notify();
        }),
      );
    }

    notify();
  };

  bindSources();

  if (collectGeodesyWfsVectorSources(map).length === 0) {
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
