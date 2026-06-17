import Feature from 'ol/Feature';

import {
  DEFAULT_GEODESY_CATALOG,
  type GeodesyCatalog,
} from '../catalog/geodesyCatalog';
import { type GeodesyWmsLayerId } from '../constants/wms';
import type { GeodesyFeatureInfoHit } from './queryGeodesyAtCoordinate';

function isScalarPropertyValue(value: unknown): value is string | number | boolean {
  return value !== null && value !== undefined && typeof value !== 'object';
}

function addScalarProperties(
  target: Map<string, { key: string; value: string | number | boolean }>,
  properties: Record<string, unknown>,
): void {
  for (const [key, value] of Object.entries(properties)) {
    if (!isScalarPropertyValue(value)) {
      continue;
    }

    const stringValue = String(value).trim();
    if (stringValue === '') {
      continue;
    }

    target.set(key.toLowerCase(), { key, value });
  }
}

/** Retourne les propriétés GEODESIE_DATA sans fusionner les attributs des couches réseau. */
export function mergeGeodesyFeatureProperties(
  _networkProperties: Record<string, unknown>,
  dataProperties: Record<string, unknown>,
): Record<string, unknown> {
  const mergedByLowerKey = new Map<string, { key: string; value: string | number | boolean }>();

  addScalarProperties(mergedByLowerKey, dataProperties);

  return Object.fromEntries(
    [...mergedByLowerKey.values()].map(({ key, value }) => [key, value]),
  );
}

function getPropertyCaseInsensitive(
  properties: Record<string, unknown>,
  key: string,
): unknown {
  if (key in properties) {
    return properties[key];
  }

  const lowerKey = key.toLowerCase();
  const match = Object.keys(properties).find((candidate) => candidate.toLowerCase() === lowerKey);
  return match ? properties[match] : undefined;
}

/** Déduit le libellé réseau (RBF, RDF…) à partir de `groupe_type` dans GEODESIE_DATA. */
export function resolveGeodesyLayerTitle(
  properties: Record<string, unknown>,
  fallback = 'Point géodésique',
  catalog: GeodesyCatalog = DEFAULT_GEODESY_CATALOG,
): string {
  const groupeType = String(getPropertyCaseInsensitive(properties, 'groupe_type') ?? '').trim();
  if (!groupeType) {
    return fallback;
  }

  const normalizedGroupeType = groupeType.toLowerCase();

  const matchedLayer = catalog.layers.find((layer) => {
    if (layer.id === catalog.dataLayerId) {
      return false;
    }

    const tokens = [layer.id, layer.shortLabel, layer.title].map((token) => token.toLowerCase());
    return tokens.some(
      (token) =>
        normalizedGroupeType.includes(token) ||
        token.includes(normalizedGroupeType) ||
        normalizedGroupeType === layer.id.toLowerCase(),
    );
  });

  return matchedLayer?.title ?? groupeType;
}

/** Vérifie si le repère correspond à au moins une couche réseau visible sur la carte. */
export function featureMatchesVisibleNetworkLayers(
  properties: Record<string, unknown>,
  visibleNetworkLayerIds: readonly GeodesyWmsLayerId[],
  catalog: GeodesyCatalog = DEFAULT_GEODESY_CATALOG,
): boolean {
  if (visibleNetworkLayerIds.length === 0) {
    return false;
  }

  const groupeType = String(getPropertyCaseInsensitive(properties, 'groupe_type') ?? '').trim();
  if (!groupeType) {
    return true;
  }

  const normalizedGroupeType = groupeType.toLowerCase();

  return visibleNetworkLayerIds.some((layerId) => {
    const layer = catalog.layers.find((candidate) => candidate.id === layerId);
    if (!layer) {
      return false;
    }

    const tokens = [layer.id, layer.shortLabel, layer.title].map((token) => token.toLowerCase());
    return tokens.some(
      (token) =>
        normalizedGroupeType.includes(token) ||
        token.includes(normalizedGroupeType) ||
        normalizedGroupeType === layer.id.toLowerCase(),
    );
  });
}

function enrichDataHit(hit: GeodesyFeatureInfoHit, catalog: GeodesyCatalog): GeodesyFeatureInfoHit {
  if (hit.layerId !== catalog.dataLayerId) {
    return hit;
  }

  return {
    ...hit,
    layerTitle: resolveGeodesyLayerTitle(hit.feature.getProperties(), hit.layerTitle, catalog),
  };
}

function createMergedHit(
  networkHit: GeodesyFeatureInfoHit,
  dataHit: GeodesyFeatureInfoHit,
  catalog: GeodesyCatalog,
): GeodesyFeatureInfoHit {
  const feature = new Feature(
    mergeGeodesyFeatureProperties(
      networkHit.feature.getProperties(),
      dataHit.feature.getProperties(),
    ),
  );

  const geometry = dataHit.feature.getGeometry() ?? networkHit.feature.getGeometry();
  if (geometry) {
    feature.setGeometry(geometry.clone());
  }

  const coordinate = networkHit.feature.get('coordinate') ?? dataHit.feature.get('coordinate');
  if (coordinate !== undefined) {
    feature.set('coordinate', coordinate);
  }

  return {
    layerTitle: resolveGeodesyLayerTitle(feature.getProperties(), networkHit.layerTitle, catalog),
    layerId: catalog.dataLayerId,
    feature,
  };
}

/**
 * Normalise les hits GetFeatureInfo : attributs issus de GEODESIE_DATA uniquement.
 * Conserve éventuellement l’identité réseau (titre) sans réutiliser ses attributs.
 */
export function mergeGeodesyFeatureHits(
  hits: GeodesyFeatureInfoHit[],
  catalog: GeodesyCatalog = DEFAULT_GEODESY_CATALOG,
): GeodesyFeatureInfoHit[] {
  if (hits.length === 0) {
    return hits;
  }

  const networkLayerIds = new Set<GeodesyWmsLayerId>(catalog.networkLayerIds);

  const dataHits = hits
    .filter((hit) => hit.layerId === catalog.dataLayerId)
    .map((hit) => enrichDataHit(hit, catalog));
  if (dataHits.length > 0) {
    return dataHits;
  }

  if (hits.length <= 1) {
    return hits.map((hit) => enrichDataHit(hit, catalog));
  }

  const networkHits = hits.filter(
    (hit) =>
      hit.layerId !== undefined &&
      networkLayerIds.has(hit.layerId as GeodesyWmsLayerId),
  );
  const networkHit = networkHits[0];
  const dataHit = hits.find((hit) => hit.layerId === catalog.dataLayerId);

  if (networkHit && dataHit) {
    return [createMergedHit(networkHit, dataHit, catalog)];
  }

  return hits.map((hit) => enrichDataHit(hit, catalog));
}
