import type { GeodesyPointReportContext } from './geodesyPointReportContext';
/** Domaines WFS pour lesquels la position peut être ajustée lors d’un signalement. */
export declare const GEODESY_POINT_REPORT_POSITION_EDITABLE_DOMAINES: readonly ["nivf", "nivo", "nive"];
/** Domaines WFS de canevas (2e ordre / densification), non signalables. */
export declare const GEODESY_POINT_REPORT_BLOCKED_DOMAINES: readonly ["rsge", "nive"];
export declare function extractGeodesyPointReportDomaine(context: Pick<GeodesyPointReportContext, 'properties'>): string | undefined;
/** True si le signalement sur ce repère autorise le déplacement de la position. */
export declare function isGeodesyPointReportPositionEditable(context: Pick<GeodesyPointReportContext, 'properties'>): boolean;
/** True si le signalement est autorisé sur ce repère (faux pour les points de canevas). */
export declare function isGeodesyPointReportAllowed(context: Pick<GeodesyPointReportContext, 'properties'>): boolean;
/** Contexte signalement avec une position ajustée par l’utilisateur. */
export declare function withGeodesyPointReportPosition(context: GeodesyPointReportContext, position: {
    longitude: number;
    latitude: number;
}): GeodesyPointReportContext;
//# sourceMappingURL=geodesyPointReportPosition.d.ts.map