import type VectorSource from 'ol/source/Vector';
import type Feature from 'ol/Feature';
import type Geometry from 'ol/geom/Geometry';
import VectorLayer from 'ol/layer/Vector';
import type { StyleLike } from 'ol/style/Style';

import type { GeodesyCatalog } from '../catalog/geodesyCatalog';
import { GEODESY_LAYER_ID_PROPERTY } from '../constants/wms';
import type { GeodesyWfsAttributeFilterValuesHolder } from '../constants/wfsAttributeFilters';
import {
  GEODESY_LAYER_KIND_PROPERTY,
  type GeodesyWfsLayerId,
} from '../constants/wfs';
import {
  GEODESY_WFS_DOMAIN_SOURCE_LAYER_PROPERTY,
  type GeodesyWfsDomainLayerDefinition,
} from '../constants/wfsDomainLayers';
import { createGeodesyWfsDisplayFilterStyleFunction } from '../style/geodesyWfsDisplayFilterStyle';
import { createGeodesyWfsAnimatedVectorLayer } from './geodesyWfsLayer';

const DOMAIN_LAYER_Z_INDEX_OFFSET = 1;

export function createGeodesyWfsDomainDisplayLayer(
  definition: GeodesyWfsDomainLayerDefinition,
  options: {
    catalog: GeodesyCatalog;
    sourceLayerId: GeodesyWfsLayerId;
    source: VectorSource<Feature<Geometry>>;
    pointStyle: StyleLike;
    baseZIndex: number;
    attributeFilterValues?: GeodesyWfsAttributeFilterValuesHolder;
    visible?: boolean;
  },
): VectorLayer<VectorSource<Feature<Geometry>>> {
  const {
    catalog,
    sourceLayerId,
    source,
    pointStyle,
    baseZIndex,
    attributeFilterValues,
    visible = false,
  } = options;

  return createGeodesyWfsAnimatedVectorLayer({
    catalog,
    visible,
    source,
    zIndex: baseZIndex + DOMAIN_LAYER_Z_INDEX_OFFSET,
    properties: {
      title: definition.title,
      name: `geodesyWfsDomain-${definition.id}`,
      [GEODESY_LAYER_ID_PROPERTY]: definition.id,
      [GEODESY_LAYER_KIND_PROPERTY]: 'wfs',
      [GEODESY_WFS_DOMAIN_SOURCE_LAYER_PROPERTY]: sourceLayerId,
    },
    style: createGeodesyWfsDisplayFilterStyleFunction(pointStyle, {
      domaines: definition.domaines,
      attributeFilters: catalog.wfsAttributeFilters,
      attributeFilterValues,
      domainSourceLayerId: sourceLayerId,
      cluster: catalog.wfsCluster.enabled,
    }),
  });
}
