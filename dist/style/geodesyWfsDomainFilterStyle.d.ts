import type { StyleFunction, StyleLike } from 'ol/style/Style';
/** Style WFS masquant les entités hors codes `domaine` (point ou cluster). */
export declare function createGeodesyWfsDomainFilterStyleFunction(pointStyle: StyleLike, domaines: readonly string[], options?: {
    cluster?: boolean;
}): StyleFunction;
//# sourceMappingURL=geodesyWfsDomainFilterStyle.d.ts.map