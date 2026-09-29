import Feature from 'ol/Feature';
import type Geometry from 'ol/geom/Geometry';
export interface ParseGeodesyGdpRgp2Options {
    /** Projection des coordonnées du fichier (défaut EPSG:4326). */
    dataProjection?: string;
    /** Projection cible des géométries OpenLayers. */
    featureProjection?: string;
}
/**
 * Parse le flux texte `GDP_RGP2.txt` (séparateur `;`, colonne `longitude,latitude`).
 * Ignore les lignes de commentaire commençant par `#`.
 */
export declare function parseGeodesyGdpRgp2(payload: string, options?: ParseGeodesyGdpRgp2Options): Feature<Geometry>[];
//# sourceMappingURL=parseGeodesyGdpRgp2.d.ts.map