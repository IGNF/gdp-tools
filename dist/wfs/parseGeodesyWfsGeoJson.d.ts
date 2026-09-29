import Feature from 'ol/Feature';
import type Geometry from 'ol/geom/Geometry';
export interface ParseGeodesyWfsGeoJsonOptions {
    dataProjection?: string;
    featureProjection?: string;
}
/** Parse une réponse WFS GeoJSON (`application/json`) en features OpenLayers. */
export declare function parseGeodesyWfsGeoJson(payload: string, options?: ParseGeodesyWfsGeoJsonOptions): Feature<Geometry>[];
//# sourceMappingURL=parseGeodesyWfsGeoJson.d.ts.map