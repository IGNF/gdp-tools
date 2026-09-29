import { type StyleFunction, type StyleLike } from 'ol/style/Style';
/** Style d’un cluster WFS (cercle rayonné + effectif, aligné sur l’ancien Géodésie de poche). */
export interface GeodesyWfsClusterStyleOptions {
    /** Couleur fixe (prioritaire sur les seuils). */
    fillColor?: string;
    /** Couleur des petits clusters — effectif ≤ mediumClusterThreshold (défaut : vert). */
    smallClusterColor?: string;
    /** Couleur des clusters moyens (défaut : orange). */
    mediumClusterColor?: string;
    /** Couleur des grands clusters (défaut : rouge). */
    largeClusterColor?: string;
    /** Seuil orange strictement supérieur (défaut : 8). */
    mediumClusterThreshold?: number;
    /** Seuil rouge strictement supérieur (défaut : 25). */
    largeClusterThreshold?: number;
    strokeColor?: string;
    textColor?: string;
    /** Rayon minimal du disque (défaut : 8). */
    minRadius?: number;
    /** Rayon maximal du disque (défaut : 20). */
    maxRadius?: number;
    /** Facteur de taille selon l’effectif (défaut : 0,75). */
    radiusScale?: number;
}
/**
 * Style combiné : picto pour un point seul, cluster rayonné pour un amas.
 * Taille et couleurs alignées sur l’ancien Géodésie de poche (`vieux-gdp/src/js/map/style2.js`).
 */
export declare function createGeodesyWfsClusterStyleFunction(pointStyle: StyleFunction, clusterStyleOptions?: GeodesyWfsClusterStyleOptions): StyleFunction;
/** Fusionne un style point et une fonction cluster en StyleLike unique. */
export declare function wrapGeodesyWfsStyleForCluster(pointStyle: StyleLike, clusterStyleOptions?: GeodesyWfsClusterStyleOptions): StyleFunction;
//# sourceMappingURL=geodesyWfsClusterStyle.d.ts.map