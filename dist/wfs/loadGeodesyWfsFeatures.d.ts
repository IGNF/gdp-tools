import Feature from 'ol/Feature';
import type Geometry from 'ol/geom/Geometry';
import type { Extent } from 'ol/extent';
import type { Projection } from 'ol/proj';
import type { GeodesyCatalog } from '../catalog/geodesyCatalog';
import { type GeodesyWfsLayerDefinition } from '../constants/wfs';
export interface LoadGeodesyWfsFeaturesOptions {
    catalog: GeodesyCatalog;
    definition: GeodesyWfsLayerDefinition;
    extent: Extent;
    projection: Projection;
    timeoutMs?: number;
}
/** Charge les entités WFS pour une emprise carte (CSV ou GeoJSON). */
export declare function loadGeodesyWfsFeatures(options: LoadGeodesyWfsFeaturesOptions): Promise<Feature<Geometry>[]>;
//# sourceMappingURL=loadGeodesyWfsFeatures.d.ts.map