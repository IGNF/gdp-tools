import LayerGroup from 'ol/layer/Group';
import type Feature from 'ol/Feature';
import type Geometry from 'ol/geom/Geometry';
import VectorLayer from 'ol/layer/Vector';
import type VectorSource from 'ol/source/Vector';

import {
  DEFAULT_GEODESY_CATALOG,
  GEODESY_CATALOG_PROPERTY,
  type GeodesyCatalog,
} from '../catalog/geodesyCatalog';
import { GEODESY_LAYER_GROUP_NAME } from '../constants/wms';
import {
  createGeodesyWfsAttributeFilterValuesHolder,
  GEODESY_WFS_ATTRIBUTE_FILTER_VALUES_PROPERTY,
  resolveGeodesyWfsAttributeFilterAuxiliaryLayerIds,
  type GeodesyWfsAttributeFilterValues,
  type GeodesyWfsAttributeFilterValuesHolder,
} from '../constants/wfsAttributeFilters';
import { GEODESY_WFS_DATA_LAYER_PROPERTY } from '../constants/wfsDomainLayers';
import type { GeodesyWfsLayerId } from '../constants/wfs';
import type { GeodesyLayerVisibility } from '../geodesyLayerVisibility';
import { resolveGeodesyWfsLayerStyle } from '../style/geodesyWfsPictoStyle';
import { buildGeodesyWfsAttributeFilterAuxiliaryProperties } from '../wfs/geodesyWfsAttributeFilterIndex';
import { createGeodesyAnnexLayer } from './geodesyAnnexLayer';
import { createGeodesyWfsDomainDisplayLayer } from './geodesyWfsDomainLayer';
import {
  createGeodesyWfsClusterSource,
  createGeodesyWfsDataLayer,
  createGeodesyWfsLayer,
} from './geodesyWfsLayer';
import { createGeodesyWmsLayer } from './geodesyWmsLayer';

export interface CreateGeodesyLayerGroupOptions {
  /** Catalogue des couches (catalogue IGN complet par défaut). */
  catalog?: GeodesyCatalog;
  /** Visibilité initiale par identifiant (RBF, RDF, RN, GDP…). */
  visibility?: Partial<GeodesyLayerVisibility>;
  /** Valeurs initiales des filtres attributs WFS (profil expert). */
  attributeFilterValues?: GeodesyWfsAttributeFilterValues;
}

const WFS_BASE_Z_INDEX = 50;

function getVectorSourceFromWfsLayer(
  layer: VectorLayer<VectorSource<Feature<Geometry>>>,
): VectorSource<Feature<Geometry>> | null {
  const source = layer.getSource();
  if (!source) {
    return null;
  }

  return source;
}

function refreshAttributeFilterAuxiliaryIndex(
  holder: GeodesyWfsAttributeFilterValuesHolder,
  auxiliaryLayers: ReadonlyArray<{
    layerId: GeodesyWfsLayerId;
    layer: VectorLayer<VectorSource<Feature<Geometry>>>;
  }>,
  domainDisplayLayers: VectorLayer<VectorSource<Feature<Geometry>>>[],
): void {
  const indexedLayers = auxiliaryLayers.flatMap(({ layerId, layer }) => {
    const source = getVectorSourceFromWfsLayer(layer);
    return source ? [{ layerId, source }] : [];
  });

  holder.auxiliaryPropertiesByLayerId =
    buildGeodesyWfsAttributeFilterAuxiliaryProperties(indexedLayers);
  domainDisplayLayers.forEach((layer) => layer.changed());
}

function bindAttributeFilterAuxiliarySource(
  source: VectorSource<Feature<Geometry>>,
  onChange: () => void,
): void {
  source.on('addfeature', onChange);
  source.on('removefeature', onChange);
  source.on('clear', onChange);
}

function createAttributeFilterAuxiliaryLayers(
  catalog: GeodesyCatalog,
  domainSourceLayerId: GeodesyWfsLayerId,
  attributeFilterValues: GeodesyWfsAttributeFilterValuesHolder,
  domainDisplayLayers: VectorLayer<VectorSource<Feature<Geometry>>>[],
): VectorLayer<VectorSource<Feature<Geometry>>>[] {
  const auxiliaryLayerIds = resolveGeodesyWfsAttributeFilterAuxiliaryLayerIds(
    catalog.wfsAttributeFilters,
    domainSourceLayerId,
  );

  if (!auxiliaryLayerIds.length) {
    return [];
  }

  const auxiliaryLayers = auxiliaryLayerIds.flatMap((layerId) => {
    const definition = catalog.wfsLayers.find((layer) => layer.id === layerId);
    if (!definition) {
      return [];
    }

    const layer = createGeodesyWfsDataLayer(definition, {
      catalog,
      visible: false,
    });
    layer.set(GEODESY_WFS_DATA_LAYER_PROPERTY, true);

    const source = getVectorSourceFromWfsLayer(layer);
    if (!source) {
      return [];
    }

    return [{ layerId, layer, source }];
  });

  const refreshIndex = () => {
    refreshAttributeFilterAuxiliaryIndex(
      attributeFilterValues,
      auxiliaryLayers,
      domainDisplayLayers,
    );
  };

  auxiliaryLayers.forEach(({ source }) => bindAttributeFilterAuxiliarySource(source, refreshIndex));
  refreshIndex();

  return auxiliaryLayers.map(({ layer }) => layer);
}

