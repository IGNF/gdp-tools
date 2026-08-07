import Feature from 'ol/Feature';
import type Geometry from 'ol/geom/Geometry';
import VectorLayer from 'ol/layer/Vector';
import { bbox as bboxLoadingStrategy } from 'ol/loadingstrategy';
import Cluster from 'ol/source/Cluster';
import VectorSource from 'ol/source/Vector';
import type { StyleLike } from 'ol/style/Style';

import {
  DEFAULT_GEODESY_CATALOG,
  type GeodesyCatalog,
} from '../catalog/geodesyCatalog';
import { GEODESY_LAYER_ID_PROPERTY } from '../constants/wms';
import {
  GEODESY_LAYER_KIND_PROPERTY,
  type GeodesyWfsLayerDefinition,
} from '../constants/wfs';
import { GeodesyAnimatedCluster } from './geodesyAnimatedClusterLayer';
import {
  DEFAULT_GEODESY_WFS_POINT_STYLE,
  resolveGeodesyWfsLayerStyle,
} from '../style/geodesyWfsPictoStyle';
import { wrapGeodesyWfsStyleForCluster } from '../style/geodesyWfsClusterStyle';
import { loadGeodesyWfsFeatures } from '../wfs/loadGeodesyWfsFeatures';
import {
  createGeodesyWfsClusterGeometryFunction,
  type GeodesyWfsClusterGeometryFilterOptions,
} from '../wfs/geodesyWfsClusterGeometry';

const BASE_Z_INDEX = 50;

/** Résolution max. d’affichage / chargement WFS (commune cluster activé ou non). */
export function resolveGeodesyWfsMaxResolution(catalog: GeodesyCatalog): number {
  return catalog.wfsCluster.maxResolution;
}

export interface CreateGeodesyWfsLayerOptions {
  visible?: boolean;
  catalog?: GeodesyCatalog;
  /** Style fixe ou fonction ; prioritaire sur {@link GeodesyCatalog.wfsPictoUrlMaps}. */
  style?: StyleLike;
  /** Filtres actifs pour exclure les entités du clustering (mode domaine / attributs). */
  clusterGeometryFilter?: GeodesyWfsClusterGeometryFilterOptions;
}

export function createGeodesyWfsVectorSource(
  definition: GeodesyWfsLayerDefinition,
  catalog: GeodesyCatalog,
): VectorSource<Feature<Geometry>> {
  return new VectorSource<Feature<Geometry>>({
    strategy: bboxLoadingStrategy,
    loader: async (extent, _resolution, projection) => {
      return loadGeodesyWfsFeatures({
        catalog,
        definition,
        extent,
        projection,
      });
    },
  });
}

export function createGeodesyWfsClusterSource(
  vectorSource: VectorSource<Feature<Geometry>>,
  catalog: GeodesyCatalog,
  clusterGeometryFilter?: GeodesyWfsClusterGeometryFilterOptions,
): Cluster<Feature<Geometry>> {
  return new Cluster({
    distance: catalog.wfsCluster.distance,
    minDistance: catalog.wfsCluster.minDistance,
    source: vectorSource,
    ...(clusterGeometryFilter
      ? {
          geometryFunction: createGeodesyWfsClusterGeometryFunction(clusterGeometryFilter),
        }
      : {}),
  });
}

function createGeodesyWfsLayerSource(
  definition: GeodesyWfsLayerDefinition,
  catalog: GeodesyCatalog,
  clusterGeometryFilter?: GeodesyWfsClusterGeometryFilterOptions,
): VectorSource<Feature<Geometry>> {
  const vectorSource = createGeodesyWfsVectorSource(definition, catalog);

  if (!catalog.wfsCluster.enabled) {
    return vectorSource;
  }

  return createGeodesyWfsClusterSource(vectorSource, catalog, clusterGeometryFilter);
}

export interface CreateGeodesyWfsAnimatedVectorLayerOptions {
  catalog: GeodesyCatalog;
  visible: boolean;
  source: VectorSource<Feature<Geometry>>;
  style: StyleLike;
  zIndex: number;
  properties: Record<string, unknown>;
}

