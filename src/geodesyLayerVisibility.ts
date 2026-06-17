import type Map from 'ol/Map';
import type BaseLayer from 'ol/layer/Base';
import LayerGroup from 'ol/layer/Group';

import {
  DEFAULT_GEODESY_CATALOG,
  getGeodesyCatalogLayerIds,
  type GeodesyCatalog,
  type GeodesyLayerId,
} from './catalog/geodesyCatalog';
import { getGeodesyCatalogFromMap } from './catalog/getGeodesyCatalogFromMap';
import { GEODESY_LAYER_ID_PROPERTY } from './constants/wms';
import { getGeodesyLayerGroup } from './registerGeodesyOnMap';

export type GeodesyLayerVisibility = Partial<Record<GeodesyLayerId, boolean>>;

export function defaultGeodesyLayerVisibility(
  activeIds: GeodesyLayerId[] = ['RBF'],
  catalog: GeodesyCatalog = DEFAULT_GEODESY_CATALOG,
): GeodesyLayerVisibility {
  const active = new Set(activeIds);
  const wmsVisibility = Object.fromEntries(
    catalog.layers.map((layer) => [
      layer.id,
      layer.id === catalog.dataLayerId ? false : active.has(layer.id),
    ]),
  );
  const wfsVisibility =
    catalog.wfsDomainLayerIds.length > 0
      ? Object.fromEntries(
          catalog.wfsDomainLayers.map((layer) => [layer.id, active.has(layer.id)]),
        )
      : Object.fromEntries(
          catalog.wfsLayers.map((layer) => [layer.id, active.has(layer.id)]),
        );

  if (catalog.wfsDomainSourceLayerId) {
    wfsVisibility[catalog.wfsDomainSourceLayerId] = catalog.wfsDomainLayerIds.some((id) =>
      active.has(id),
    );
  }

  const annexVisibility = Object.fromEntries(
    catalog.annexLayers.map((layer) => [layer.id, active.has(layer.id)]),
  );

  return { ...wmsVisibility, ...wfsVisibility, ...annexVisibility };
}

function isGeodesyCatalogLayer(layer: BaseLayer, catalog: GeodesyCatalog): boolean {
  const id = layer.get(GEODESY_LAYER_ID_PROPERTY) as GeodesyLayerId | undefined;
  if (!id) {
    return false;
  }

  const knownIds = getGeodesyCatalogLayerIds(catalog);
  return knownIds.includes(id);
}

function syncDomainSourceLayerVisibility(
  catalog: GeodesyCatalog,
  visibility: GeodesyLayerVisibility,
): GeodesyLayerVisibility {
  if (!catalog.wfsDomainSourceLayerId) {
    return visibility;
  }

  const anyDomainVisible = catalog.wfsDomainLayerIds.some((id) => visibility[id]);
  return {
    ...visibility,
    [catalog.wfsDomainSourceLayerId]: anyDomainVisible,
  };
}

function applyVisibilityToGroup(
  group: LayerGroup,
  visibility: GeodesyLayerVisibility,
  catalog: GeodesyCatalog,
): void {
  const resolvedVisibility = syncDomainSourceLayerVisibility(catalog, visibility);

  group.getLayers().forEach((layer) => {
    if (!isGeodesyCatalogLayer(layer, catalog)) {
      return;
    }

    const id = layer.get(GEODESY_LAYER_ID_PROPERTY) as GeodesyLayerId;
    const isDataLayer = id === catalog.dataLayerId;
    layer.setVisible(isDataLayer ? false : (resolvedVisibility[id] ?? false));
  });
}

/** Lit la visibilité actuelle des sous-couches géodésie sur la carte. */
export function getGeodesyLayersVisibility(map: Map): GeodesyLayerVisibility {
  const catalog = getGeodesyCatalogFromMap(map);
  const fallback = defaultGeodesyLayerVisibility([], catalog);
  const group = getGeodesyLayerGroup(map);
  if (!group) {
    return fallback;
  }

  const visibility = { ...fallback };
  group.getLayers().forEach((layer) => {
    if (!isGeodesyCatalogLayer(layer, catalog)) {
      return;
    }
    const id = layer.get(GEODESY_LAYER_ID_PROPERTY) as GeodesyLayerId;
    visibility[id] = layer.getVisible();
  });
  return visibility;
}

/** Active ou masque une ou plusieurs couches géodésie. */
export function setGeodesyLayersVisibility(
  map: Map,
  visibility: Partial<GeodesyLayerVisibility>,
): void {
  const group = getGeodesyLayerGroup(map);
  if (!group) {
    return;
  }

  const catalog = getGeodesyCatalogFromMap(map);
  const merged: GeodesyLayerVisibility = {
    ...getGeodesyLayersVisibility(map),
    ...visibility,
  };
  applyVisibilityToGroup(group, merged, catalog);
}

/** Affiche ou masque une seule couche géodésie. */
export function setGeodesyLayerVisible(
  map: Map,
  layerId: GeodesyLayerId,
  visible: boolean,
): void {
  setGeodesyLayersVisibility(map, { [layerId]: visible });
}

/** True si au moins une sous-couche géodésie UI est visible. */
export function isAnyGeodesyLayerVisible(map: Map): boolean {
  const catalog = getGeodesyCatalogFromMap(map);
  const visibility = getGeodesyLayersVisibility(map);
  return (
    catalog.uiLayers.some((layer) => visibility[layer.id]) ||
    catalog.wfsDomainLayers.some((layer) => visibility[layer.id]) ||
    catalog.wfsUiLayers.some((layer) => visibility[layer.id]) ||
    catalog.annexUiLayers.some((layer) => visibility[layer.id])
  );
}
