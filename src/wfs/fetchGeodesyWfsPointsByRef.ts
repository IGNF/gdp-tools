import type { GeodesyCatalog } from '../catalog/geodesyCatalog';
import { LruMemoryCache } from '../cache/lruMemoryCache';
import {
  GEODESY_WFS_LAYERS,
  isGeodesyWfsLayerActive,
  resolveGeodesyWfsLayerUrl,
  type GeodesyWfsLayerId,
} from '../constants/wfs';
import { normalizeGeodesyWfsDomaine } from '../constants/wfsDomainLayers';
import { buildGeodesyWfsGetFeatureUrl } from './buildGeodesyWfsGetFeatureUrl';

const DEFAULT_WFS_FETCH_TIMEOUT_MS = 15_000;
/** Nombre de repères par requête (longueur d’URL raisonnable). */
const WFS_REF_BATCH_SIZE = 40;

/**
 * Référence d’un repère : `id` n’est unique qu’au sein d’un `domaine`
 * (ex. `id=1000` existe en `rsge`, `rsgf` et `rsgo`).
 */
export interface GeodesyPointRef {
  id: string;
  domaine: string;
}

export interface FetchGeodesyWfsPointsByRefOptions {
  catalog: GeodesyCatalog;
  refs: readonly GeodesyPointRef[];
  /** Couche WFS interrogée (défaut : `DATA_GEOD`, flux public). */
  layerId?: GeodesyWfsLayerId;
  /** Propriétés à renvoyer (toutes si omis). */
  propertyNames?: readonly string[];
  timeoutMs?: number;
}

/** `null` : repère absent du flux (supprimé, non diffusé…), mémorisé pour ne pas le redemander. */
const pointPropertiesCache = new LruMemoryCache<Record<string, unknown> | null>(512);

/** Clé stable d’un repère (`domaine:id`), utilisée pour indexer les résultats. */
export function geodesyPointRefKey(ref: GeodesyPointRef): string {
  return `${normalizeGeodesyWfsDomaine(ref.domaine) ?? ''}:${ref.id.trim()}`;
}

function cqlLiteral(value: string): string {
  return /^\d+$/.test(value) ? value : `'${value.replace(/'/g, "''")}'`;
}

/**
 * `id IN (…)` est interprété par GeoServer comme un filtre sur l’identifiant d’entité (FID),
 * pas sur l’attribut `id` : on combine donc des égalités.
 */
function buildRefsCqlFilter(refs: readonly GeodesyPointRef[]): string {
  return refs
    .map(
      (ref) =>
        `(id=${cqlLiteral(ref.id.trim())} AND domaine=${cqlLiteral(normalizeGeodesyWfsDomaine(ref.domaine) ?? '')})`,
    )
    .join(' OR ');
}

function cacheKey(layerId: GeodesyWfsLayerId, ref: GeodesyPointRef): string {
  return `${layerId}|${geodesyPointRefKey(ref)}`;
}

/**
 * Relit des repères par identifiant (`id` + `domaine`) — ex. pour enrichir une liste de
 * signalements qui ne stocke que ces deux champs. Résultats mis en cache mémoire.
 *
 * @returns propriétés indexées par {@link geodesyPointRefKey} ; les repères introuvables sont absents.
 */
export async function fetchGeodesyWfsPointsByRef(
  options: FetchGeodesyWfsPointsByRefOptions,
): Promise<Map<string, Record<string, unknown>>> {
  const {
    catalog,
    refs,
    layerId = 'DATA_GEOD',
    propertyNames,
    timeoutMs = DEFAULT_WFS_FETCH_TIMEOUT_MS,
  } = options;
  const results = new Map<string, Record<string, unknown>>();

  const definition =
    catalog.wfsLayers.find((layer) => layer.id === layerId) ??
    GEODESY_WFS_LAYERS.find((layer) => layer.id === layerId);
  if (!definition || !isGeodesyWfsLayerActive(definition, catalog.wfsApiKey)) {
    return results;
  }

  const missing = new Map<string, GeodesyPointRef>();
  for (const ref of refs) {
    if (!ref.id.trim() || !normalizeGeodesyWfsDomaine(ref.domaine)) {
      continue;
    }

    const key = geodesyPointRefKey(ref);
    const cached = pointPropertiesCache.get(cacheKey(layerId, ref));
    if (cached) {
      results.set(key, cached);
    } else if (cached === undefined) {
      missing.set(key, ref);
    }
  }

  const pending = [...missing.values()];
  for (let start = 0; start < pending.length; start += WFS_REF_BATCH_SIZE) {
    const batch = pending.slice(start, start + WFS_REF_BATCH_SIZE);
    const url = buildGeodesyWfsGetFeatureUrl({
      wfsUrl: resolveGeodesyWfsLayerUrl(definition, catalog.wfsUrl),
      typeName: definition.typeName,
      apiKey: definition.requiresApiKey ? catalog.wfsApiKey : undefined,
      cqlFilter: buildRefsCqlFilter(batch),
      propertyNames,
      version: definition.version,
      outputFormat: 'application/json',
      useCacheBuster: false,
    });

    const response = await fetch(url, {
      signal: AbortSignal.timeout(timeoutMs),
      credentials: 'omit',
      mode: 'cors',
    });
    if (!response.ok) {
      throw new Error(`[gdp-tools] WFS GetFeature by ref failed (${response.status})`);
    }

    const data = (await response.json()) as {
      features?: Array<{ properties?: Record<string, unknown> | null }>;
    };

    for (const feature of data.features ?? []) {
      const properties = feature.properties;
      if (!properties || properties.id == null || properties.domaine == null) {
        continue;
      }

      const ref = { id: String(properties.id), domaine: String(properties.domaine) };
      results.set(geodesyPointRefKey(ref), properties);
      pointPropertiesCache.set(cacheKey(layerId, ref), properties);
    }

    for (const ref of batch) {
      if (!results.has(geodesyPointRefKey(ref))) {
        pointPropertiesCache.set(cacheKey(layerId, ref), null);
      }
    }
  }

  return results;
}
