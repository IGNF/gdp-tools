import type { GeodesyPointReportContext } from './geodesyPointReportContext';
export interface MapGeodesyPointReportToApiBodyOptions {
    communityId: number;
    comment: string;
    /** Identifiant thème tel que configuré dans EspaceCo (prioritaire sur la constante package). */
    theme?: string;
    /** Fusionnés avec les attributs dérivés du repère. */
    themeAttributes?: Record<string, string>;
    /**
     * Clés de repli si `themeAttributes` est omis.
     * Sans effet sur pof-mobile, qui fournit déjà `themeAttributes`.
     */
    attributeKeys?: readonly string[];
    /** Statut collaboratif (défaut : `submit`, attendu par l’API EspaceCo). */
    status?: string;
}
/**
 * Corps de requête `report.add()` pour un signalement sur point géodésique.
 * Pas de `sketch` : seuls géométrie, commentaire, thème et pièces jointes sont transmis.
 */
export declare function mapGeodesyPointReportToApiBody(context: GeodesyPointReportContext, options: MapGeodesyPointReportToApiBodyOptions): Record<string, unknown>;
//# sourceMappingURL=mapGeodesyPointReportToApiBody.d.ts.map