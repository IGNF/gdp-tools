import Feature from 'ol/Feature';
import type Geometry from 'ol/geom/Geometry';
import SelectCluster, { type Options as SelectClusterOptions } from 'ol-ext/interaction/SelectCluster';
import type { Coordinate } from 'ol/coordinate';
export interface GeodesySelectClusterOptions extends SelectClusterOptions {
    /** Durée d’éclatement au clic (ms) — indépendante du zoom AnimatedCluster. */
    explosionAnimationDuration?: number;
}
/**
 * SelectCluster corrigé pour OpenLayers 10 :
 * - durée d’éclatement explicite ({@link explosionAnimationDuration}) ;
 * - ol-ext itère `style.length` — si le style est un objet Style, l’animation ne dessine rien.
 */
export declare class GeodesySelectCluster extends SelectCluster {
    private readonly explosionDurationMs;
    constructor(options?: GeodesySelectClusterOptions);
    animateCluster_(center: Coordinate, features: Feature<Geometry>[]): void;
}
//# sourceMappingURL=geodesySelectCluster.d.ts.map