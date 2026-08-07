import type ImageTile from 'ol/ImageTile';
import type Tile from 'ol/Tile';
import TileState from 'ol/TileState';

/** Timeout tuile WMS géodésie (libère les connexions HTTP vers data.geopf.fr). */
export const GEODESY_WMS_TILE_TIMEOUT_MS = 6_000;

/** Limite de requêtes WMS géodésie simultanées (laisse de la place au WMTS fond de carte). */
export const GEODESY_WMS_MAX_CONCURRENT_TILE_LOADS = 2;

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
          return;
        }

        const contentType = response.headers.get('content-type') ?? '';
        if (!isImageContentType(contentType)) {
          tile.setState(TileState.ERROR);
          return;
        }

        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        const image = (tile as ImageTile).getImage() as HTMLImageElement;

        image.onload = () => {
          URL.revokeObjectURL(objectUrl);
        };
        image.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          tile.setState(TileState.ERROR);
        };
        image.src = objectUrl;
      } catch {
        tile.setState(TileState.ERROR);
      } finally {
        window.clearTimeout(timeoutId);
        gate.release();
      }
    });
  };
}

/** Chargeur partagé par toutes les couches WMS géodésie. */
export const geodesyWmsTileLoadFunction = createGeodesyWmsTileLoadFunction();
