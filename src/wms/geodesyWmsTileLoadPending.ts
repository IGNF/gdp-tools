export interface GeodesyWmsTileLoadPendingState {
  pendingCount: number;
  isLoading: boolean;
}

type GeodesyWmsTileLoadPendingListener = (state: GeodesyWmsTileLoadPendingState) => void;

let pendingCount = 0;
const listeners = new Set<GeodesyWmsTileLoadPendingListener>();

function snapshot(): GeodesyWmsTileLoadPendingState {
  return {
    pendingCount,
    isLoading: pendingCount > 0,
  };
}

function notify(): void {
  const state = snapshot();
  listeners.forEach((listener) => listener(state));
}

/** Début du chargement effectif d’une tuile WMS géodésie (chargeur custom). */
export function beginGeodesyWmsTileLoad(): void {
  pendingCount += 1;
  notify();
}

/** Fin du chargement d’une tuile WMS géodésie (succès image, erreur ou timeout). */
export function endGeodesyWmsTileLoad(): void {
  pendingCount = Math.max(0, pendingCount - 1);
  notify();
}

export function getGeodesyWmsTileLoadPendingState(): GeodesyWmsTileLoadPendingState {
  return snapshot();
}

export function subscribeGeodesyWmsTileLoadPending(
  listener: GeodesyWmsTileLoadPendingListener,
): () => void {
  listeners.add(listener);
  listener(snapshot());
  return () => {
    listeners.delete(listener);
  };
}