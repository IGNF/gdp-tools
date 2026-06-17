import Feature from 'ol/Feature';
import type Geometry from 'ol/geom/Geometry';

import type { GeodesyCatalog } from '../catalog/geodesyCatalog';
import type { GeodesyAnnexLayerDefinition } from '../constants/annex';
import { fetchWithTimeout } from '../utils/fetchWithTimeout';
import { parseGeodesyGdpRgp2 } from './parseGeodesyGdpRgp2';

const annexLoadCache = new Map<string, Promise<Feature<Geometry>[]>>();

export interface LoadGeodesyAnnexFeaturesOptions {
  catalog?: GeodesyCatalog;
  definition: GeodesyAnnexLayerDefinition;
}

function parseAnnexPayload(
  definition: GeodesyAnnexLayerDefinition,
  payload: string,
  dataProjection: string,
): Feature<Geometry>[] {
  switch (definition.format) {
    case 'gdp-rgp2':
      return parseGeodesyGdpRgp2(payload, { dataProjection });
    default:
      return [];
  }
}

async function fetchAnnexPayload(url: string): Promise<string> {
  const response = await fetchWithTimeout(url, { credentials: 'omit' });
  if (!response.ok) {
    throw new Error(`[gdp-tools] Annex fetch failed (${response.status}) for ${url}`);
  }

  return response.text();
}

/** Charge les entités d’un flux annexe (mise en cache par URL). */
export async function loadGeodesyAnnexFeatures(
  options: LoadGeodesyAnnexFeaturesOptions,
): Promise<Feature<Geometry>[]> {
  const { definition, catalog } = options;
  const dataProjection = catalog?.wfsDataProjection ?? 'EPSG:4326';
  const cacheKey = `${definition.url}|${definition.format}|${dataProjection}`;

  let pending = annexLoadCache.get(cacheKey);
  if (!pending) {
    pending = fetchAnnexPayload(definition.url).then((payload) =>
      parseAnnexPayload(definition, payload, dataProjection),
    );
    annexLoadCache.set(cacheKey, pending);
  }

  return pending;
}
