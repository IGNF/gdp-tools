import Feature from 'ol/Feature';
import type Geometry from 'ol/geom/Geometry';
import type { Extent } from 'ol/extent';
import type { Projection } from 'ol/proj';

import type { GeodesyCatalog } from '../catalog/geodesyCatalog';
import { GEODESY_LAYER_ID_PROPERTY } from '../constants/wms';
import {
  isGeodesyWfsLayerActive,
  resolveGeodesyWfsLayerUrl,
  type GeodesyWfsLayerDefinition,
} from '../constants/wfs';
import {
  buildGeodesyWfsGetFeatureUrl,
  formatGeodesyWfsBbox,
} from './buildGeodesyWfsGetFeatureUrl';
import { parseGeodesyWfsCsv } from './parseGeodesyWfsCsv';
import { parseGeodesyWfsGeoJson } from './parseGeodesyWfsGeoJson';
import { assignGeodesyWfsFeatureId } from './geodesyWfsFeatureId';

const DEFAULT_WFS_FETCH_TIMEOUT_MS = 15_000;

export interface LoadGeodesyWfsFeaturesOptions {
  catalog: GeodesyCatalog;
  definition: GeodesyWfsLayerDefinition;
  extent: Extent;
  projection: Projection;
  timeoutMs?: number;
}

function isWfsServiceError(payload: string): boolean {
  const normalized = payload.trim().toLowerCase();
  return (
    normalized.includes('serviceexception') ||
    normalized.includes('exceptionreport') ||
    normalized.startsWith('<?xml')
  );
}

function parseWfsResponse(
  payload: string,
  definition: GeodesyWfsLayerDefinition,
  catalog: GeodesyCatalog,
  projection: Projection,
): Feature<Geometry>[] {
  if (definition.responseFormat === 'geojson') {
    return parseGeodesyWfsGeoJson(payload, {
      dataProjection: catalog.wfsDataProjection,
      featureProjection: projection.getCode(),
    });
  }

  return parseGeodesyWfsCsv(payload, {
    dataProjection: catalog.wfsDataProjection,
    featureProjection: projection.getCode(),
  });
}

/** Charge les entités WFS pour une emprise carte (CSV ou GeoJSON). */
export async function loadGeodesyWfsFeatures(
  options: LoadGeodesyWfsFeaturesOptions,
): Promise<Feature<Geometry>[]> {
  const { catalog, definition, extent, projection, timeoutMs = DEFAULT_WFS_FETCH_TIMEOUT_MS } =
    options;

  if (!isGeodesyWfsLayerActive(definition, catalog.wfsApiKey)) {
    return [];
  }

  const bbox = formatGeodesyWfsBbox(extent, projection, {
    bboxOrder: definition.bboxOrder,
    paddingRatio: catalog.wfsBboxPaddingRatio,
    bboxCrs: definition.bboxCrs,
  });

  const url = buildGeodesyWfsGetFeatureUrl({
    wfsUrl: resolveGeodesyWfsLayerUrl(definition, catalog.wfsUrl),
    typeName: definition.typeName,
    apiKey: definition.requiresApiKey ? catalog.wfsApiKey : undefined,
    bbox,
    version: definition.version,
    outputFormat: definition.outputFormat,
    useCacheBuster: catalog.wfsUseCacheBuster,
  });

  const response = await fetch(url, {
    signal: AbortSignal.timeout(timeoutMs),
    credentials: 'omit',
    mode: 'cors',
  });

  if (!response.ok) {
    throw new Error(`[gdp-tools] WFS GetFeature failed (${response.status})`);
  }

  const payload = await response.text();
  if (!payload.trim() || isWfsServiceError(payload)) {
    return [];
  }

  return parseWfsResponse(payload, definition, catalog, projection).map((feature) => {
    feature.set(GEODESY_LAYER_ID_PROPERTY, definition.id);
    assignGeodesyWfsFeatureId(feature, definition.id);
    return feature;
  });
}
