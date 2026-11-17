import type { Extent } from 'ol/extent';
import type Map from 'ol/Map';
import type { GeodesyLayerId } from '../catalog/geodesyCatalog';
import type { GeodesyFeatureInfoHit } from '../wms/queryGeodesyAtCoordinate';
export interface CollectGeodesyWfsHitsInMapExtentOptions {
    layerIds?: readonly GeodesyLayerId[];
}
/** Repères WFS visibles intersectant une emprise carte (déplie les clusters). */
export declare function collectGeodesyWfsHitsInMapExtent(map: Map, extent: Extent, options?: CollectGeodesyWfsHitsInMapExtentOptions): GeodesyFeatureInfoHit[];
//# sourceMappingURL=collectGeodesyWfsHitsInMapExtent.d.ts.map