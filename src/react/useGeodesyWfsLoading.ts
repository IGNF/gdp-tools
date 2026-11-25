import type Map from 'ol/Map';
import { useEffect, useRef, useState } from 'react';

import type { GeodesyCatalog } from '../catalog/geodesyCatalog';
import type { GeodesyLayerVisibility } from '../geodesyLayerVisibility';
import {
  subscribeGeodesyMapLoading,
  type GeodesyMapLoadingState,
} from '../geodesyMapLoadingState';

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

const MIN_VISIBLE_MS = 400;

function isGeodesyMapLoadingEnabled(
  catalog: GeodesyCatalog,
  visibility: GeodesyLayerVisibility,
): boolean {
  const wmsActive = catalog.layers.some(
    (layer) => layer.id !== catalog.dataLayerId && visibility[layer.id],
  );
  if (wmsActive) {
    return true;
  }

  const displayLayers =
    catalog.wfsDomainLayers.length > 0 ? catalog.wfsDomainLayers : catalog.wfsLayers;

  return displayLayers.some((layer) => visibility[layer.id]);
}

function elapsedSince(startedAt: number | null): number {
  return startedAt === null ? 0 : Date.now() - startedAt;
}

/** Suit les chargements WMS tuiles et WFS bbox des couches géodésie visibles. */
export function useGeodesyWfsLoading(
  map: Map | null,
  options: UseGeodesyWfsLoadingOptions,
): UseGeodesyWfsLoadingResult {
  const { catalog, visibility, showIndicator = true, showAfterMs = 0 } = options;
  const enabled = showIndicator && isGeodesyMapLoadingEnabled(catalog, visibility);
  const loadingStartedAtRef = useRef<number | null>(null);
  const hideTimeoutRef = useRef<number | null>(null);
  const showAfterTimeoutRef = useRef<number | null>(null);
  const geodesyLoadingActiveRef = useRef(false);
  const indicatorVisibleRef = useRef(false);

  const [state, setState] = useState<UseGeodesyWfsLoadingResult>({
    pendingCount: 0,
    isLoading: false,
    elapsedMs: 0,
  });

  useEffect(() => {
    if (!map || !enabled) {
      geodesyLoadingActiveRef.current = false;
      indicatorVisibleRef.current = false;
      loadingStartedAtRef.current = null;
      if (hideTimeoutRef.current !== null) {
        window.clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
      if (showAfterTimeoutRef.current !== null) {
        window.clearTimeout(showAfterTimeoutRef.current);
        showAfterTimeoutRef.current = null;
      }
      setState({ pendingCount: 0, isLoading: false, elapsedMs: 0 });
      return;
    }

    const unsubscribe = subscribeGeodesyMapLoading(map, (next) => {
      if (hideTimeoutRef.current !== null) {
        window.clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }

      if (next.isLoading) {
        const isNewSession = !geodesyLoadingActiveRef.current;
        geodesyLoadingActiveRef.current = true;

        if (isNewSession) {
          loadingStartedAtRef.current = Date.now();
          indicatorVisibleRef.current = showAfterMs === 0;

          if (showAfterTimeoutRef.current !== null) {
            window.clearTimeout(showAfterTimeoutRef.current);
            showAfterTimeoutRef.current = null;
          }

          if (showAfterMs > 0) {
            showAfterTimeoutRef.current = window.setTimeout(() => {
              showAfterTimeoutRef.current = null;
              if (!geodesyLoadingActiveRef.current) {
                return;
              }

              indicatorVisibleRef.current = true;
              setState((current) => ({
                ...current,
                isLoading: true,
                elapsedMs: elapsedSince(loadingStartedAtRef.current),
              }));
            }, showAfterMs);
          }
        }

        setState((current) => ({
          ...next,
          isLoading: indicatorVisibleRef.current,
          elapsedMs: indicatorVisibleRef.current
            ? current.isLoading
              ? current.elapsedMs
              : elapsedSince(loadingStartedAtRef.current)
            : 0,
        }));
        return;
      }

      geodesyLoadingActiveRef.current = false;

      if (showAfterTimeoutRef.current !== null) {
        window.clearTimeout(showAfterTimeoutRef.current);
        showAfterTimeoutRef.current = null;
      }

      if (!indicatorVisibleRef.current) {
        loadingStartedAtRef.current = null;
        setState({ ...next, elapsedMs: 0 });
        return;
      }

      const startedAt = loadingStartedAtRef.current;
      const elapsedMs = elapsedSince(startedAt);
      const remainingVisibleMs = Math.max(0, MIN_VISIBLE_MS - elapsedMs);

      if (remainingVisibleMs === 0) {
        loadingStartedAtRef.current = null;
        indicatorVisibleRef.current = false;
        setState({ ...next, elapsedMs: 0 });
        return;
      }

      setState((current) => ({
        ...current,
        pendingCount: 0,
        isLoading: true,
        elapsedMs,
      }));

      hideTimeoutRef.current = window.setTimeout(() => {
        loadingStartedAtRef.current = null;
        indicatorVisibleRef.current = false;
        hideTimeoutRef.current = null;
        setState({ pendingCount: 0, isLoading: false, elapsedMs: 0 });
      }, remainingVisibleMs);
    });

    return () => {
      unsubscribe();
      geodesyLoadingActiveRef.current = false;
      if (hideTimeoutRef.current !== null) {
        window.clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
      if (showAfterTimeoutRef.current !== null) {
        window.clearTimeout(showAfterTimeoutRef.current);
        showAfterTimeoutRef.current = null;
      }
    };
  }, [map, enabled, catalog, showAfterMs]);

  useEffect(() => {
    if (!state.isLoading) {
      return;
    }

    const intervalId = window.setInterval(() => {
      const startedAt = loadingStartedAtRef.current;
      if (startedAt === null) {
        return;
      }

      setState((current) => ({
        ...current,
        elapsedMs: Date.now() - startedAt,
      }));
    }, 200);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [state.isLoading]);

  return state;
}