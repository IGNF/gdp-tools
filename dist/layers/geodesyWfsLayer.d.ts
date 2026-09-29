import Feature from 'ol/Feature';
import type Geometry from 'ol/geom/Geometry';
import VectorLayer from 'ol/layer/Vector';
import Cluster from 'ol/source/Cluster';
import VectorSource from 'ol/source/Vector';
import type { StyleLike } from 'ol/style/Style';
import { type GeodesyCatalog } from '../catalog/geodesyCatalog';
import { type GeodesyWfsLayerDefinition } from '../constants/wfs';
import { DEFAULT_GEODESY_WFS_POINT_STYLE } from '../style/geodesyWfsPictoStyle';
import { type GeodesyWfsClusterGeometryFilterOptions } from '../wfs/geodesyWfsClusterGeometry';
/** Résolution max. d’affichage / chargement WFS (commune cluster activé ou non). */
export declare function resolveGeodesyWfsMaxResolution(catalog: GeodesyCatalog): number;
export interface CreateGeodesyWfsLayerOptions {
    visible?: boolean;
    catalog?: GeodesyCatalog;
    /** Style fixe ou fonction ; prioritaire sur {@link GeodesyCatalog.wfsPictoUrlMaps}. */
    style?: StyleLike;
    /** Filtres actifs pour exclure les entités du clustering (mode domaine / attributs). */
    clusterGeometryFilter?: GeodesyWfsClusterGeometryFilterOptions;
}
export declare function createGeodesyWfsVectorSource(definition: GeodesyWfsLayerDefinition, catalog: GeodesyCatalog): VectorSource<Feature<Geometry>>;
export declare function createGeodesyWfsClusterSource(vectorSource: VectorSource<Feature<Geometry>>, catalog: GeodesyCatalog, clusterGeometryFilter?: GeodesyWfsClusterGeometryFilterOptions): Cluster<Feature<Geometry>>;
export interface CreateGeodesyWfsAnimatedVectorLayerOptions {
    catalog: GeodesyCatalog;
    visible: boolean;
    source: VectorSource<Feature<Geometry>>;
    style: StyleLike;
    zIndex: number;
    properties: Record<string, unknown>;
}
/** Couche vectorielle WFS avec AnimatedCluster si le catalogue l’active. */
export declare function createGeodesyWfsAnimatedVectorLayer(options: CreateGeodesyWfsAnimatedVectorLayerOptions): VectorLayer<VectorSource<Feature<Geometry>>>;
/** Couche WFS chargement uniquement (source brute, sans cluster ni style). */
export declare function createGeodesyWfsDataLayer(definition: GeodesyWfsLayerDefinition, options?: {
    catalog?: GeodesyCatalog;
    visible?: boolean;
}): VectorLayer<VectorSource<Feature<Geometry>>>;
/** Couche vectorielle WFS (GetFeature GeoJSON, chargement par emprise). */
export declare function createGeodesyWfsLayer(definition: GeodesyWfsLayerDefinition, options?: CreateGeodesyWfsLayerOptions): VectorLayer<VectorSource<Feature<Geometry>>>;
export { DEFAULT_GEODESY_WFS_POINT_STYLE };
//# sourceMappingURL=geodesyWfsLayer.d.ts.map