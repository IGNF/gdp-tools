import type Feature from 'ol/Feature';
import type Geometry from 'ol/geom/Geometry';
import type BaseLayer from 'ol/layer/Base';
import VectorLayer from 'ol/layer/Vector';
import type { GeodesyLayerId } from '../catalog/geodesyCatalog';
export declare function isGeodesyWfsVectorLayer(layer: BaseLayer, allowedLayerIds: ReadonlySet<GeodesyLayerId>): layer is VectorLayer;
export declare function dedupeGeodesyWfsClusterMembers(members: readonly Feature<Geometry>[]): Feature<Geometry>[];
export declare function getGeodesyWfsClusterMembers(feature: Feature<Geometry>): Feature<Geometry>[];
export declare function getGeodesyWfsClusterMemberCount(feature: Feature<Geometry>): number;
export declare function isGeodesyWfsMultiClusterFeature(feature: Feature<Geometry>): boolean;
export declare function isGeodesyWfsExplodedClusterFeature(feature: Feature<Geometry>): boolean;
//# sourceMappingURL=geodesyWfsLayerUtils.d.ts.map