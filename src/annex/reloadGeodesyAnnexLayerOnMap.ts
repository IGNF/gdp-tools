import type Map from 'ol/Map';
import VectorLayer from 'ol/layer/Vector';
import type VectorSource from 'ol/source/Vector';
import type Feature from 'ol/Feature';
import type Geometry from 'ol/geom/Geometry';

import { getGeodesyCatalogFromMap } from '../catalog/getGeodesyCatalogFromMap';
import type { GeodesyAnnexLayerId } from '../constants/annex';
import { GEODESY_LAYER_ID_PROPERTY } from '../constants/wms';
import { GEODESY_LAYER_KIND_PROPERTY } from '../constants/wfs';
import { getGeodesyLayerGroup } from '../registerGeodesyOnMap';
import {
  clearGeodesyAnnexFeaturesCache,
  loadGeodesyAnnexFeatures,
} from './loadGeodesyAnnexFeatures';

function findGeodesyAnnexLayerOnMap(
  map: Map,
  layerId: GeodesyAnnexLayerId,
): VectorLayer<VectorSource<Feature<Geometry>>> | null {
  const group = getGeodesyLayerGroup(map);
  if (!group) {
    return null;
  }

  for (const layer of group.getLayers().getArray()) {
    if (!(layer instanceof VectorLayer)) {
      continue;
    }

    if (layer.get(GEODESY_LAYER_KIND_PROPERTY) !== 'annex') {
      continue;
    }

    if (layer.get(GEODESY_LAYER_ID_PROPERTY) === layerId) {
      return layer as VectorLayer<VectorSource<Feature<Geometry>>>;
    }
  }

  return null;
}

/** Recharge un flux annexe sur la carte (ex. stations RGP) en invalidant le cache. */
export async function reloadGeodesyAnnexLayerOnMap(
  map: Map,
  layerId: GeodesyAnnexLayerId,
): Promise<void> {
  const catalog = getGeodesyCatalogFromMap(map);
  const definition = catalog.annexLayers.find((layer) => layer.id === layerId);

  if (!definition) {
    throw new Error(`[gdp-tools] Annex layer "${layerId}" is not registered on the map.`);
  }

  const layer = findGeodesyAnnexLayerOnMap(map, layerId);
  if (!layer) {
    throw new Error(`[gdp-tools] Annex vector layer "${layerId}" was not found on the map.`);
  }

  const source = layer.getSource();
  if (!source) {
    throw new Error(`[gdp-tools] Annex vector layer "${layerId}" has no source.`);
  }

  clearGeodesyAnnexFeaturesCache(definition, catalog);
  source.clear();

  const features = await loadGeodesyAnnexFeatures({ definition, catalog });
  source.addFeatures(features);
}
