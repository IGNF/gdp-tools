import Feature from 'ol/Feature';
import type Geometry from 'ol/geom/Geometry';
export interface ParseGeodesyWfsCsvOptions {
    /** Projection des coordonnées CSV (défaut EPSG:4326). */
    dataProjection?: string;
    /** Projection cible des géométries OpenLayers. */
    featureProjection?: string;
}
/**
 * Parse une réponse WFS CSV (GetFeature) en features OpenLayers.
 * Détecte une colonne WKT (`geom`, `the_geom`…) ou des paires lon/lat.
 */
export declare function parseGeodesyWfsCsv(payload: string, options?: ParseGeodesyWfsCsvOptions): Feature<Geometry>[];
//# sourceMappingURL=parseGeodesyWfsCsv.d.ts.map