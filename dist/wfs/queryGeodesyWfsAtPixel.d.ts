import Feature from 'ol/Feature';
import type Geometry from 'ol/geom/Geometry';
import type Map from 'ol/Map';
import type { Pixel } from 'ol/pixel';
import type { GeodesyLayerId } from '../catalog/geodesyCatalog';
import type { GeodesyFeatureInfoHit } from '../wms/queryGeodesyAtCoordinate';
export interface QueryGeodesyWfsAtPixelOptions {
    /** Tolérance en pixels autour du clic (défaut : 5). */
    hitTolerance?: number;
    /** Limite aux couches WFS visibles (défaut : `catalog.wfsUiLayerIds`). */
    layerIds?: readonly GeodesyLayerId[];
}
/** Construit un hit WFS à partir d’une feature éclatée (SelectCluster). */
export declare function buildGeodesyWfsHitFromExplodedClusterFeature(map: Map, clusterFeature: Feature<Geometry>, coordinate: number[], options?: QueryGeodesyWfsAtPixelOptions): GeodesyFeatureInfoHit | null;
/** Indique qu’un cluster WFS multi-points a été cliqué (éclatement SelectCluster attendu). */
export declare function hasGeodesyWfsMultiClusterAtPixel(map: Map, pixel: Pixel, options?: QueryGeodesyWfsAtPixelOptions): boolean;
/**
 * Retourne l’entité WFS géodésie la plus proche du clic (couches visibles uniquement).
 * Les attributs proviennent directement de la feature GeoJSON chargée.
 */
export declare function queryGeodesyWfsAtPixel(map: Map, pixel: Pixel, options?: QueryGeodesyWfsAtPixelOptions): GeodesyFeatureInfoHit[];
//# sourceMappingURL=queryGeodesyWfsAtPixel.d.ts.map