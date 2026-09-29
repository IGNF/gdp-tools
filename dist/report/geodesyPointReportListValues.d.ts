/**
 * Valeurs liste EspaceCo `gps` du thème `gdp-tools` (communauté 96).
 * Repli si le thème n’a pas encore été chargé.
 */
export declare const GDP_THEME_GPS_VALUES: readonly ["NON RENSEIGNE", "EXPLOITABLE DIRECTEMENT PAR GPS", "INEXPLOITABLE PAR GPS", "AUCUNE INFORMATION", "EXPLOITABLE PAR GPS DEPUIS UNE STATION EXCENTREE"];
export declare function normalizeGeodesyPointReportComparableValue(value: string): string;
/** Retourne l’option liste EspaceCo correspondant à `value`, ou `undefined`. */
export declare function matchGeodesyPointReportListValue(value: string, allowedValues: readonly string[]): string | undefined;
export declare function isGdpThemeGpsAttributeName(name: string): boolean;
export declare function isGdpThemeEtatAttributeName(name: string): boolean;
export declare function isGdpThemeMoveAttributeName(name: string): boolean;
/**
 * Aligne une valeur WFS / formulaire sur une option de liste EspaceCo.
 * `gps` : codes `E|R|I|N` et libellés RN → valeurs du thème `gdp-tools`.
 */
export declare function coerceGeodesyPointReportListValue(attributeName: string, rawValue: string, allowedValues?: readonly string[]): string | undefined;
//# sourceMappingURL=geodesyPointReportListValues.d.ts.map