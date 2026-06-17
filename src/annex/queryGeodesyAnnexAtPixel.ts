import Feature from 'ol/Feature';
import type Geometry from 'ol/geom/Geometry';
import type Map from 'ol/Map';
import type { Pixel } from 'ol/pixel';

import type { GeodesyLayerId } from '../catalog/geodesyCatalog';
import { getGeodesyCatalogFromMap } from '../catalog/getGeodesyCatalogFromMap';
import { GEODESY_LAYER_ID_PROPERTY } from '../constants/wms';
import type { GeodesyFeatureInfoHit } from '../wms/queryGeodesyAtCoordinate';
import { isGeodesyAnnexVectorLayer, resolveGeodesyAnnexHitFeature } from './geodesyAnnexLayerUtils';

export interface QueryGeodesyAnnexAtPixelOptions {
  /** Tolérance en pixels autour du clic (défaut : 5). */
  hitTolerance?: number;
  /** Limite aux couches annexes visibles (défaut : `catalog.annexUiLayerIds`). */
  layerIds?: readonly GeodesyLayerId[];
}

function buildAnnexHit(
  catalog: ReturnType<typeof getGeodesyCatalogFromMap>,
  layerId: GeodesyLayerId,
  feature: Feature<Geometry>,
  layerTitle?: string,
): GeodesyFeatureInfoHit {
  const definition = catalog.annexLayers.find((entry) => entry.id === layerId);

  return {
    layerTitle: layerTitle ?? definition?.title ?? 'Géodésie annexe',
    layerId,
    feature,
  };
}

/** Retourne l’entité annexe la plus proche du clic (couches visibles uniquement). */
export function queryGeodesyAnnexAtPixel(
  map: Map,
  pixel: Pixel,
  options: QueryGeodesyAnnexAtPixelOptions = {},
): GeodesyFeatureInfoHit[] {
  const catalog = getGeodesyCatalogFromMap(map);
  const hitTolerance = options.hitTolerance ?? 5;
  const allowedLayerIds = new Set(options.layerIds ?? catalog.annexUiLayerIds);

  if (allowedLayerIds.size === 0) {
    return [];
  }

  let hit: GeodesyFeatureInfoHit | null = null;

  map.forEachFeatureAtPixel(
    pixel,
    (feature, layer) => {
      if (!isGeodesyAnnexVectorLayer(layer, allowedLayerIds)) {
        return;
      }

      const layerId = layer.get(GEODESY_LAYER_ID_PROPERTY) as GeodesyLayerId;
      const resolvedFeature = resolveGeodesyAnnexHitFeature(feature as Feature<Geometry>);

      hit = buildAnnexHit(
        catalog,
        layerId,
        resolvedFeature,
        layer.get('title') as string | undefined,
      );

      return true;
    },
    {
      hitTolerance,
      layerFilter: (layer) => isGeodesyAnnexVectorLayer(layer, allowedLayerIds),
    },
  );

  return hit ? [hit] : [];
}
