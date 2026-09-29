/** Thème collaboratif pour un signalement sur point géodésique existant. */
export declare const GEODESY_POINT_REPORT_THEME = "gdp-tools";
/** Rôle logique d’une photo utilisateur pour le signalement géodésie. */
export type GeodesyPointReportPhotoRole = 'photo1' | 'photo2';
export interface GeodesyPointReportPhotoSlot {
    role: GeodesyPointReportPhotoRole;
    /** Clé attendue par `report.addAttachments` (`photo0`, `photo1`, …). */
    attachmentKey: string;
    label: string;
    mandatory: boolean;
}
/** Schéma des pièces jointes photo pour le signalement sur point géodésique. */
export declare const GEODESY_POINT_REPORT_PHOTO_SLOTS: readonly GeodesyPointReportPhotoSlot[];
/**
 * Attributs thème préremplis depuis les propriétés du repère.
 * Liste de repli historique (pof-mobile) — ne pas réduire, les apps passent un thème EspaceCo.
 */
export declare const GEODESY_POINT_REPORT_THEME_ATTRIBUTE_KEYS: readonly ["id", "domaine", "nom", "no", "type", "etat", "commune"];
/**
 * Contrat GDP (thème EspaceCo `gdp-tools`) : photo + ces champs, sans dump de fiche / sketch.
 * La liste effective reste celle du thème communauté si elle est fournie par l’app.
 */
export declare const GDP_POINT_REPORT_THEME_ATTRIBUTE_KEYS: readonly ["id", "domaine", "etat", "gps", "move"];
/** Toujours transmis au signalement, même absents de la fiche ou du thème collaboratif. */
export declare const GEODESY_POINT_REPORT_MANDATORY_ATTRIBUTE_KEYS: readonly ["id", "domaine"];
//# sourceMappingURL=geodesyPointReportConstants.d.ts.map