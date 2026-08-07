import type { GeodesyAnnexLayerId } from '../constants/annex';
import type { GeodesyFeatureInfoHit } from '../wms/queryGeodesyAtCoordinate';
import {
  createGeodesyAttributeCatalog,
  DEFAULT_GEODESY_ATTRIBUTE_CATALOG,
  type GeodesyAttributeCatalog,
} from './geodesyAttributeCatalog';
import type { GeodesyCatalog } from './geodesyCatalog';

/** Catalogue d’attributs adapté au type de couche cliquée (annexe ou défaut). */
export function resolveGeodesyHitAttributeCatalog(
  catalog: GeodesyCatalog,
  hit: GeodesyFeatureInfoHit,
  fallback: GeodesyAttributeCatalog = DEFAULT_GEODESY_ATTRIBUTE_CATALOG,
): GeodesyAttributeCatalog {
  const annexLayer = catalog.annexLayers.find((layer) => layer.id === hit.layerId);
  if (!annexLayer) {
    return fallback;
  }

  return createGeodesyAttributeCatalog({
    attributeKeys: annexLayer.attributeKeys,
    titleKeys: annexLayer.titleKeys,
    labels: fallback.labels,
  });
}

export function isGeodesyAnnexLayerId(
  catalog: GeodesyCatalog,
  layerId: string,
): layerId is GeodesyAnnexLayerId {
  return catalog.annexLayerIds.includes(layerId as GeodesyAnnexLayerId);
}
