import type { Coordinate } from 'ol/coordinate';

import type { GeodesyLayerId } from '../catalog/geodesyCatalog';
import type { GeodesyFeatureInfoHit } from '../wms/queryGeodesyAtCoordinate';
import {
  buildGeodesyPointDisplay,
  type BuildGeodesyPointDisplayOptions,
  type GeodesyPointDisplay,
} from './geodesyPointDisplay';
import type { GeodesyPointPhoto } from './geodesyPointPhotos';

export interface GeodesyPointReportContext extends GeodesyPointDisplay {
  layerId?: GeodesyLayerId;
  properties: Record<string, unknown>;
  geodesyId?: string;
}

export interface BuildGeodesyPointReportContextOptions extends BuildGeodesyPointDisplayOptions {}

function extractGeodesyId(properties: Record<string, unknown>): string | undefined {
  const raw = properties.id ?? properties.ID;
  if (raw === null || raw === undefined) {
    return undefined;
  }

  const id = String(raw).trim();
  return id || undefined;
}

function toPlainProperties(properties: Record<string, unknown>): Record<string, unknown> {
  const plain: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(properties)) {
    if (key === 'geometry' || (value !== null && typeof value === 'object')) {
      continue;
    }
    plain[key] = value;
  }

  return plain;
}

/** Contexte signalement sur point géodésique (sérialisable, sans feature OL). */
export function buildGeodesyPointReportContext(
  hit: GeodesyFeatureInfoHit,
  fallbackCoordinate: Coordinate,
  options: BuildGeodesyPointReportContextOptions = {},
): GeodesyPointReportContext {
  const properties = toPlainProperties(hit.feature.getProperties());
  const display = buildGeodesyPointDisplay(hit, fallbackCoordinate, options);

  return {
    ...display,
    layerId: hit.layerId,
    properties,
    geodesyId: extractGeodesyId(properties),
  };
}

export type { GeodesyPointPhoto };
