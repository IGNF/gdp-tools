import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';

import {
  DEFAULT_GEODESY_CATALOG,
  getLayerStackIndex,
  type GeodesyCatalog,
} from '../catalog/geodesyCatalog';
import { GEODESY_LAYER_ID_PROPERTY, type GeodesyWmsLayerDefinition } from '../constants/wms';
import { geodesyWmsTileLoadFunction } from '../wms/geodesyWmsTileLoad';

const BASE_Z_INDEX = 20;

export interface CreateGeodesyWmsLayerOptions {
  visible?: boolean;
  zIndexOffset?: number;
  catalog?: GeodesyCatalog;
}

/** Couche WMS pour un flux géodésie Géoplateforme. */
export function createGeodesyWmsLayer(
  definition: GeodesyWmsLayerDefinition,
  options: CreateGeodesyWmsLayerOptions = {},
): TileLayer<TileWMS> {
  const { visible = false, zIndexOffset = 0, catalog = DEFAULT_GEODESY_CATALOG } = options;
  const layerIndex = getLayerStackIndex(catalog, definition.id);

  return new TileLayer({
    properties: {
      title: definition.title,
      name: `geodesyWms-${definition.id}`,
      [GEODESY_LAYER_ID_PROPERTY]: definition.id,
    },
    visible,
    preload: 0,
    useInterimTilesOnError: false,
    source: new TileWMS({
      url: catalog.wmsUrl,
      params: {
        LAYERS: definition.wmsLayer,
        STYLES: definition.style,
        FORMAT: 'image/png',
        TRANSPARENT: true,
        VERSION: '1.3.0',
        'gp-ol-ext': catalog.wmsGpOlExt,
      },
      crossOrigin: 'anonymous',
      tileLoadFunction: geodesyWmsTileLoadFunction,
    }),
    zIndex: BASE_Z_INDEX + layerIndex + zIndexOffset,
  });
}
