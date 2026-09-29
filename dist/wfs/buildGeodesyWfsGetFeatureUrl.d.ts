import type { Extent } from 'ol/extent';
import type { Projection } from 'ol/proj';
import type { GeodesyWfsBboxOrder } from '../constants/wfs';
export interface FormatGeodesyWfsBboxOptions {
    bboxOrder?: GeodesyWfsBboxOrder;
    /** Marge relative autour de l’emprise (ex. 0.05 = 5 %). */
    paddingRatio?: number;
    /** Suffixe CRS WFS 2.0 ajouté au paramètre bbox. */
    bboxCrs?: string;
}
/** Formate l’emprise carte en paramètre `bbox` WFS (EPSG:4326). */
export declare function formatGeodesyWfsBbox(extent: Extent, projection: Projection, options?: FormatGeodesyWfsBboxOptions): string;
export interface BuildGeodesyWfsGetFeatureUrlOptions {
    wfsUrl: string;
    typeName: string;
    /** Emprise `bbox` — exclusif avec {@link cqlFilter} côté GeoServer. */
    bbox?: string;
    /** Filtre attributaire `CQL_FILTER` (ex. recherche par identifiant). */
    cqlFilter?: string;
    /** Restreint les propriétés renvoyées (`PROPERTYNAME`). */
    propertyNames?: readonly string[];
    apiKey?: string;
    version?: string;
    outputFormat?: string;
    /** Paramètre anti-cache (`_t`) — activé par défaut. */
    useCacheBuster?: boolean;
}
/** Construit l’URL GetFeature WFS Géoplateforme (public ou privé). */
export declare function buildGeodesyWfsGetFeatureUrl(options: BuildGeodesyWfsGetFeatureUrlOptions): string;
//# sourceMappingURL=buildGeodesyWfsGetFeatureUrl.d.ts.map