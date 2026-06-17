import type Map from 'ol/Map';
import LayerGroup from 'ol/layer/Group';

import { GEODESY_LAYER_GROUP_NAME } from '../constants/wms';
import {
  DEFAULT_GEODESY_CATALOG,
  GEODESY_CATALOG_PROPERTY,
  type GeodesyCatalog,
} from './geodesyCatalog';

export function getGeodesyCatalogFromMap(map: Map): GeodesyCatalog {
  const group = map
    .getLayers()
    .getArray()
    .find(
      (candidate) =>
        candidate instanceof LayerGroup && candidate.get('name') === GEODESY_LAYER_GROUP_NAME,
    );

  if (!(group instanceof LayerGroup)) {
    return DEFAULT_GEODESY_CATALOG;
  }

  const catalog = group.get(GEODESY_CATALOG_PROPERTY) as GeodesyCatalog | undefined;
  return catalog ?? DEFAULT_GEODESY_CATALOG;
}
