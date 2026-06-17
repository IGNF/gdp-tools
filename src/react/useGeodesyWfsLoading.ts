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

/** Suit les requêtes WFS bbox en cours pour les couches géodésie visibles. */
export function useGeodesyWfsLoading(
  map: Map | null,
  options: UseGeodesyWfsLoadingOptions,
): UseGeodesyWfsLoadingResult {
  const { catalog, visibility, showIndicator = true } = options;
  const enabled = showIndicator && isGeodesyWfsLoadingEnabled(catalog, visibility);
  const loadingStartedAtRef = useRef<number | null>(null);
  const hideTimeoutRef = useRef<number | null>(null);

  const [state, setState] = useState<UseGeodesyWfsLoadingResult>({
    pendingCount: 0,
    isLoading: false,
    elapsedMs: 0,
  });

  useEffect(() => {
    if (!map || !enabled) {
      loadingStartedAtRef.current = null;
      if (hideTimeoutRef.current !== null) {
        window.clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
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
        loadingStartedAtRef.current = Date.now();
        setState((current) => ({
          ...next,
          elapsedMs: current.isLoading ? current.elapsedMs : 0,
        }));
        return;
      }

      const startedAt = loadingStartedAtRef.current;
      const elapsedMs = startedAt === null ? 0 : Date.now() - startedAt;
      const remainingVisibleMs = Math.max(0, MIN_VISIBLE_MS - elapsedMs);

      if (remainingVisibleMs === 0) {
        loadingStartedAtRef.current = null;
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
        hideTimeoutRef.current = null;
        setState({ pendingCount: 0, isLoading: false, elapsedMs: 0 });
      }, remainingVisibleMs);
    });

    return () => {
      unsubscribe();
      if (hideTimeoutRef.current !== null) {
        window.clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
    };
  }, [map, enabled, catalog]);

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
