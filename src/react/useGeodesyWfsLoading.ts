import type Map from 'ol/Map';
import { useEffect, useRef, useState } from 'react';

import type { GeodesyCatalog } from '../catalog/geodesyCatalog';
import type { GeodesyLayerVisibility } from '../geodesyLayerVisibility';
import {
  subscribeGeodesyWfsLoading,
  type GeodesyWfsLoadingState,
} from '../wfs/geodesyWfsLoadingState';

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

export interface UseGeodesyWfsLoadingResult extends GeodesyWfsLoadingState {
  /** Durée écoulée depuis le début du chargement en cours (ms). */
  elapsedMs: number;
}

const MIN_VISIBLE_MS = 400;

function isGeodesyWfsLoadingEnabled(
  catalog: GeodesyCatalog,
  visibility: GeodesyLayerVisibility,
): boolean {
  const displayLayers =
    catalog.wfsDomainLayers.length > 0 ? catalog.wfsDomainLayers : catalog.wfsLayers;

  if (displayLayers.length === 0) {
    return false;
  }

  return displayLayers.some((layer) => visibility[layer.id]);
}

function elapsedSince(startedAt: number | null): number {
  return startedAt === null ? 0 : Date.now() - startedAt;
}

/** Suit les requêtes WFS bbox en cours pour les couches géodésie visibles. */
export function useGeodesyWfsLoading(
  map: Map | null,
  options: UseGeodesyWfsLoadingOptions,
): UseGeodesyWfsLoadingResult {
  const { catalog, visibility, showIndicator = true, showAfterMs = 0 } = options;
  const enabled = showIndicator && isGeodesyWfsLoadingEnabled(catalog, visibility);
  const loadingStartedAtRef = useRef<number | null>(null);
  const hideTimeoutRef = useRef<number | null>(null);
  const showAfterTimeoutRef = useRef<number | null>(null);
  const wfsLoadingActiveRef = useRef(false);
  const indicatorVisibleRef = useRef(false);

  const [state, setState] = useState<UseGeodesyWfsLoadingResult>({
    pendingCount: 0,
    isLoading: false,
    elapsedMs: 0,
  });

  useEffect(() => {
    if (!map || !enabled) {
      wfsLoadingActiveRef.current = false;
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

    const unsubscribe = subscribeGeodesyWfsLoading(map, (next) => {
      if (hideTimeoutRef.current !== null) {
        window.clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }

      if (next.isLoading) {
        const isNewSession = !wfsLoadingActiveRef.current;
        wfsLoadingActiveRef.current = true;

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
              if (!wfsLoadingActiveRef.current) {
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

      wfsLoadingActiveRef.current = false;

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
      wfsLoadingActiveRef.current = false;
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