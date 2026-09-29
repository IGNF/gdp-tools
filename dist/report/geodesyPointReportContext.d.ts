import type { Coordinate } from 'ol/coordinate';
import type { GeodesyLayerId } from '../catalog/geodesyCatalog';
import type { GeodesyFeatureInfoHit } from '../wms/queryGeodesyAtCoordinate';
import { type BuildGeodesyPointDisplayOptions, type GeodesyPointDisplay } from './geodesyPointDisplay';
import type { GeodesyPointPhoto } from './geodesyPointPhotos';
export interface GeodesyPointReportContext extends GeodesyPointDisplay {
    layerId?: GeodesyLayerId;
    properties: Record<string, unknown>;
    geodesyId?: string;
}
export interface BuildGeodesyPointReportContextOptions extends BuildGeodesyPointDisplayOptions {
}
/** Contexte signalement sur point géodésique (sérialisable, sans feature OL). */
export declare function buildGeodesyPointReportContext(hit: GeodesyFeatureInfoHit, fallbackCoordinate: Coordinate, options?: BuildGeodesyPointReportContextOptions): GeodesyPointReportContext;
export type { GeodesyPointPhoto };
//# sourceMappingURL=geodesyPointReportContext.d.ts.map