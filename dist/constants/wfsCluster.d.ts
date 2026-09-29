/** Options de regroupement des entités WFS (ol/source/Cluster + ol-ext AnimatedCluster). */
export interface GeodesyWfsClusterOptions {
    /**
     * Active le clustering animé des flux WFS.
     * @default true
     */
    enabled?: boolean;
    /** Distance en pixels pour fusionner les points (défaut : 40). */
    distance?: number;
    /** Distance minimale entre deux clusters (défaut : 0). */
    minDistance?: number;
    /**
     * Durée de l’animation au zoom / dézoom (couche {@link GeodesyAnimatedCluster}), en ms.
     * @default 900 — `0` désactive l’animation de zoom.
     */
    animationDuration?: number;
    /** Anime l’éclatement au clic sur un cluster (défaut : true). */
    animateExplosion?: boolean;
    /**
     * Durée de l’éclatement au clic (interaction SelectCluster), en ms.
     * @default 500 — indépendant de {@link animationDuration}.
     */
    explosionAnimationDuration?: number;
    /** Rayon de dispersion des points éclatés, en unités pixel carte (défaut : 12). */
    pointRadius?: number;
    /**
     * Résolution cartographique max. des couches WFS (masquées et non chargées au-delà).
     * S’applique avec ou sans cluster. Aligné sur Géodésie de poche ({@link GdpLayer} : 80).
     * @default 80
     */
    maxResolution?: number;
}
/** Configuration résolue du clustering WFS. */
export interface GeodesyWfsClusterConfig {
    enabled: boolean;
    distance: number;
    minDistance: number;
    animationDuration: number;
    animateExplosion: boolean;
    explosionAnimationDuration: number;
    pointRadius: number;
    maxResolution: number;
}
export declare const DEFAULT_GEODESY_WFS_CLUSTER: GeodesyWfsClusterConfig;
export declare function resolveGeodesyWfsClusterConfig(options?: GeodesyWfsClusterOptions): GeodesyWfsClusterConfig;
//# sourceMappingURL=wfsCluster.d.ts.map