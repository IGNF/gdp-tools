import type { GeodesyPointReportContext } from './geodesyPointReportContext';
export interface GeodesyPointReportAutofilledAttribute {
    name: string;
    default?: string;
    values?: readonly string[];
}
export interface GeodesyPointReportThemeAttributeDef {
    name: string;
    default?: string;
    values?: readonly string[];
}
export interface SelectGeodesyPointReportThemeAttributesOptions {
    /**
     * Clés de repli si `themeAttributeNames` est vide.
     * Défaut : {@link GEODESY_POINT_REPORT_THEME_ATTRIBUTE_KEYS} (compat pof-mobile).
     */
    keys?: readonly string[];
    /** Noms exacts du thème EspaceCo — source de vérité, la liste peut évoluer. */
    themeAttributeNames?: readonly string[];
    /** Saisie app (prioritaire sur le préremplissage WFS). */
    formAttributes?: Record<string, string>;
    /** Champs auto du thème (valeurs WFS ou `default`). */
    autofilledAttributes?: readonly GeodesyPointReportAutofilledAttribute[];
    /** Définitions thème (listes `values`) pour aligner les valeurs envoyées. */
    themeAttributeDefs?: readonly GeodesyPointReportThemeAttributeDef[];
}
/** Attributs identifiants toujours requis pour le signalement (`id`, `domaine`). */
export declare function buildGeodesyPointReportMandatoryThemeAttributes(context: GeodesyPointReportContext): Record<string, string>;
/**
 * Construit les attributs thème à envoyer (whitelist thème ou clés de repli).
 * N’ajoute jamais le dump de fiche WFS ni de sketch.
 */
export declare function selectGeodesyPointReportThemeAttributes(context: GeodesyPointReportContext, options?: SelectGeodesyPointReportThemeAttributesOptions): Record<string, string>;
/**
 * Attributs thème collaboratif préremplis depuis le point géodésique.
 * Sans options : comportement historique (pof-mobile).
 */
export declare function buildGeodesyPointReportThemeAttributes(context: GeodesyPointReportContext, options?: SelectGeodesyPointReportThemeAttributesOptions): Record<string, string>;
/** Attributs thème GDP (`id`, `domaine`, `etat`, `gps`, `move`) + champs du thème EspaceCo. */
export declare function buildGdpPointReportThemeAttributes(context: GeodesyPointReportContext, options?: Omit<SelectGeodesyPointReportThemeAttributesOptions, 'keys'>): Record<string, string>;
/** Fusionne les attributs thème en garantissant `id` et `domaine`. */
export declare function mergeGeodesyPointReportMandatoryThemeAttributes(context: GeodesyPointReportContext, themeAttributes: Record<string, string>): Record<string, string>;
//# sourceMappingURL=buildGeodesyPointReportThemeAttributes.d.ts.map