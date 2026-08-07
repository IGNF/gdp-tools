import Feature from 'ol/Feature';
import GeoJSON from 'ol/format/GeoJSON';
import type Geometry from 'ol/geom/Geometry';
import type Map from 'ol/Map';
import LayerGroup from 'ol/layer/Group';
import TileLayer from 'ol/layer/Tile';
import type { Coordinate } from 'ol/coordinate';
import type { Projection } from 'ol/proj';
import type TileWMS from 'ol/source/TileWMS';

import {
  GEODESY_LAYER_GROUP_NAME,
  GEODESY_LAYER_ID_PROPERTY,
  type GeodesyWmsLayerId,
} from '../constants/wms';
import type { GeodesyLayerId } from '../catalog/geodesyCatalog';
import { getGeodesyCatalogFromMap } from '../catalog/getGeodesyCatalogFromMap';
import {
  getCachedFeatureInfoPayload,
  setCachedFeatureInfoPayload,
} from '../cache/geodesyFeatureInfoCache';
import { fetchWithTimeout } from '../utils/fetchWithTimeout';
import {
  featureMatchesVisibleNetworkLayers,
  mergeGeodesyFeatureHits,
} from './mergeGeodesyFeatureHits';

const INFO_FORMAT_JSON = 'application/json';
const INFO_FORMAT_HTML = 'text/html';

export interface GeodesyFeatureInfoHit {
  layerTitle: string;
  layerId?: GeodesyLayerId;
  feature: Feature<Geometry>;
}

export interface QueryGeodesyAtCoordinateOptions {
  /**
   * Couches interrogées au clic pour les attributs (GEODESIE_DATA).
   * Les couches réseau RBF/RDF/RN ne sont pas interrogées : leurs attributs y sont déjà inclus.
   * @default ['TOUT']
   */
  dataLayerIds?: readonly GeodesyWmsLayerId[];
  /**
   * Limite les hits aux types de réseau des couches cartographiques visibles.
   * Se base sur `groupe_type` dans GEODESIE_DATA.
   * @default true
   */
  filterByVisibleNetworkLayers?: boolean;
  /**
   * @deprecated Utiliser {@link QueryGeodesyAtCoordinateOptions.dataLayerIds}.
   */
  enrichmentLayerIds?: readonly GeodesyWmsLayerId[];
}

interface GeodesyLayerQueryTarget {
  layer: TileLayer<TileWMS>;
  layerTitle: string;
  layerId: GeodesyWmsLayerId;
}

function getGeodesyLayerGroup(map: Map): LayerGroup | null {
  const group = map
    .getLayers()
    .getArray()
    .find(
      (candidate) =>
        candidate instanceof LayerGroup && candidate.get('name') === GEODESY_LAYER_GROUP_NAME,
    );

  return group instanceof LayerGroup ? group : null;
}

function getGeodesyWmsLayerTargets(
  map: Map,
  options: {
    visibleOnly: boolean;
    layerIds?: readonly GeodesyWmsLayerId[];
  },
): GeodesyLayerQueryTarget[] {
  const group = getGeodesyLayerGroup(map);
  if (!group) {
    return [];
  }

  const allowedIds = options.layerIds ? new Set(options.layerIds) : null;

  return group
    .getLayers()
    .getArray()
    .flatMap((layer) => {
      if (!(layer instanceof TileLayer)) {
        return [];
      }

      const layerId = layer.get(GEODESY_LAYER_ID_PROPERTY) as GeodesyWmsLayerId | undefined;
      if (!layerId) {
        return [];
      }

      if (allowedIds && !allowedIds.has(layerId)) {
        return [];
      }

      if (options.visibleOnly && !layer.getVisible()) {
        return [];
      }

      if (!options.visibleOnly && layer.getVisible()) {
        return [];
      }

      const source = layer.getSource();
      if (!source) {
        return [];
      }

      return [
        {
          layer: layer as TileLayer<TileWMS>,
          layerTitle: (layer.get('title') as string | undefined) ?? 'Géodésie',
          layerId,
        },
      ];
    });
}

function getVisibleNetworkLayerIds(map: Map): GeodesyWmsLayerId[] {
  const catalog = getGeodesyCatalogFromMap(map);
  const networkIds = new Set<GeodesyWmsLayerId>(catalog.networkLayerIds);

  return getGeodesyWmsLayerTargets(map, { visibleOnly: true })
    .map((target) => target.layerId)
    .filter((layerId): layerId is GeodesyWmsLayerId => networkIds.has(layerId));
}

function dedupeLayerTargets(targets: GeodesyLayerQueryTarget[]): GeodesyLayerQueryTarget[] {
  const seen = new Set<GeodesyWmsLayerId>();
  return targets.filter((target) => {
    if (seen.has(target.layerId)) {
      return false;
    }
    seen.add(target.layerId);
    return true;
  });
}

function parseJsonFeatureInfo(
  payload: string,
  projection: Projection,
): Feature<Geometry>[] {
  try {
    const data = JSON.parse(payload) as {
      features?: unknown[];
    };
    if (!data.features?.length) {
      return [];
    }
    return new GeoJSON().readFeatures(data, {
      featureProjection: projection,
    }) as Feature<Geometry>[];
  } catch {
    return [];
  }
}

