import type Map from 'ol/Map';
import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  createGeodesyCatalog,
  type GeodesyCatalog,
  type GeodesyCatalogOptions,
  type GeodesyLayerId,
} from '../catalog/geodesyCatalog';
import {
  createDefaultGeodesyWfsAttributeFilterValues,
  type GeodesyWfsAttributeFilterValues,
} from '../constants/wfsAttributeFilters';
import type { GeodesyWmsLayerDefinition } from '../constants/wms';
import type { GeodesyAnnexLayerDefinition } from '../constants/annex';
import type { GeodesyWfsLayerDefinition } from '../constants/wfs';
import type { GeodesyWfsDomainLayerDefinition } from '../constants/wfsDomainLayers';
import {
  clearGeodesyWfsAttributeFilterValues,
  setGeodesyWfsAttributeFilterValues,
} from '../geodesyWfsAttributeFilters';
import {
  defaultGeodesyLayerVisibility,
  setGeodesyLayersVisibility,
  type GeodesyLayerVisibility,
} from '../geodesyLayerVisibility';
import { registerGeodesyOnMap, type RegisterGeodesyOnMapOptions } from '../registerGeodesyOnMap';

export interface UseGeodesyOnMapOptions extends GeodesyCatalogOptions {
  /** Catalogue résolu (prioritaire sur layerIds / uiLayerIds). */
  catalog?: GeodesyCatalog;
  /** Couches actives au montage (par défaut : RBF seul). */
  initialActive?: GeodesyLayerId[];
  /** Valeurs initiales des filtres attributs WFS. */
  initialWfsAttributeFilterValues?: GeodesyWfsAttributeFilterValues;
  /** Popup au clic (désactiver si un autre handler gère le singleclick). */
  popup?: RegisterGeodesyOnMapOptions['popup'];
}

export interface UseGeodesyOnMapResult {
  catalog: GeodesyCatalog;
  /** Couches WMS proposées dans les sélecteurs UI (sans couche attributs). */
  uiLayers: readonly GeodesyWmsLayerDefinition[];
  /** Couches WFS proposées dans les sélecteurs UI (ou filtres domaine). */
  uiWfsLayers: readonly (GeodesyWfsLayerDefinition | GeodesyWfsDomainLayerDefinition)[];
  /** Couches annexes proposées dans les sélecteurs UI. */
  uiAnnexLayers: readonly GeodesyAnnexLayerDefinition[];
  visibility: GeodesyLayerVisibility;
  wfsAttributeFilterValues: GeodesyWfsAttributeFilterValues;
  setWfsAttributeFilterValues: (values: GeodesyWfsAttributeFilterValues) => void;
  clearWfsAttributeFilterValues: () => void;
  toggleLayer: (layerId: GeodesyLayerId) => void;
  setVisibility: (visibility: GeodesyLayerVisibility) => void;
  /** Libellés courts des couches visibles (ex. pour une légende). */
  activeLabels: string[];
}

