export const GEODESY_LAYER_GROUP_NAME = 'geodesyGroup';

/** Propriété OpenLayers pour identifier une sous-couche géodésie. */
export const GEODESY_LAYER_ID_PROPERTY = 'geodesyLayerId';

/** Service WMS vecteur Géoplateforme. */
export const GEODESY_WMS_URL = 'https://data.geopf.fr/wms-v/ows';

/** Paramètre attendu par le service lors des appels depuis OpenLayers / ol-ext. */
export const GEODESY_WMS_GP_OL_EXT = '1.0.0-beta.11';

/** Catalogue des flux géodésie disponibles — seule source à modifier pour ajouter une couche. */
export const GEODESY_WMS_LAYERS = [
  {
    id: 'RBF',
    wmsLayer: 'IGNF_GEODESIE-RBF',
    style: 'default-style-IGNF_GEODESIE-RBF',
    title: 'Réseau de base (RBF)',
    shortLabel: 'RBF',
  },
  {
    id: 'RDF',
    wmsLayer: 'IGNF_GEODESIE-RDF',
    style: 'default-style-IGNF_GEODESIE-RDF',
    title: 'Réseau de détail (RDF)',
    shortLabel: 'RDF',
  },
  {
    id: 'RN',
    wmsLayer: 'IGNF_GEODESIE-RN',
    style: 'default-style-IGNF_GEODESIE-RN',
    title: 'Nivellement',
    shortLabel: 'RN',
  },
  {
    id: 'GRAVI',
    wmsLayer: 'IGNF_GEODESIE-GRAV',
    style: 'default-style-IGNF_GEODESIE-GRAV',
    title: 'Gravimétrie',
    shortLabel: 'GRAVI',
  },
  {
    id: 'TOUT',
    wmsLayer: 'GEODESIE_DATA',
    style: 'default-style-GEODESIE_DATA',
    title: 'Toutes les données géodésiques',
    shortLabel: 'Toutes',
  },
] as const;

export type GeodesyWmsLayerId = (typeof GEODESY_WMS_LAYERS)[number]['id'];

/** Couche GEODESIE_DATA (attributs complets au clic). */
export const GEODESY_DATA_LAYER_ID: GeodesyWmsLayerId = 'TOUT';

/** @deprecated Préférer {@link DEFAULT_GEODESY_CATALOG}.networkLayerIds */
export const GEODESY_NETWORK_LAYER_IDS: readonly GeodesyWmsLayerId[] = GEODESY_WMS_LAYERS.filter(
  (layer) => layer.id !== GEODESY_DATA_LAYER_ID,
).map((layer) => layer.id);

/** @deprecated Préférer {@link DEFAULT_GEODESY_CATALOG}.uiLayers ou un catalogue projet. */
export const GEODESY_UI_LAYERS = GEODESY_WMS_LAYERS.filter(
  (layer) => layer.id !== GEODESY_DATA_LAYER_ID,
);

/** @deprecated Alias de {@link GEODESY_DATA_LAYER_ID} — interrogée au clic pour les attributs. */
export const GEODESY_ENRICHMENT_LAYER_IDS: readonly GeodesyWmsLayerId[] = [GEODESY_DATA_LAYER_ID];

export type GeodesyWmsLayerDefinition = (typeof GEODESY_WMS_LAYERS)[number];

/** Identifiants connus (pour tests / garde-fous). */
export const GEODESY_WMS_LAYER_IDS: readonly GeodesyWmsLayerId[] = GEODESY_WMS_LAYERS.map(
  (layer) => layer.id,
);

/** @deprecated Utiliser {@link GEODESY_WMS_LAYERS} */
export const GEODESY_WMS_LAYER = GEODESY_WMS_LAYERS[0].wmsLayer;

/** @deprecated Utiliser {@link GEODESY_WMS_LAYERS} */
export const GEODESY_WMS_STYLE = GEODESY_WMS_LAYERS[0].style;