function parseHtmlFeatureInfo(payload: string, coordinate: Coordinate): Feature<Geometry>[] {
  if (!payload.includes('table.featureInfo')) {
    return [];
  }

  const parser = new DOMParser();
  const document = parser.parseFromString(payload, 'text/html');
  const table = document.querySelector('table.featureInfo');
  if (!table) {
    return [];
  }

  const properties: Record<string, string> = {};
  const caption = table.querySelector('caption')?.textContent?.trim();
  if (caption) {
    properties._caption = caption;
  }

  table.querySelectorAll('tr').forEach((row) => {
    const header = row.querySelector('th');
    const cell = row.querySelector('td');
    const key = header?.textContent?.trim();
    const value = cell?.textContent?.trim();
    if (key && value) {
      properties[key] = value;
    }
  });

  if (Object.keys(properties).length === 0) {
    return [];
  }

  const feature = new Feature(properties);
  feature.set('coordinate', coordinate);
  return [feature];
}

function featureFromHtmlTable(html: string, layerTitle: string): Feature<Geometry>[] {
  const parser = new DOMParser();
  const document = parser.parseFromString(html, 'text/html');
  const table = document.querySelector('table.featureInfo');
  if (!table) {
    return [];
  }

  const feature = new Feature({
    _caption: table.querySelector('caption')?.textContent?.trim() ?? layerTitle,
    _htmlSnippet: table.outerHTML,
  });
  return [feature];
}

function isWmsServiceException(payload: string): boolean {
  return payload.includes('ServiceExceptionReport') || payload.includes('<ServiceException');
}

async function fetchFeatureInfo(
  source: TileWMS,
  coordinate: Coordinate,
  resolution: number,
  projection: Projection,
  infoFormat: string,
): Promise<string | null> {
  const layerName = source.getParams().LAYERS as string;
  const url = source.getFeatureInfoUrl(coordinate, resolution, projection, {
    INFO_FORMAT: infoFormat,
    QUERY_LAYERS: layerName,
    FEATURE_COUNT: 10,
    BUFFER: 15,
    STYLES: '',
  });

  if (!url) {
    return null;
  }

  const cachedPayload = getCachedFeatureInfoPayload(url);
  if (cachedPayload !== undefined) {
    return cachedPayload;
  }

  const response = await fetchWithTimeout(url, { timeoutMs: 5_000 });
  if (!response.ok) {
    return null;
  }

  const payload = await response.text();
  if (isWmsServiceException(payload)) {
    return null;
  }

  setCachedFeatureInfoPayload(url, payload);
  return payload;
}

async function queryGeodesyLayerAtCoordinate(
  target: GeodesyLayerQueryTarget,
  coordinate: Coordinate,
  resolution: number,
  projection: Projection,
): Promise<GeodesyFeatureInfoHit[]> {
  const source = target.layer.getSource();
  if (!source) {
    return [];
  }

  let features = parseJsonFeatureInfo(
    (await fetchFeatureInfo(source, coordinate, resolution, projection, INFO_FORMAT_JSON)) ?? '',
    projection,
  );

  if (features.length === 0) {
    const html =
      (await fetchFeatureInfo(source, coordinate, resolution, projection, INFO_FORMAT_HTML)) ?? '';
    features = parseHtmlFeatureInfo(html, coordinate);
    if (features.length === 0 && html.includes('table.featureInfo')) {
      features = featureFromHtmlTable(html, target.layerTitle);
    }
  }

  return features.map((feature) => ({
    layerTitle: target.layerTitle,
    layerId: target.layerId,
    feature,
  }));
}

/**
 * Interroge GEODESIE_DATA au clic (couche TOUT, même masquée).
 * Les couches réseau RBF/RDF/RN ne sont pas interrogées : leurs attributs y sont déjà inclus.
 */
export async function queryGeodesyAtCoordinate(
  map: Map,
  coordinate: Coordinate,
  options: QueryGeodesyAtCoordinateOptions = {},
): Promise<GeodesyFeatureInfoHit[]> {
  const view = map.getView();
  const resolution = view.getResolution();
  const projection = view.getProjection();

  if (resolution === undefined || !projection) {
    return [];
  }

  const dataLayerIds =
    options.dataLayerIds ??
    options.enrichmentLayerIds ??
    [getGeodesyCatalogFromMap(map).dataLayerId];
  const filterByVisibleNetworkLayers = options.filterByVisibleNetworkLayers ?? true;

  const dataTargets = dedupeLayerTargets(
    getGeodesyWmsLayerTargets(map, {
      visibleOnly: false,
      layerIds: dataLayerIds,
    }),
  );

  if (dataTargets.length === 0) {
    return [];
  }

  const hitGroups = await Promise.all(
    dataTargets.map((target) =>
      queryGeodesyLayerAtCoordinate(target, coordinate, resolution, projection),
    ),
  );

  let hits = mergeGeodesyFeatureHits(hitGroups.flat(), getGeodesyCatalogFromMap(map));

  if (filterByVisibleNetworkLayers) {
    const visibleNetworkLayerIds = getVisibleNetworkLayerIds(map);
    hits = hits.filter((hit) =>
      featureMatchesVisibleNetworkLayers(hit.feature.getProperties(), visibleNetworkLayerIds),
    );
  }

  return hits;
}
