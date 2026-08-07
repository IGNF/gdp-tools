import { normalizeGeodesyPictoCode } from '../style/geodesyWfsPictoStyle';

export const GEODESY_NETWORK_FILTER_CATEGORIES = [
  'RBF',
  'RDF',
  'TRIPLET',
  'NON_TRIPLET',
] as const;

export type GeodesyNetworkFilterCategory = (typeof GEODESY_NETWORK_FILTER_CATEGORIES)[number];

/** Préfixes `picto` pour les repères de nivellement en triplet. */
const TRIPLET_PICTO_PREFIXES = ['PT_RN_TRIPLET', 'PT_RN_CANEX_TRIPLET'] as const;

function readPropertyCaseInsensitive(
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

function readPicto(properties: Record<string, unknown>): string | undefined {
  const raw =
    readPropertyCaseInsensitive(properties, 'picto') ??
    readPropertyCaseInsensitive(properties, 'PICTO');

  return normalizeGeodesyPictoCode(raw);
}

function isTripletPicto(picto: string): boolean {
  return TRIPLET_PICTO_PREFIXES.some((prefix) => picto.startsWith(prefix));
}

/** Repère de nivellement appartenant à un triplet (`picto` type PT_RN_TRIPLET*). */
export function isGeodesyTripletPoint(properties: Record<string, unknown>): boolean {
  const picto = readPicto(properties);
  return picto !== undefined && isTripletPicto(picto);
}

/** Catégories réseau / triplet d'un repère pour le filtre expert (basées sur `picto`). */
export function resolveGeodesyNetworkFilterCategories(
  properties: Record<string, unknown>,
): GeodesyNetworkFilterCategory[] {
  const picto = readPicto(properties);
  if (!picto) {
    return [];
  }

  const categories: GeodesyNetworkFilterCategory[] = [];

  if (picto.startsWith('PT_RBF')) {
    categories.push('RBF');
  }

  if (picto.startsWith('PT_RDF')) {
    categories.push('RDF');
  }

  if (isTripletPicto(picto)) {
    categories.push('TRIPLET');
  } else if (picto.startsWith('PT_RN')) {
    categories.push('NON_TRIPLET');
  }

  return categories;
}
