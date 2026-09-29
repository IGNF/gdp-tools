import type Feature from 'ol/Feature';
import AnimatedCluster from 'ol-ext/layer/AnimatedCluster';
/**
 * AnimatedCluster ol-ext avec appariement par {@link Feature#getId}.
 * Nécessaire pour le WFS bbox (nouvelles instances de features à chaque requête).
 *
 * Pour le reste, même usage que l’exemple ol-ext :
 * {@link https://viglino.github.io/ol-ext/examples/animation/map.animatedcluster.html}
 */
export declare class GeodesyAnimatedCluster extends AnimatedCluster {
    getClusterForFeature(feature: Feature, clusters: Feature[]): Feature | false;
}
//# sourceMappingURL=geodesyAnimatedClusterLayer.d.ts.map