/** Enregistre les couches géodésie sur la carte et gère leur visibilité. */
export function useGeodesyOnMap(
  map: Map | null,
  options: UseGeodesyOnMapOptions = {},
): UseGeodesyOnMapResult {
  const {
    catalog: catalogOption,
    initialActive = ['RBF'],
    initialWfsAttributeFilterValues,
    popup,
    layers,
    layerIds,
    uiLayerIds,
    dataLayerId,
    networkLayerIds,
    wmsUrl,
    wmsGpOlExt,
    attributes,
    attributeKeys,
    excludedKeys,
    titleKeys,
    labels,
    wfsLayers,
    wfsLayerIds,
    wfsUiLayerIds,
    wfsUrl,
    wfsApiKey,
    wfsDataProjection,
    wfsBboxPaddingRatio,
    wfsUseCacheBuster,
    wfsCluster,
    wfsDomainLayers,
    wfsDomainSourceLayerId,
    wfsAttributeFilters,
    annexLayers,
    annexLayerIds,
    annexUiLayerIds,
  } = options;

  const catalog = useMemo(
    () =>
      catalogOption ??
      createGeodesyCatalog({
        layers,
        layerIds,
        uiLayerIds,
        dataLayerId,
        networkLayerIds,
        wmsUrl,
        wmsGpOlExt,
        attributes,
        attributeKeys,
        excludedKeys,
        titleKeys,
        labels,
        wfsLayers,
        wfsLayerIds,
        wfsUiLayerIds,
        wfsUrl,
        wfsApiKey,
        wfsDataProjection,
        wfsBboxPaddingRatio,
        wfsUseCacheBuster,
        wfsCluster,
        wfsDomainLayers,
        wfsDomainSourceLayerId,
        wfsAttributeFilters,
        annexLayers,
        annexLayerIds,
        annexUiLayerIds,
      }),
    [
      catalogOption,
      layers,
      layerIds,
      uiLayerIds,
      dataLayerId,
      networkLayerIds,
      wmsUrl,
      wmsGpOlExt,
      attributes,
      attributeKeys,
      excludedKeys,
      titleKeys,
      labels,
      wfsLayers,
      wfsLayerIds,
      wfsUiLayerIds,
      wfsUrl,
      wfsApiKey,
      wfsDataProjection,
      wfsBboxPaddingRatio,
      wfsUseCacheBuster,
      wfsCluster,
      wfsDomainLayers,
      wfsDomainSourceLayerId,
      wfsAttributeFilters,
      annexLayers,
      annexLayerIds,
      annexUiLayerIds,
    ],
  );

  const uiWfsLayers = useMemo<
    readonly (GeodesyWfsLayerDefinition | GeodesyWfsDomainLayerDefinition)[]
  >(
    () =>
      catalog.wfsDomainLayers.length > 0 ? catalog.wfsDomainLayers : catalog.wfsUiLayers,
    [catalog.wfsDomainLayers, catalog.wfsUiLayers],
  );

  const [visibility, setVisibility] = useState<GeodesyLayerVisibility>(() =>
    defaultGeodesyLayerVisibility(initialActive, catalog),
  );

  const [wfsAttributeFilterValues, setWfsAttributeFilterValuesState] =
    useState<GeodesyWfsAttributeFilterValues>(() =>
      initialWfsAttributeFilterValues ??
      createDefaultGeodesyWfsAttributeFilterValues(catalog.wfsAttributeFilters),
    );

  useEffect(() => {
    if (!map) {
      return;
    }

    return registerGeodesyOnMap(map, {
      catalog,
      visibility,
      attributeFilterValues: wfsAttributeFilterValues,
      popup,
    });
  }, [map, popup, catalog]);

  useEffect(() => {
    if (!map) {
      return;
    }

    setGeodesyLayersVisibility(map, visibility);
  }, [map, visibility]);

  useEffect(() => {
    if (!map) {
      return;
    }

    setGeodesyWfsAttributeFilterValues(map, wfsAttributeFilterValues);
  }, [map, wfsAttributeFilterValues]);

  const toggleLayer = useCallback(
    (layerId: GeodesyLayerId) => {
      const isUiLayer =
        catalog.uiLayers.some((layer) => layer.id === layerId) ||
        catalog.wfsUiLayers.some((layer) => layer.id === layerId) ||
        catalog.wfsDomainLayers.some((layer) => layer.id === layerId) ||
        catalog.annexUiLayers.some((layer) => layer.id === layerId);

      setVisibility((current) => ({
        ...current,
        [layerId]: isUiLayer ? !current[layerId] : current[layerId],
      }));
    },
    [catalog.uiLayers, catalog.wfsUiLayers, catalog.wfsDomainLayers, catalog.annexUiLayers],
  );

  const setVisibilityState = useCallback((next: GeodesyLayerVisibility) => {
    setVisibility(next);
  }, []);

  const setWfsAttributeFilterValues = useCallback((next: GeodesyWfsAttributeFilterValues) => {
    setWfsAttributeFilterValuesState(next);
  }, []);

  const clearWfsAttributeFilterValues = useCallback(() => {
    setWfsAttributeFilterValuesState(
      createDefaultGeodesyWfsAttributeFilterValues(catalog.wfsAttributeFilters),
    );
    if (map) {
      clearGeodesyWfsAttributeFilterValues(map);
    }
  }, [catalog.wfsAttributeFilters, map]);

  const activeLabels = useMemo(
    () => [
      ...catalog.uiLayers
        .filter((layer) => visibility[layer.id])
        .map((layer) => layer.shortLabel),
      ...uiWfsLayers
        .filter((layer) => visibility[layer.id])
        .map((layer) => layer.shortLabel),
      ...catalog.annexUiLayers
        .filter((layer) => visibility[layer.id])
        .map((layer) => layer.shortLabel),
    ],
    [catalog.uiLayers, catalog.annexUiLayers, uiWfsLayers, visibility],
  );

  return {
    catalog,
    uiLayers: catalog.uiLayers,
    uiWfsLayers,
    uiAnnexLayers: catalog.annexUiLayers,
    visibility,
    wfsAttributeFilterValues,
    setWfsAttributeFilterValues,
    clearWfsAttributeFilterValues,
    toggleLayer,
    setVisibility: setVisibilityState,
    activeLabels,
  };
}
