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

export const DEFAULT_GEODESY_WFS_CLUSTER: GeodesyWfsClusterConfig = {
  enabled: true,
  distance: 40,
  minDistance: 0,
  animationDuration: 700,
  animateExplosion: true,
  explosionAnimationDuration: 500,
  pointRadius: 12,
  maxResolution: 80, // par défaut 80 dans gdp-tools, 1800 pratiquement, france entiere
};

export function resolveGeodesyWfsClusterConfig(
  options?: GeodesyWfsClusterOptions,
): GeodesyWfsClusterConfig {
  const animationDuration =
    options?.animationDuration ?? DEFAULT_GEODESY_WFS_CLUSTER.animationDuration;

  const explosionAnimationDuration =
    options?.explosionAnimationDuration ??
    DEFAULT_GEODESY_WFS_CLUSTER.explosionAnimationDuration;

  return {
    enabled: options?.enabled ?? DEFAULT_GEODESY_WFS_CLUSTER.enabled,
    distance: options?.distance ?? DEFAULT_GEODESY_WFS_CLUSTER.distance,
    minDistance: options?.minDistance ?? DEFAULT_GEODESY_WFS_CLUSTER.minDistance,
    animationDuration,
    animateExplosion:
      options?.animateExplosion ?? DEFAULT_GEODESY_WFS_CLUSTER.animateExplosion,
    explosionAnimationDuration,
    pointRadius: options?.pointRadius ?? DEFAULT_GEODESY_WFS_CLUSTER.pointRadius,
    maxResolution: options?.maxResolution ?? DEFAULT_GEODESY_WFS_CLUSTER.maxResolution,
  };
}
