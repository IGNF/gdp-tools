import type { GeodesyPointReportContext } from './geodesyPointReportContext';
export declare function normalizeGeodesyPointReportAttributeName(name: string): string;
/** Index insensible à la casse de toutes les propriétés repère exploitables. */
export declare function buildGeodesyPointReportPrefillMap(context: GeodesyPointReportContext): Record<string, string>;
/**
 * Nom de champ thème EspaceCo correspondant à une clé canonique (alias, casse).
 * Ex. `etat` → `Etat du point` si le thème utilise ce libellé.
 */
export declare function matchGeodesyPointReportThemeAttributeName(candidate: string, themeAttributeNames: readonly string[]): string | undefined;
export declare function isGeodesyPointReportMandatoryAttributeName(name: string): boolean;
/** True si le repère cliqué possède un identifiant géodésique exploitable. */
export declare function isGeodesyPointReportExistingRepere(context: GeodesyPointReportContext): boolean;
/** Valeur préremplie pour un champ thème (comparaison insensible à la casse + alias). */
export declare function resolveGeodesyPointReportPrefillValue(context: GeodesyPointReportContext, attributeName: string, prefillMap?: Record<string, string>): string | undefined;
/**
 * Champs `id` / `domaine` : affichés et préremplis seulement si le repère en fournit une valeur.
 * Les autres champs thème restent visibles.
 */
export declare function shouldShowGeodesyPointReportThemeAttribute(context: GeodesyPointReportContext, attributeName: string, prefillMap?: Record<string, string>): boolean;
//# sourceMappingURL=geodesyPointReportPrefill.d.ts.map