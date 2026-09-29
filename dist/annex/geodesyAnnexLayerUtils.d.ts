import type Feature from 'ol/Feature';
import type Geometry from 'ol/geom/Geometry';
import type BaseLayer from 'ol/layer/Base';
import VectorLayer from 'ol/layer/Vector';
import type { GeodesyLayerId } from '../catalog/geodesyCatalog';
export declare function isGeodesyAnnexVectorLayer(layer: BaseLayer, allowedLayerIds: ReadonlySet<GeodesyLayerId>): layer is VectorLayer;
export declare function resolveGeodesyAnnexHitFeature(feature: Feature<Geometry>): Feature<Geometry>;
//# sourceMappingURL=geodesyAnnexLayerUtils.d.ts.map