import Feature from 'ol/Feature';
import type Geometry from 'ol/geom/Geometry';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import type { StyleLike } from 'ol/style/Style';
import { type GeodesyCatalog } from '../catalog/geodesyCatalog';
import type { GeodesyAnnexLayerDefinition } from '../constants/annex';
export interface CreateGeodesyAnnexLayerOptions {
    visible?: boolean;
    catalog?: GeodesyCatalog;
    style?: StyleLike;
}
/** Couche vectorielle issue d’un flux texte annexe Géoplateforme. */
export declare function createGeodesyAnnexLayer(definition: GeodesyAnnexLayerDefinition, options?: CreateGeodesyAnnexLayerOptions): VectorLayer<VectorSource<Feature<Geometry>>>;
//# sourceMappingURL=geodesyAnnexLayer.d.ts.map