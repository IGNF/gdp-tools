/** Valeur par défaut du paramètre `source` sur les liens externes IGN. */
export declare const DEFAULT_GEODESY_EXTERNAL_URL_SOURCE = "gdp-tools";
export declare function resolveGeodesyExternalUrlSource(source?: string): string;
/** Ajoute `source=…` à une URL externe (sans écraser les paramètres existants). */
export declare function appendGeodesySourceParam(url: string, source?: string): string;
/** Fabrique un transformateur d’URL externe pour une application cliente. */
export declare function createGeodesyExternalUrlTransform(source?: string): (url: string) => string;
//# sourceMappingURL=geodesyExternalUrl.d.ts.map