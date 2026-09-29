import Feature from 'ol/Feature';
import type Geometry from 'ol/geom/Geometry';
import type Map from 'ol/Map';
import type { Coordinate } from 'ol/coordinate';
import { type GeodesyWmsLayerId } from '../constants/wms';
import type { GeodesyLayerId } from '../catalog/geodesyCatalog';
export interface GeodesyFeatureInfoHit {
    layerTitle: string;
    layerId?: GeodesyLayerId;
    feature: Feature<Geometry>;
}
export interface QueryGeodesyAtCoordinateOptions {
    /**
     * Couches interrogées au clic pour les attributs (GEODESIE_DATA).
     * Les couches réseau RBF/RDF/RN ne sont pas interrogées : leurs attributs y sont déjà inclus.
     * @default ['TOUT']
     */
    dataLayerIds?: readonly GeodesyWmsLayerId[];
    /**
     * Limite les hits aux types de réseau des couches cartographiques visibles.
     * Se base sur `groupe_type` dans GEODESIE_DATA.
     * @default true
     */
    filterByVisibleNetworkLayers?: boolean;
    /**
     * @deprecated Utiliser {@link QueryGeodesyAtCoordinateOptions.dataLayerIds}.
     */
    enrichmentLayerIds?: readonly GeodesyWmsLayerId[];
}
/**
 * Interroge GEODESIE_DATA au clic (couche TOUT, même masquée).
 * Les couches réseau RBF/RDF/RN ne sont pas interrogées : leurs attributs y sont déjà inclus.
 */
export declare function queryGeodesyAtCoordinate(map: Map, coordinate: Coordinate, options?: QueryGeodesyAtCoordinateOptions): Promise<GeodesyFeatureInfoHit[]>;
//# sourceMappingURL=queryGeodesyAtCoordinate.d.ts.map