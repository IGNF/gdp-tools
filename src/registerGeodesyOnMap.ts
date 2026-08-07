import type Map from 'ol/Map';
import LayerGroup from 'ol/layer/Group';

import type { GeodesyCatalog } from './catalog/geodesyCatalog';
import { getGeodesyCatalogFromMap } from './catalog/getGeodesyCatalogFromMap';
import { GEODESY_LAYER_GROUP_NAME } from './constants/wms';
import type { GeodesyLayerVisibility } from './geodesyLayerVisibility';
import type { GeodesyWfsAttributeFilterValues } from './constants/wfsAttributeFilters';
import {
  registerGeodesyWfsClusterSelect,
} from './interaction/geodesyWfsClusterSelect';
import { registerGeodesyPopup, type RegisterGeodesyPopupOptions } from './interaction/geodesyPopup';
import { createGeodesyLayerGroup } from './layers/geodesyLayerGroup';

export function getGeodesyLayerGroup(map: Map): LayerGroup | null {
  const layer = map
    .getLayers()
    .getArray()
    .find((candidate) => candidate.get('name') === GEODESY_LAYER_GROUP_NAME);

  return layer instanceof LayerGroup ? layer : null;
}

export interface RegisterGeodesyOnMapOptions {
  catalog?: GeodesyCatalog;
  visibility?: Partial<GeodesyLayerVisibility>;
  attributeFilterValues?: GeodesyWfsAttributeFilterValues;
  popup?: RegisterGeodesyPopupOptions | boolean;
}

/** Ajoute le groupe de couches géodésie à la carte. Retourne une fonction de nettoyage. */
export function registerGeodesyOnMap(
  map: Map,
  options: RegisterGeodesyOnMapOptions = {},
): () => void {
  const existing = getGeodesyLayerGroup(map);
  if (existing) {
    map.removeLayer(existing);
  }

  const group = createGeodesyLayerGroup({
    catalog: options.catalog,
    visibility: options.visibility,
    attributeFilterValues: options.attributeFilterValues,
  });
  map.addLayer(group);

  const popupDisabled = options.popup === false;
  const unregisterPopup = registerGeodesyPopup(map, {
    ...(typeof options.popup === 'object' ? options.popup : {}),
    disabled: popupDisabled,
  });

  const catalog = options.catalog ?? getGeodesyCatalogFromMap(map);
  const unregisterClusterSelect = registerGeodesyWfsClusterSelect(map, catalog);

  return () => {
    unregisterClusterSelect();
    unregisterPopup();
    map.removeLayer(group);
  };
}
