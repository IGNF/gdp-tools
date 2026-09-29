import type { GeodesyFeatureInfoHit } from '../wms/queryGeodesyAtCoordinate';
/**
 * Construit l'URL du logo d'un partenaire à partir de son ID.
 * @param partnerId Identifiant du partenaire (proprio_id)
 * @returns URL du logo ou null si l'ID est invalide
 */
export declare function buildPartnerLogoUrl(partnerId: string | null | undefined): string | null;
/**
 * Résout l'URL d'affichage d'un logo partenaire (blob locale si en cache, sinon URL distante).
 * @param logoUrl URL du logo à résoudre
 * @returns URL d'affichage (blob:// ou URL originale)
 */
export declare function resolvePartnerLogoDisplayUrl(logoUrl: string): string;
/**
 * Précharge un logo partenaire dans le cache.
 * @param logoUrl URL du logo à précharger
 * @returns Promise qui se résout avec l'URL d'affichage (blob://)
 */
export declare function prefetchPartnerLogo(logoUrl: string): Promise<string>;
/**
 * Précharge plusieurs logos partenaires dans le cache.
 * @param logoUrls URLs des logos à précharger
 */
export declare function prefetchPartnerLogos(logoUrls: readonly string[]): Promise<void>;
/**
 * Précharge le logo d'un partenaire à partir de son ID.
 * @param partnerId Identifiant du partenaire
 * @returns Promise qui se résout avec l'URL d'affichage ou null si l'ID est invalide
 */
export declare function prefetchPartnerLogoById(partnerId: string | null | undefined): Promise<string | null>;
/**
 * Collecte les IDs des partenaires depuis les propriétés d'une feature.
 * @param properties Propriétés de la feature
 * @returns ID du partenaire ou null
 */
export declare function collectPartnerIdFromProperties(properties: Record<string, unknown>): string | null;
/**
 * Collecte les IDs uniques des partenaires depuis un ensemble de hits.
 * @param hits Hits géodésie à analyser
 * @returns Tableau des IDs de partenaires uniques
 */
export declare function collectPartnerIdsFromHits(hits: GeodesyFeatureInfoHit[]): string[];
/**
 * Précharge les logos de tous les partenaires présents dans un ensemble de hits.
 * @param hits Hits géodésie contenant potentiellement des partenaires
 */
export declare function prefetchPartnerLogosFromHits(hits: GeodesyFeatureInfoHit[]): Promise<void>;
//# sourceMappingURL=partnerLogo.d.ts.map