import type ImageTile from 'ol/ImageTile';
import type Map from 'ol/Map';
import type BaseLayer from 'ol/layer/Base';
import LayerGroup from 'ol/layer/Group';
import TileLayer from 'ol/layer/Tile';
import type Tile from 'ol/Tile';
import TileState from 'ol/TileState';
import TileWMS from 'ol/source/TileWMS';

import { GEODESY_LAYER_ID_PROPERTY } from '../constants/wms';
import { getGeodesyLayerGroup } from '../registerGeodesyOnMap';

/** Timeout tuile WMS géodésie (libère les connexions HTTP vers data.geopf.fr). */
export const GEODESY_WMS_TILE_TIMEOUT_MS = 6_000;

/** Limite de requêtes WMS géodésie simultanées (laisse de la place au WMTS fond de carte). */
export const GEODESY_WMS_MAX_CONCURRENT_TILE_LOADS = 2;

export interface GeodesyWmsLoadingState {
  pendingCount: number;
  isLoading: boolean;
}

type GeodesyWmsLoadingListener = (state: GeodesyWmsLoadingState) => void;

let wmsPendingCount = 0;
const wmsLoadingListeners = new Set<GeodesyWmsLoadingListener>();

function wmsLoadingSnapshot(): GeodesyWmsLoadingState {
  return {
    pendingCount: wmsPendingCount,
    isLoading: wmsPendingCount > 0,
  };
}

function notifyWmsLoading(): void {
  const state = wmsLoadingSnapshot();
  wmsLoadingListeners.forEach((listener) => listener(state));
}

function beginGeodesyWmsTileLoad(): void {
  wmsPendingCount += 1;
  notifyWmsLoading();
}

function endGeodesyWmsTileLoad(): void {
  wmsPendingCount = Math.max(0, wmsPendingCount - 1);
  notifyWmsLoading();
}

export function getGeodesyWmsLoadingState(_map?: Map): GeodesyWmsLoadingState {
  return wmsLoadingSnapshot();
}

/** Suit les chargements du chargeur partagé (`geodesyWmsTileLoadFunction`). */
export function subscribeGeodesyWmsLoading(
  _map: Map,
  listener: (state: GeodesyWmsLoadingState) => void,
): () => void {
  wmsLoadingListeners.add(listener);
  listener(wmsLoadingSnapshot());
  return () => {
    wmsLoadingListeners.delete(listener);
  };
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

interface GeodesyWmsTileLoadOptions {
  timeoutMs?: number;
  maxConcurrent?: number;
}

function createConcurrencyGate(maxConcurrent: number) {
  let activeLoads = 0;
  const waitQueue: Array<() => void> = [];

  const acquire = (): Promise<void> => {
    if (activeLoads < maxConcurrent) {
      activeLoads += 1;
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      waitQueue.push(() => {
        activeLoads += 1;
        resolve();
      });
    });
  };

  const release = (): void => {
    activeLoads = Math.max(activeLoads - 1, 0);
    const next = waitQueue.shift();
    if (next) {
      next();
    }
  };

  return { acquire, release };
}

const defaultGate = createConcurrencyGate(GEODESY_WMS_MAX_CONCURRENT_TILE_LOADS);

function isImageContentType(contentType: string): boolean {
  return contentType.startsWith('image/');
}

/**
 * Chargeur de tuiles WMS géodésie :
 * - timeout court (évite de bloquer le pool HTTP du navigateur) ;
 * - concurrence limitée (WMTS fond de carte sur le même hôte).
 */
export function createGeodesyWmsTileLoadFunction(
  options: GeodesyWmsTileLoadOptions = {},
): (tile: Tile, src: string) => void {
  const timeoutMs = options.timeoutMs ?? GEODESY_WMS_TILE_TIMEOUT_MS;
  const gate = options.maxConcurrent
    ? createConcurrencyGate(options.maxConcurrent)
    : defaultGate;

  return (tile, src) => {
    void gate.acquire().then(async () => {
      beginGeodesyWmsTileLoad();
      let loadEnded = false;
      const finishLoad = (): void => {
        if (loadEnded) {
          return;
        }
        loadEnded = true;
        endGeodesyWmsTileLoad();
        gate.release();
      };

      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

      try {
        const response = await fetch(src, {
          signal: controller.signal,
          mode: 'cors',
          credentials: 'omit',
        });

        if (!response.ok) {
          tile.setState(TileState.ERROR);
          finishLoad();
          return;
        }

        const contentType = response.headers.get('content-type') ?? '';
        if (!isImageContentType(contentType)) {
          tile.setState(TileState.ERROR);
          finishLoad();
          return;
        }

        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        const image = (tile as ImageTile).getImage() as HTMLImageElement;

        image.onload = () => {
          URL.revokeObjectURL(objectUrl);
          finishLoad();
        };
        image.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          tile.setState(TileState.ERROR);
          finishLoad();
        };
        image.src = objectUrl;
      } catch {
        tile.setState(TileState.ERROR);
        finishLoad();
      } finally {
        window.clearTimeout(timeoutId);
      }
    });
  };
}

/** Chargeur partagé par toutes les couches WMS géodésie. */
export const geodesyWmsTileLoadFunction = createGeodesyWmsTileLoadFunction();