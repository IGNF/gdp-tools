export declare const GEODESY_NETWORK_FILTER_CATEGORIES: readonly ["RBF", "RDF", "TRIPLET", "NON_TRIPLET"];
export type GeodesyNetworkFilterCategory = (typeof GEODESY_NETWORK_FILTER_CATEGORIES)[number];
/** Repère de nivellement appartenant à un triplet (`picto` type PT_RN_TRIPLET*). */
export declare function isGeodesyTripletPoint(properties: Record<string, unknown>): boolean;
/** Catégories réseau / triplet d'un repère pour le filtre expert (basées sur `picto`). */
export declare function resolveGeodesyNetworkFilterCategories(properties: Record<string, unknown>): GeodesyNetworkFilterCategory[];
//# sourceMappingURL=geodesyNetworkFilterCategories.d.ts.map