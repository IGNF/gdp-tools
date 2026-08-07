import type Map from 'ol/Map';
import type BaseLayer from 'ol/layer/Base';
import LayerGroup from 'ol/layer/Group';
import VectorLayer from 'ol/layer/Vector';
import Cluster from 'ol/source/Cluster';

import type { GeodesyCatalog } from './catalog/geodesyCatalog';
import { getGeodesyCatalogFromMap } from './catalog/getGeodesyCatalogFromMap';
import {
  createDefaultGeodesyWfsAttributeFilterValues,
  GEODESY_WFS_ATTRIBUTE_FILTER_VALUES_PROPERTY,
  type GeodesyWfsAttributeFilterValues,
  type GeodesyWfsAttributeFilterValuesHolder,
} from './constants/wfsAttributeFilters';
import { GEODESY_LAYER_KIND_PROPERTY } from './constants/wfs';
import { GEODESY_WFS_DATA_LAYER_PROPERTY } from './constants/wfsDomainLayers';
import {
  clearGeodesyWfsClusterExplosion,
} from './interaction/geodesyWfsClusterSelect';
import { getGeodesyLayerGroup } from './registerGeodesyOnMap';

function isWfsDisplayLayer(layer: BaseLayer): layer is VectorLayer {
  return (
    layer instanceof VectorLayer &&
    layer.get(GEODESY_LAYER_KIND_PROPERTY) === 'wfs' &&
    layer.get(GEODESY_WFS_DATA_LAYER_PROPERTY) !== true
  );
}

function refreshWfsDisplayLayers(group: LayerGroup): void {
  group.getLayers().forEach((layer) => {
    if (isWfsDisplayLayer(layer)) {
      layer.changed();
    }
  });
}

function refreshWfsClusterSources(group: LayerGroup): void {
  group.getLayers().forEach((layer) => {
    if (!isWfsDisplayLayer(layer)) {
      return;
    }

    const source = layer.getSource();
    if (source instanceof Cluster) {
      source.refresh();
    }
  });
}

export function getGeodesyWfsAttributeFilterValuesHolder(
  map: Map,
): GeodesyWfsAttributeFilterValuesHolder | null {
  const group = getGeodesyLayerGroup(map);
  if (!group) {
    return null;
  }

  return (
    (group.get(GEODESY_WFS_ATTRIBUTE_FILTER_VALUES_PROPERTY) as
      | GeodesyWfsAttributeFilterValuesHolder
      | undefined) ?? null
  );
}

/** Lit les valeurs de filtres attributs WFS actives sur la carte. */
export function getGeodesyWfsAttributeFilterValues(map: Map): GeodesyWfsAttributeFilterValues {
  return getGeodesyWfsAttributeFilterValuesHolder(map)?.values ?? {};
}

function defaultValuesForCatalog(catalog: GeodesyCatalog): GeodesyWfsAttributeFilterValues {
  return createDefaultGeodesyWfsAttributeFilterValues(catalog.wfsAttributeFilters);
}

/** Active ou met à jour les filtres attributs WFS (profil expert). */
export function setGeodesyWfsAttributeFilterValues(
  map: Map,
  values: GeodesyWfsAttributeFilterValues,
): void {
  const group = getGeodesyLayerGroup(map);
  if (!group) {
    return;
  }

  let holder = group.get(GEODESY_WFS_ATTRIBUTE_FILTER_VALUES_PROPERTY) as
    | GeodesyWfsAttributeFilterValuesHolder
    | undefined;

  if (!holder) {
    const catalog = getGeodesyCatalogFromMap(map);
    holder = { values: defaultValuesForCatalog(catalog) };
    group.set(GEODESY_WFS_ATTRIBUTE_FILTER_VALUES_PROPERTY, holder);
  }

  holder.values = { ...values };
  clearGeodesyWfsClusterExplosion(map);
  refreshWfsClusterSources(group);
  refreshWfsDisplayLayers(group);
}

/** Réinitialise tous les filtres attributs WFS. */
export function clearGeodesyWfsAttributeFilterValues(map: Map): void {
  const catalog = getGeodesyCatalogFromMap(map);
  setGeodesyWfsAttributeFilterValues(map, defaultValuesForCatalog(catalog));
}
