import type Feature from 'ol/Feature';
import type Geometry from 'ol/geom/Geometry';
import type BaseLayer from 'ol/layer/Base';
import VectorLayer from 'ol/layer/Vector';

import type { GeodesyLayerId } from '../catalog/geodesyCatalog';
import { GEODESY_LAYER_ID_PROPERTY } from '../constants/wms';
import { GEODESY_LAYER_KIND_PROPERTY } from '../constants/wfs';

export function isGeodesyAnnexVectorLayer(
  layer: BaseLayer,
  allowedLayerIds: ReadonlySet<GeodesyLayerId>,
): layer is VectorLayer {
  if (!(layer instanceof VectorLayer)) {
    return false;
  }

  if (!layer.getVisible()) {
    return false;
  }

  if (layer.get(GEODESY_LAYER_KIND_PROPERTY) !== 'annex') {
    return false;
  }

  const layerId = layer.get(GEODESY_LAYER_ID_PROPERTY) as GeodesyLayerId | undefined;
  return layerId !== undefined && allowedLayerIds.has(layerId);
}

export function resolveGeodesyAnnexHitFeature(
  feature: Feature<Geometry>,
): Feature<Geometry> {
  return feature;
}
