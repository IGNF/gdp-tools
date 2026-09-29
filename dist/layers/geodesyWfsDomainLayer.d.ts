import type VectorSource from 'ol/source/Vector';
import type Feature from 'ol/Feature';
import type Geometry from 'ol/geom/Geometry';
import VectorLayer from 'ol/layer/Vector';
import type { StyleLike } from 'ol/style/Style';
import type { GeodesyCatalog } from '../catalog/geodesyCatalog';
import type { GeodesyWfsAttributeFilterValuesHolder } from '../constants/wfsAttributeFilters';
import { type GeodesyWfsLayerId } from '../constants/wfs';
import { type GeodesyWfsDomainLayerDefinition } from '../constants/wfsDomainLayers';
export declare function createGeodesyWfsDomainDisplayLayer(definition: GeodesyWfsDomainLayerDefinition, options: {
    catalog: GeodesyCatalog;
    sourceLayerId: GeodesyWfsLayerId;
    source: VectorSource<Feature<Geometry>>;
    pointStyle: StyleLike;
    baseZIndex: number;
    attributeFilterValues?: GeodesyWfsAttributeFilterValuesHolder;
    visible?: boolean;
}): VectorLayer<VectorSource<Feature<Geometry>>>;
//# sourceMappingURL=geodesyWfsDomainLayer.d.ts.map