import type { Coordinate } from 'ol/coordinate';
import type Map from 'ol/Map';
import type { Pixel } from 'ol/pixel';
import type { GeodesyFeatureInfoHit } from '../wms/queryGeodesyAtCoordinate';
import { type QueryGeodesyAtCoordinateOptions } from '../wms/queryGeodesyAtCoordinate';
import { type QueryGeodesyAnnexAtPixelOptions } from '../annex/queryGeodesyAnnexAtPixel';
import { type QueryGeodesyWfsAtPixelOptions } from '../wfs/queryGeodesyWfsAtPixel';
export interface QueryGeodesyAtClickOptions {
    wfs?: QueryGeodesyWfsAtPixelOptions;
    annex?: QueryGeodesyAnnexAtPixelOptions;
    wms?: QueryGeodesyAtCoordinateOptions;
    /** Interroger d’abord les entités vectorielles WFS / annexes (défaut : true). */
    preferWfs?: boolean;
}
/**
 * Interroge la géodésie au clic : entité WFS sous le pixel, puis GetFeatureInfo WMS.
 */
export declare function queryGeodesyAtClick(map: Map, coordinate: Coordinate, pixel: Pixel, options?: QueryGeodesyAtClickOptions): Promise<GeodesyFeatureInfoHit[]>;
//# sourceMappingURL=queryGeodesyAtClick.d.ts.map