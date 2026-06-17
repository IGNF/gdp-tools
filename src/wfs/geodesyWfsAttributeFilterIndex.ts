import type Feature from 'ol/Feature';
import type Geometry from 'ol/geom/Geometry';
import type VectorSource from 'ol/source/Vector';

import type { GeodesyWfsLayerId } from '../constants/wfs';
import type { GeodesyWfsAttributeFilterAuxiliaryProperties } from '../constants/wfsAttributeFilters';
import { readGeodesyWfsBusinessId } from './geodesyWfsFeatureId';

function buildLayerPropertyIndex(
  source: VectorSource<Feature<Geometry>>,
): ReadonlyMap<string, Readonly<Record<string, unknown>>> {
  const index = new Map<string, Readonly<Record<string, unknown>>>();

  source.getFeatures().forEach((feature) => {
    const businessId = readGeodesyWfsBusinessId(feature.getProperties());
    if (!businessId) {
      return;
    }

    index.set(businessId, feature.getProperties());
  });

  return index;
}

/** Indexe les attributs des couches WFS auxiliaires par identifiant métier (`id`, `no`). */
export function buildGeodesyWfsAttributeFilterAuxiliaryProperties(
  layers: ReadonlyArray<{ layerId: GeodesyWfsLayerId; source: VectorSource<Feature<Geometry>> }>,
): GeodesyWfsAttributeFilterAuxiliaryProperties {
  const byLayer = new Map<GeodesyWfsLayerId, ReadonlyMap<string, Readonly<Record<string, unknown>>>>();

  layers.forEach(({ layerId, source }) => {
    byLayer.set(layerId, buildLayerPropertyIndex(source));
  });

  return byLayer;
}
