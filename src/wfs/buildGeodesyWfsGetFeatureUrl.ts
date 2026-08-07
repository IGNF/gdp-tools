import type { Extent } from 'ol/extent';
import { transformExtent } from 'ol/proj';
import type { Projection } from 'ol/proj';

import type { GeodesyWfsBboxOrder } from '../constants/wfs';

export interface FormatGeodesyWfsBboxOptions {
  bboxOrder?: GeodesyWfsBboxOrder;
  /** Marge relative autour de l’emprise (ex. 0.05 = 5 %). */
  paddingRatio?: number;
  /** Suffixe CRS WFS 2.0 ajouté au paramètre bbox. */
  bboxCrs?: string;
}

/** Formate l’emprise carte en paramètre `bbox` WFS (EPSG:4326). */
export function formatGeodesyWfsBbox(
  extent: Extent,
  projection: Projection,
  options: FormatGeodesyWfsBboxOptions = {},
): string {
  const { bboxOrder = 'latLon', paddingRatio = 0, bboxCrs } = options;
  const wgs84Extent = transformExtent(extent, projection, 'EPSG:4326');
  let [minLon, minLat, maxLon, maxLat] = wgs84Extent;

  if (paddingRatio > 0) {
    const padLon = (maxLon - minLon) * paddingRatio;
    const padLat = (maxLat - minLat) * paddingRatio;
    minLon -= padLon;
    maxLon += padLon;
    minLat -= padLat;
    maxLat += padLat;
  }

  const coordinates =
    bboxOrder === 'latLon'
      ? [minLat, minLon, maxLat, maxLon]
      : [minLon, minLat, maxLon, maxLat];

  const bbox = coordinates.join(',');
  return bboxCrs ? `${bbox},${bboxCrs}` : bbox;
}

export interface BuildGeodesyWfsGetFeatureUrlOptions {
  wfsUrl: string;
  typeName: string;
  bbox: string;
  apiKey?: string;
  version?: string;
  outputFormat?: string;
  /** Paramètre anti-cache (`_t`) — activé par défaut. */
  useCacheBuster?: boolean;
}

function usesWfs20TypeNamesParam(version: string): boolean {
  return version.startsWith('2.');
}

/** Construit l’URL GetFeature WFS Géoplateforme (public ou privé). */
export function buildGeodesyWfsGetFeatureUrl(
  options: BuildGeodesyWfsGetFeatureUrlOptions,
): string {
  const {
    wfsUrl,
    typeName,
    bbox,
    apiKey,
    version = '2.0.0',
    outputFormat = 'application/json',
    useCacheBuster = true,
  } = options;

  const params = new URLSearchParams({
    SERVICE: 'WFS',
    VERSION: version,
    REQUEST: 'GetFeature',
    OUTPUTFORMAT: outputFormat,
    bbox,
  });

  if (usesWfs20TypeNamesParam(version)) {
    params.set('typeNames', typeName);
  } else {
    params.set('TYPENAME', typeName);
  }

  if (apiKey) {
    params.set('apikey', apiKey);
  }

  if (useCacheBuster) {
    params.set('_t', String(Date.now()));
  }

  const separator = wfsUrl.includes('?') ? '&' : '?';
  return `${wfsUrl}${separator}${params.toString()}`;
}
