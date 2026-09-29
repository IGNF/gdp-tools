export declare const GEODESY_LAYER_GROUP_NAME = "geodesyGroup";
/** Propriété OpenLayers pour identifier une sous-couche géodésie. */
export declare const GEODESY_LAYER_ID_PROPERTY = "geodesyLayerId";
/** Service WMS vecteur Géoplateforme. */
export declare const GEODESY_WMS_URL = "https://data.geopf.fr/wms-v/ows";
/** Paramètre attendu par le service lors des appels depuis OpenLayers / ol-ext. */
export declare const GEODESY_WMS_GP_OL_EXT = "1.0.0-beta.11";
/** Catalogue des flux géodésie disponibles — seule source à modifier pour ajouter une couche. */
export declare const GEODESY_WMS_LAYERS: readonly [{
    readonly id: "RBF";
    readonly wmsLayer: "IGNF_GEODESIE-RBF";
    readonly style: "default-style-IGNF_GEODESIE-RBF";
    readonly title: "Réseau de base (RBF)";
    readonly shortLabel: "RBF";
}, {
    readonly id: "RDF";
    readonly wmsLayer: "IGNF_GEODESIE-RDF";
    readonly style: "default-style-IGNF_GEODESIE-RDF";
    readonly title: "Réseau de détail (RDF)";
    readonly shortLabel: "RDF";
}, {
    readonly id: "RN";
    readonly wmsLayer: "IGNF_GEODESIE-RN";
    readonly style: "default-style-IGNF_GEODESIE-RN";
    readonly title: "Nivellement";
    readonly shortLabel: "RN";
}, {
    readonly id: "GRAVI";
    readonly wmsLayer: "IGNF_GEODESIE-GRAV";
    readonly style: "default-style-IGNF_GEODESIE-GRAV";
    readonly title: "Gravimétrie";
    readonly shortLabel: "GRAVI";
}, {
    readonly id: "TOUT";
    readonly wmsLayer: "GEODESIE_DATA";
    readonly style: "default-style-GEODESIE_DATA";
    readonly title: "Toutes les données géodésiques";
    readonly shortLabel: "Toutes";
}];
export type GeodesyWmsLayerId = (typeof GEODESY_WMS_LAYERS)[number]['id'];
/** Couche GEODESIE_DATA (attributs complets au clic). */
export declare const GEODESY_DATA_LAYER_ID: GeodesyWmsLayerId;
/** @deprecated Préférer {@link DEFAULT_GEODESY_CATALOG}.networkLayerIds */
export declare const GEODESY_NETWORK_LAYER_IDS: readonly GeodesyWmsLayerId[];
/** @deprecated Préférer {@link DEFAULT_GEODESY_CATALOG}.uiLayers ou un catalogue projet. */
export declare const GEODESY_UI_LAYERS: ({
    readonly id: "RBF";
    readonly wmsLayer: "IGNF_GEODESIE-RBF";
    readonly style: "default-style-IGNF_GEODESIE-RBF";
    readonly title: "Réseau de base (RBF)";
    readonly shortLabel: "RBF";
} | {
    readonly id: "RDF";
    readonly wmsLayer: "IGNF_GEODESIE-RDF";
    readonly style: "default-style-IGNF_GEODESIE-RDF";
    readonly title: "Réseau de détail (RDF)";
    readonly shortLabel: "RDF";
} | {
    readonly id: "RN";
    readonly wmsLayer: "IGNF_GEODESIE-RN";
    readonly style: "default-style-IGNF_GEODESIE-RN";
    readonly title: "Nivellement";
    readonly shortLabel: "RN";
} | {
    readonly id: "GRAVI";
    readonly wmsLayer: "IGNF_GEODESIE-GRAV";
    readonly style: "default-style-IGNF_GEODESIE-GRAV";
    readonly title: "Gravimétrie";
    readonly shortLabel: "GRAVI";
})[];
/** @deprecated Alias de {@link GEODESY_DATA_LAYER_ID} — interrogée au clic pour les attributs. */
export declare const GEODESY_ENRICHMENT_LAYER_IDS: readonly GeodesyWmsLayerId[];
export type GeodesyWmsLayerDefinition = (typeof GEODESY_WMS_LAYERS)[number];
/** Identifiants connus (pour tests / garde-fous). */
export declare const GEODESY_WMS_LAYER_IDS: readonly GeodesyWmsLayerId[];
/** @deprecated Utiliser {@link GEODESY_WMS_LAYERS} */
export declare const GEODESY_WMS_LAYER: "IGNF_GEODESIE-RBF";
/** @deprecated Utiliser {@link GEODESY_WMS_LAYERS} */
export declare const GEODESY_WMS_STYLE: "default-style-IGNF_GEODESIE-RBF";
//# sourceMappingURL=wms.d.ts.map