/** Couche vectorielle WFS avec AnimatedCluster si le catalogue l’active. */
export function createGeodesyWfsAnimatedVectorLayer(
  options: CreateGeodesyWfsAnimatedVectorLayerOptions,
): VectorLayer<VectorSource<Feature<Geometry>>> {
  const { catalog, visible, source, style, zIndex, properties } = options;
  const maxResolution = resolveGeodesyWfsMaxResolution(catalog);
  const layerOptions = {
    properties,
    visible,
    source,
    style,
    zIndex,
    maxResolution,
    ...(catalog.wfsCluster.enabled
      ? {
          updateWhileAnimating: true as const,
          updateWhileInteracting: true as const,
        }
      : {}),
  };

  if (catalog.wfsCluster.enabled) {
    return new GeodesyAnimatedCluster({
      ...layerOptions,
      animationDuration: catalog.wfsCluster.animationDuration,
    });
  }

  return new VectorLayer(layerOptions);
}

/** Couche WFS chargement uniquement (source brute, sans cluster ni style). */
export function createGeodesyWfsDataLayer(
  definition: GeodesyWfsLayerDefinition,
  options: { catalog?: GeodesyCatalog; visible?: boolean } = {},
): VectorLayer<VectorSource<Feature<Geometry>>> {
  const catalog = options.catalog ?? DEFAULT_GEODESY_CATALOG;
  const layerIndex = catalog.wfsLayerIds.indexOf(definition.id);

  return new VectorLayer({
    properties: {
      title: definition.title,
      name: `geodesyWfs-${definition.id}`,
      [GEODESY_LAYER_ID_PROPERTY]: definition.id,
      [GEODESY_LAYER_KIND_PROPERTY]: 'wfs',
    },
    visible: options.visible ?? false,
    source: createGeodesyWfsVectorSource(definition, catalog),
    style: () => [],
    maxResolution: resolveGeodesyWfsMaxResolution(catalog),
    zIndex: BASE_Z_INDEX + Math.max(layerIndex, 0),
  });
}

function createGeodesyWfsDisplayLayer(
  definition: GeodesyWfsLayerDefinition,
  options: {
    catalog: GeodesyCatalog;
    visible: boolean;
    layerStyle: StyleLike;
    layerIndex: number;
    clusterGeometryFilter?: GeodesyWfsClusterGeometryFilterOptions;
  },
): VectorLayer<VectorSource<Feature<Geometry>>> {
  const { catalog, visible, layerStyle, layerIndex, clusterGeometryFilter } = options;

  return createGeodesyWfsAnimatedVectorLayer({
    catalog,
    visible,
    source: createGeodesyWfsLayerSource(definition, catalog, clusterGeometryFilter),
    style: layerStyle,
    zIndex: BASE_Z_INDEX + Math.max(layerIndex, 0),
    properties: {
      title: definition.title,
      name: `geodesyWfs-${definition.id}`,
      [GEODESY_LAYER_ID_PROPERTY]: definition.id,
      [GEODESY_LAYER_KIND_PROPERTY]: 'wfs',
    },
  });
}

/** Couche vectorielle WFS (GetFeature GeoJSON, chargement par emprise). */
export function createGeodesyWfsLayer(
  definition: GeodesyWfsLayerDefinition,
  options: CreateGeodesyWfsLayerOptions = {},
): VectorLayer<VectorSource<Feature<Geometry>>> {
  const { visible = false, catalog = DEFAULT_GEODESY_CATALOG, style, clusterGeometryFilter } =
    options;
  const pictoUrlMap = catalog.wfsPictoUrlMaps[definition.id];
  const pointStyle = resolveGeodesyWfsLayerStyle(pictoUrlMap, style);
  const layerStyle = catalog.wfsCluster.enabled
    ? wrapGeodesyWfsStyleForCluster(pointStyle)
    : pointStyle;
  const layerIndex = catalog.wfsLayerIds.indexOf(definition.id);

  return createGeodesyWfsDisplayLayer(definition, {
    catalog,
    visible,
    layerStyle,
    layerIndex,
    clusterGeometryFilter,
  });
}

export { DEFAULT_GEODESY_WFS_POINT_STYLE };
