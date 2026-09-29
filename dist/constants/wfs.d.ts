/** Service WFS privé Géoplateforme (clé API requise). */
export declare const GEODESY_WFS_PRIVATE_URL = "https://data.geopf.fr/private/wfs";
/** Service WFS public Géoplateforme. */
export declare const GEODESY_WFS_PUBLIC_URL = "https://data.geopf.fr/wfs";
/** @deprecated Préférer {@link GEODESY_WFS_PRIVATE_URL} ou {@link GEODESY_WFS_PUBLIC_URL}. */
export declare const GEODESY_WFS_URL = "https://data.geopf.fr/private/wfs";
/** Ordre des coordonnées du paramètre `bbox`. */
export type GeodesyWfsBboxOrder = 'latLon' | 'lonLat';
/** Format de réponse attendu pour parser GetFeature. */
export type GeodesyWfsResponseFormat = 'csv' | 'geojson';
export type GeodesyWfsLayerId = 'GDP' | 'DATA_GEOD';
export interface GeodesyWfsLayerDefinition {
    id: GeodesyWfsLayerId;
    typeName: string;
    title: string;
    shortLabel: string;
    wfsUrl: string;
    /** Si true, {@link GeodesyCatalog.wfsApiKey} est requis pour activer la couche. */
    requiresApiKey: boolean;
    outputFormat: string;
    responseFormat: GeodesyWfsResponseFormat;
    version: string;
    bboxOrder: GeodesyWfsBboxOrder;
    /** Suffixe CRS WFS 2.0 (ex. `urn:ogc:def:crs:EPSG::4326`). */
    bboxCrs?: string;
}
/** Catalogue des flux WFS géodésie documentés — ajouter ici de nouvelles couches. */
export declare const GEODESY_WFS_LAYERS: readonly GeodesyWfsLayerDefinition[];
export declare const GEODESY_WFS_LAYER_IDS: readonly GeodesyWfsLayerId[];
/** Propriété OpenLayers : type de flux (`wms` | `wfs`). */
export declare const GEODESY_LAYER_KIND_PROPERTY = "geodesyLayerKind";
export type GeodesyLayerKind = 'wms' | 'wfs' | 'annex';
export declare function isGeodesyWfsLayerActive(layer: GeodesyWfsLayerDefinition, wfsApiKey?: string): boolean;
export declare function resolveGeodesyWfsLayerUrl(layer: GeodesyWfsLayerDefinition, catalogWfsUrl: string): string;
//# sourceMappingURL=wfs.d.ts.map