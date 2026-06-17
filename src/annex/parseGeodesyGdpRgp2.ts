import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import type Geometry from 'ol/geom/Geometry';
import { transform } from 'ol/proj';

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

function parseLonLatPair(raw: string): { longitude: number; latitude: number } | null {
  const [lonRaw, latRaw] = raw.split(',').map((part) => part.trim());
  const longitude = Number.parseFloat(lonRaw?.replace(',', '.') ?? '');
  const latitude = Number.parseFloat(latRaw?.replace(',', '.') ?? '');

  if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) {
    return null;
  }

  return { longitude, latitude };
}

function findLonLatColumnIndex(headers: string[]): number {
  return headers.findIndex((header) => {
    const normalized = normalizeHeader(header);
    return normalized === 'longitude,latitude' || normalized === 'lon,lat';
  });
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
    if (!value) {
      return;
    }

    properties[normalizeHeader(header)] = value;
  });

  const lonLatIndex = findLonLatColumnIndex(headers);
  if (lonLatIndex < 0) {
    return null;
  }

  const coordinates = parseLonLatPair(values[lonLatIndex] ?? '');
  if (!coordinates) {
    return null;
  }

  properties.longitude = String(coordinates.longitude);
  properties.latitude = String(coordinates.latitude);

  const coordinate = transform(
    [coordinates.longitude, coordinates.latitude],
    dataProjection,
    featureProjection,
  );
  const feature = new Feature(properties);
  feature.setGeometry(new Point(coordinate));
  feature.setId(properties.nom ?? undefined);
  return feature;
}

export interface ParseGeodesyGdpRgp2Options {
  /** Projection des coordonnées du fichier (défaut EPSG:4326). */
  dataProjection?: string;
  /** Projection cible des géométries OpenLayers. */
  featureProjection?: string;
}

/**
 * Parse le flux texte `GDP_RGP2.txt` (séparateur `;`, colonne `longitude,latitude`).
 * Ignore les lignes de commentaire commençant par `#`.
 */
export function parseGeodesyGdpRgp2(
  payload: string,
  options: ParseGeodesyGdpRgp2Options = {},
): Feature<Geometry>[] {
  const { dataProjection = 'EPSG:4326', featureProjection = 'EPSG:3857' } = options;

  const lines = payload
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith('#'));

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
