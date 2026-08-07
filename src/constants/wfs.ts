/** Service WFS privé Géoplateforme (clé API requise). */
export const GEODESY_WFS_PRIVATE_URL = 'https://data.geopf.fr/private/wfs';

/** Service WFS public Géoplateforme. */
export const GEODESY_WFS_PUBLIC_URL = 'https://data.geopf.fr/wfs';

/** @deprecated Préférer {@link GEODESY_WFS_PRIVATE_URL} ou {@link GEODESY_WFS_PUBLIC_URL}. */
export const GEODESY_WFS_URL = GEODESY_WFS_PRIVATE_URL;

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
export const GEODESY_WFS_LAYERS: readonly GeodesyWfsLayerDefinition[] = [
  {
    id: 'DATA_GEOD',
    typeName: 'GEODESIE:data_geod',
    title: 'Données géodésiques (WFS)',
    shortLabel: 'Data géod',
    wfsUrl: GEODESY_WFS_PUBLIC_URL,
    requiresApiKey: false,
    outputFormat: 'application/json',
    responseFormat: 'geojson',
    version: '2.0.0',
    bboxOrder: 'latLon',
    bboxCrs: 'urn:ogc:def:crs:EPSG::4326',
  },
  {
    id: 'GDP',
    typeName: 'GEODESIE_GDP:gdp_point',
    title: 'Points GDP',
    shortLabel: 'GDP',
    wfsUrl: GEODESY_WFS_PRIVATE_URL,
    requiresApiKey: true,
    outputFormat: 'application/json',
    responseFormat: 'geojson',
    version: '2.0.0',
    bboxOrder: 'latLon',
  },
];

export const GEODESY_WFS_LAYER_IDS: readonly GeodesyWfsLayerId[] = GEODESY_WFS_LAYERS.map(
  (layer) => layer.id,
);

/** Propriété OpenLayers : type de flux (`wms` | `wfs`). */
export const GEODESY_LAYER_KIND_PROPERTY = 'geodesyLayerKind';

export type GeodesyLayerKind = 'wms' | 'wfs' | 'annex';

export function isGeodesyWfsLayerActive(
  layer: GeodesyWfsLayerDefinition,
  wfsApiKey?: string,
): boolean {
  if (!layer.requiresApiKey) {
    return true;
  }

  return Boolean(wfsApiKey?.trim());
}

export function resolveGeodesyWfsLayerUrl(
  layer: GeodesyWfsLayerDefinition,
  catalogWfsUrl: string,
): string {
  return layer.wfsUrl || catalogWfsUrl;
}
