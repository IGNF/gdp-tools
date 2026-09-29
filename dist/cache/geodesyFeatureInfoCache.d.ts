/** Réponse GetFeatureInfo déjà récupérée (clé = URL WMS complète). */
export declare function getCachedFeatureInfoPayload(url: string): string | undefined;
export declare function setCachedFeatureInfoPayload(url: string, payload: string): void;
export declare function clearGeodesyFeatureInfoCache(): void;
export declare function getGeodesyFeatureInfoCacheStats(): {
    entryCount: number;
    sizeBytes: number;
};
//# sourceMappingURL=geodesyFeatureInfoCache.d.ts.map