function isAnyDomainLayerVisible(
  catalog: GeodesyCatalog,
  visibility: Partial<GeodesyLayerVisibility>,
): boolean {
  return catalog.wfsDomainLayerIds.some((id) => visibility[id]);
}

function createDomainModeWfsLayers(
  catalog: GeodesyCatalog,
  visibility: Partial<GeodesyLayerVisibility>,
  attributeFilterValues: GeodesyWfsAttributeFilterValuesHolder,
) {
  const sourceLayerId = catalog.wfsDomainSourceLayerId;
  if (!sourceLayerId) {
    return [];
  }

  const sourceDefinition = catalog.wfsLayers.find((layer) => layer.id === sourceLayerId);
  if (!sourceDefinition) {
    throw new Error(
      `[gdp-tools] wfsDomainSourceLayerId "${sourceLayerId}" is missing from the catalog.`,
    );
  }

  const baseLayer = createGeodesyWfsDataLayer(sourceDefinition, {
    catalog,
    visible:
      visibility[sourceLayerId] ??
      isAnyDomainLayerVisible(catalog, visibility),
  });
  baseLayer.set(GEODESY_WFS_DATA_LAYER_PROPERTY, true);

  const vectorSource = baseLayer.getSource();
  if (!vectorSource) {
    throw new Error(`[gdp-tools] WFS source layer "${sourceLayerId}" has no vector source.`);
  }

  const pictoUrlMap = catalog.wfsPictoUrlMaps[sourceLayerId];
  const pointStyle = resolveGeodesyWfsLayerStyle(pictoUrlMap);
  const baseZIndex = WFS_BASE_Z_INDEX + Math.max(catalog.wfsLayerIds.indexOf(sourceLayerId), 0);

  const domainLayers = catalog.wfsDomainLayers.map((definition) => {
    const displaySource = catalog.wfsCluster.enabled
      ? createGeodesyWfsClusterSource(vectorSource, catalog, {
          catalog,
          domaines: definition.domaines,
          attributeFilterValues,
          domainSourceLayerId: sourceLayerId,
        })
      : vectorSource;

    return createGeodesyWfsDomainDisplayLayer(definition, {
      catalog,
      sourceLayerId,
      source: displaySource,
      pointStyle,
      baseZIndex,
      attributeFilterValues,
      visible: visibility[definition.id] ?? false,
    });
  });

  const auxiliaryLayers = createAttributeFilterAuxiliaryLayers(
    catalog,
    sourceLayerId,
    attributeFilterValues,
    domainLayers,
  );

  return [baseLayer, ...auxiliaryLayers, ...domainLayers];
}

export function createGeodesyLayerGroup(
  options: CreateGeodesyLayerGroupOptions = {},
): LayerGroup {
  const catalog = options.catalog ?? DEFAULT_GEODESY_CATALOG;
  const { visibility = { RBF: true }, attributeFilterValues: initialFilterValues } = options;
  const attributeFilterValues = createGeodesyWfsAttributeFilterValuesHolder(initialFilterValues);

  const wmsLayers = catalog.layers.map((definition) =>
    createGeodesyWmsLayer(definition, {
      catalog,
      visible:
        definition.id === catalog.dataLayerId
          ? false
          : (visibility[definition.id] ?? false),
    }),
  );

  const wfsLayers =
    catalog.wfsDomainLayers.length > 0
      ? createDomainModeWfsLayers(catalog, visibility, attributeFilterValues)
      : catalog.wfsLayers.map((definition) =>
          createGeodesyWfsLayer(definition, {
            catalog,
            visible: visibility[definition.id] ?? false,
            clusterGeometryFilter: {
              catalog,
              attributeFilterValues,
              domainSourceLayerId: definition.id,
            },
          }),
        );

  const annexLayers = catalog.annexLayers.map((definition) =>
    createGeodesyAnnexLayer(definition, {
      catalog,
      visible: visibility[definition.id] ?? false,
    }),
  );

  return new LayerGroup({
    properties: {
      title: 'Géodésie',
      name: GEODESY_LAYER_GROUP_NAME,
      [GEODESY_CATALOG_PROPERTY]: catalog,
      [GEODESY_WFS_ATTRIBUTE_FILTER_VALUES_PROPERTY]: attributeFilterValues,
    },
    layers: [...wmsLayers, ...wfsLayers, ...annexLayers],
  });
}
