import type { Coordinate } from 'ol/coordinate';
import Feature from 'ol/Feature';
import type Geometry from 'ol/geom/Geometry';
/**
 * Résout la feature WFS « métier » lors d’un clic sur un cluster ol/source/Cluster.
 * Si plusieurs points sont regroupés, retourne le plus proche du clic.
 */
export declare function resolveGeodesyWfsHitFeature(feature: Feature<Geometry>, coordinate?: Coordinate): Feature<Geometry>;
//# sourceMappingURL=resolveGeodesyWfsHitFeature.d.ts.map