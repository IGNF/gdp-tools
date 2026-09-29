import type Map from 'ol/Map';
import type { Pixel } from 'ol/pixel';
import type { GeodesyLayerId } from '../catalog/geodesyCatalog';
import type { GeodesyFeatureInfoHit } from '../wms/queryGeodesyAtCoordinate';
export interface QueryGeodesyAnnexAtPixelOptions {
    /** Tolérance en pixels autour du clic (défaut : 5). */
    hitTolerance?: number;
    /** Limite aux couches annexes visibles (défaut : `catalog.annexUiLayerIds`). */
    layerIds?: readonly GeodesyLayerId[];
}
/** Retourne l’entité annexe la plus proche du clic (couches visibles uniquement). */
export declare function queryGeodesyAnnexAtPixel(map: Map, pixel: Pixel, options?: QueryGeodesyAnnexAtPixelOptions): GeodesyFeatureInfoHit[];
//# sourceMappingURL=queryGeodesyAnnexAtPixel.d.ts.map