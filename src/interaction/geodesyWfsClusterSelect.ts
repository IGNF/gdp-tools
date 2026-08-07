import type Map from 'ol/Map';

import type { GeodesyCatalog } from '../catalog/geodesyCatalog';
import { GeodesySelectCluster } from './geodesySelectCluster';
import { createGeodesyWfsExplodedClusterFeatureStyle } from '../style/geodesyWfsPictoStyle';
import { isGeodesyWfsVectorLayer } from '../wfs/geodesyWfsLayerUtils';

const clusterSelectByMap = new WeakMap<Map, GeodesySelectCluster>();

export function getGeodesyWfsClusterSelectInteraction(map: Map): GeodesySelectCluster | null {
  return clusterSelectByMap.get(map) ?? null;
}

export function clearGeodesyWfsClusterExplosion(map: Map): void {
  getGeodesyWfsClusterSelectInteraction(map)?.clear();
}

/** Interaction ol-ext : éclate un cluster WFS au clic pour choisir un repère. */
export function registerGeodesyWfsClusterSelect(
  map: Map,
  catalog: GeodesyCatalog,
): () => void {
  if (!catalog.wfsCluster.enabled) {
    return () => {};
  }

  const allowedLayerIds = new Set(catalog.wfsUiLayerIds);
  const interaction = new GeodesySelectCluster({
    layers: (layer) => isGeodesyWfsVectorLayer(layer, allowedLayerIds),
    featureStyle: createGeodesyWfsExplodedClusterFeatureStyle(catalog),
    animate: catalog.wfsCluster.animateExplosion,
    explosionAnimationDuration: catalog.wfsCluster.explosionAnimationDuration,
    pointRadius: catalog.wfsCluster.pointRadius,
    autoClose: true,
    selectCluster: false,
  });

  map.addInteraction(interaction);
  clusterSelectByMap.set(map, interaction);

  return () => {
    interaction.clear();
    map.removeInteraction(interaction);
    clusterSelectByMap.delete(map);
  };
}
