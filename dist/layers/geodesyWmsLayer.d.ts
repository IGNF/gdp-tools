import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';
import { type GeodesyCatalog } from '../catalog/geodesyCatalog';
import { type GeodesyWmsLayerDefinition } from '../constants/wms';
export interface CreateGeodesyWmsLayerOptions {
    visible?: boolean;
    zIndexOffset?: number;
    catalog?: GeodesyCatalog;
}
/** Couche WMS pour un flux géodésie Géoplateforme. */
export declare function createGeodesyWmsLayer(definition: GeodesyWmsLayerDefinition, options?: CreateGeodesyWmsLayerOptions): TileLayer<TileWMS>;
//# sourceMappingURL=geodesyWmsLayer.d.ts.map