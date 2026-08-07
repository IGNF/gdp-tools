import Feature from 'ol/Feature';
import WKT from 'ol/format/WKT';
import Point from 'ol/geom/Point';
import type Geometry from 'ol/geom/Geometry';
import { transform } from 'ol/proj';

const WKT_FORMAT = new WKT();

const WKT_COLUMN_NAMES = new Set([
  'the_geom',
  'geom',
  'geometry',
  'wkt',
  'shape',
  'geometrie',
]);

const LON_COLUMN_NAMES = new Set(['lon', 'longitude', 'x', 'coord_x', 'cg1_coord1']);
const LAT_COLUMN_NAMES = new Set(['lat', 'latitude', 'y', 'coord_y', 'cg1_coord2']);

function detectDelimiter(headerLine: string): string {
  const commaCount = (headerLine.match(/,/g) ?? []).length;
  const semicolonCount = (headerLine.match(/;/g) ?? []).length;
  return semicolonCount > commaCount ? ';' : ',';
}

function parseCsvLine(line: string, delimiter: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];

    if (char === '"') {
      if (inQuotes && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === delimiter && !inQuotes) {
      fields.push(current.trim());
      current = '';
      continue;
    }

    current += char;
  }

  fields.push(current.trim());
  return fields;
}

function normalizeHeader(header: string): string {
  return header.trim().toLowerCase();
}

function findColumnIndex(headers: string[], candidates: Set<string>): number {
  return headers.findIndex((header) => candidates.has(normalizeHeader(header)));
}

function findWktColumnIndex(headers: string[]): number {
  return headers.findIndex((header) => WKT_COLUMN_NAMES.has(normalizeHeader(header)));
}

function createFeatureFromRow(
  headers: string[],
  values: string[],
  dataProjection: string,
  featureProjection: string,
): Feature<Geometry> | null {
  const properties: Record<string, string> = {};
  headers.forEach((header, index) => {
    const value = values[index]?.trim();
    if (value) {
      properties[header] = value;
    }
  });

  const wktIndex = findWktColumnIndex(headers);
  if (wktIndex >= 0) {
    const wktValue = values[wktIndex]?.trim();
    if (wktValue) {
      try {
        const feature = WKT_FORMAT.readFeature(wktValue, {
          dataProjection,
          featureProjection,
        }) as Feature<Geometry>;
        feature.setProperties(properties);
        return feature;
      } catch {
        return null;
      }
    }
  }

  const lonIndex = findColumnIndex(headers, LON_COLUMN_NAMES);
  const latIndex = findColumnIndex(headers, LAT_COLUMN_NAMES);
  if (lonIndex >= 0 && latIndex >= 0) {
    const lon = Number.parseFloat(values[lonIndex]?.replace(',', '.') ?? '');
    const lat = Number.parseFloat(values[latIndex]?.replace(',', '.') ?? '');
    if (Number.isFinite(lon) && Number.isFinite(lat)) {
      const coordinate = transform([lon, lat], dataProjection, featureProjection);
      const feature = new Feature(properties);
      feature.setGeometry(new Point(coordinate));
      return feature;
    }
  }

  return null;
}

export interface ParseGeodesyWfsCsvOptions {
  /** Projection des coordonnées CSV (défaut EPSG:4326). */
  dataProjection?: string;
  /** Projection cible des géométries OpenLayers. */
  featureProjection?: string;
}

/**
 * Parse une réponse WFS CSV (GetFeature) en features OpenLayers.
 * Détecte une colonne WKT (`geom`, `the_geom`…) ou des paires lon/lat.
 */
export function parseGeodesyWfsCsv(
  payload: string,
  options: ParseGeodesyWfsCsvOptions = {},
): Feature<Geometry>[] {
  const { dataProjection = 'EPSG:4326', featureProjection = 'EPSG:3857' } = options;

  const lines = payload
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length < 2) {
    return [];
  }

  const delimiter = detectDelimiter(lines[0]);
  const headers = parseCsvLine(lines[0], delimiter);

  return lines.slice(1).flatMap((line) => {
    const values = parseCsvLine(line, delimiter);
    const feature = createFeatureFromRow(headers, values, dataProjection, featureProjection);
    return feature ? [feature] : [];
  });
}
