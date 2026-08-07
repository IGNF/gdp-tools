import type { GeodesyFeatureInfoHit } from '../wms/queryGeodesyAtCoordinate';
import { prefetchGeodesyImage, resolveGeodesyImageDisplayUrl } from '../cache/geodesyImageCache';

const PARTNER_LOGO_BASE_URL = 'https://data.geopf.fr/annexes/geodesie/gdp/logos';

/**
 * Construit l'URL du logo d'un partenaire à partir de son ID.
 * @param partnerId Identifiant du partenaire (proprio_id)
 * @returns URL du logo ou null si l'ID est invalide
 */
export function buildPartnerLogoUrl(partnerId: string | null | undefined): string | null {
  if (!partnerId || partnerId.trim() === '') {
    return null;
  }

  return `${PARTNER_LOGO_BASE_URL}/logo_${partnerId.trim()}.jpg`;
}

/**
 * Résout l'URL d'affichage d'un logo partenaire (blob locale si en cache, sinon URL distante).
 * @param logoUrl URL du logo à résoudre
 * @returns URL d'affichage (blob:// ou URL originale)
 */
export function resolvePartnerLogoDisplayUrl(logoUrl: string): string {
  return resolveGeodesyImageDisplayUrl(logoUrl);
}

/**
 * Précharge un logo partenaire dans le cache.
 * @param logoUrl URL du logo à précharger
 * @returns Promise qui se résout avec l'URL d'affichage (blob://)
 */
export async function prefetchPartnerLogo(logoUrl: string): Promise<string> {
  return prefetchGeodesyImage(logoUrl);
}

/**
 * Précharge plusieurs logos partenaires dans le cache.
 * @param logoUrls URLs des logos à précharger
 */
export async function prefetchPartnerLogos(logoUrls: readonly string[]): Promise<void> {
  await Promise.all(logoUrls.map((url) => prefetchPartnerLogo(url)));
}

/**
 * Précharge le logo d'un partenaire à partir de son ID.
 * @param partnerId Identifiant du partenaire
 * @returns Promise qui se résout avec l'URL d'affichage ou null si l'ID est invalide
 */
export async function prefetchPartnerLogoById(
  partnerId: string | null | undefined,
): Promise<string | null> {
  const logoUrl = buildPartnerLogoUrl(partnerId);
  if (!logoUrl) {
    return null;
  }

  return prefetchPartnerLogo(logoUrl);
}

/**
 * Collecte les IDs des partenaires depuis les propriétés d'une feature.
 * @param properties Propriétés de la feature
 * @returns ID du partenaire ou null
 */
export function collectPartnerIdFromProperties(properties: Record<string, unknown>): string | null {
  const partnerId = properties['proprio_id'];
  if (typeof partnerId === 'string' && partnerId.trim() !== '') {
    return partnerId.trim();
  }
  return null;
}

/**
 * Collecte les IDs uniques des partenaires depuis un ensemble de hits.
 * @param hits Hits géodésie à analyser
 * @returns Tableau des IDs de partenaires uniques
 */
export function collectPartnerIdsFromHits(hits: GeodesyFeatureInfoHit[]): string[] {
  const partnerIds = new Set<string>();

  for (const hit of hits) {
    const partnerId = collectPartnerIdFromProperties(hit.feature.getProperties());
    if (partnerId) {
      partnerIds.add(partnerId);
    }
  }

  return Array.from(partnerIds);
}

/**
 * Précharge les logos de tous les partenaires présents dans un ensemble de hits.
 * @param hits Hits géodésie contenant potentiellement des partenaires
 */
export async function prefetchPartnerLogosFromHits(hits: GeodesyFeatureInfoHit[]): Promise<void> {
  const partnerIds = collectPartnerIdsFromHits(hits);
  const logoUrls = partnerIds
    .map((id) => buildPartnerLogoUrl(id))
    .filter((url): url is string => url !== null);

  await prefetchPartnerLogos(logoUrls);
}
