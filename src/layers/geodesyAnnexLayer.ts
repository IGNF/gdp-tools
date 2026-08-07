import Feature from 'ol/Feature';
import type Geometry from 'ol/geom/Geometry';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import type { StyleLike } from 'ol/style/Style';

import {
  DEFAULT_GEODESY_CATALOG,
  type GeodesyCatalog,
} from '../catalog/geodesyCatalog';
import { loadGeodesyAnnexFeatures } from '../annex/loadGeodesyAnnexFeatures';
import { GEODESY_LAYER_ID_PROPERTY } from '../constants/wms';
import type { GeodesyAnnexLayerDefinition } from '../constants/annex';
import { GEODESY_LAYER_KIND_PROPERTY } from '../constants/wfs';
import { createGeodesyGdpRgp2StyleFunction } from '../style/geodesyAnnexStyle';

const BASE_Z_INDEX = 55;

export interface CreateGeodesyAnnexLayerOptions {
  visible?: boolean;
  catalog?: GeodesyCatalog;
  style?: StyleLike;
}

function resolveAnnexLayerStyle(
  definition: GeodesyAnnexLayerDefinition,
  styleOverride?: StyleLike,
): StyleLike {
  if (styleOverride !== undefined) {
    return styleOverride;
  }

  if (definition.format === 'gdp-rgp2') {
    return createGeodesyGdpRgp2StyleFunction();
  }

  return createGeodesyGdpRgp2StyleFunction();
}

function createAnnexVectorSource(
  definition: GeodesyAnnexLayerDefinition,
  catalog: GeodesyCatalog,
): VectorSource<Feature<Geometry>> {
  const source = new VectorSource<Feature<Geometry>>();

  void loadGeodesyAnnexFeatures({ definition, catalog })
    .then((features) => {
      source.addFeatures(features);
    })
    .catch((error: unknown) => {
      console.error(`[gdp-tools] Failed to load annex layer "${definition.id}".`, error);
    });

  return source;
}

/** Couche vectorielle issue d’un flux texte annexe Géoplateforme. */
export function createGeodesyAnnexLayer(
  definition: GeodesyAnnexLayerDefinition,
  options: CreateGeodesyAnnexLayerOptions = {},
): VectorLayer<VectorSource<Feature<Geometry>>> {
  const { visible = false, catalog = DEFAULT_GEODESY_CATALOG, style } = options;
  const layerIndex = catalog.annexLayerIds.indexOf(definition.id);

  return new VectorLayer({
    properties: {
      title: definition.title,
      name: `geodesyAnnex-${definition.id}`,
      [GEODESY_LAYER_ID_PROPERTY]: definition.id,
      [GEODESY_LAYER_KIND_PROPERTY]: 'annex',
    },
    visible,
    source: createAnnexVectorSource(definition, catalog),
    style: resolveAnnexLayerStyle(definition, style),
    zIndex: BASE_Z_INDEX + Math.max(layerIndex, 0),
  });
}
