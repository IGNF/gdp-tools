/** URL du flux texte stations GNSS permanentes (RGP). */
export declare const GEODESY_GDP_RGP2_URL = "https://data.geopf.fr/annexes/geodesie/gdp/GDP_RGP2.txt";
export type GeodesyAnnexLayerId = 'GDP_RGP2';
/** Format de parsing du fichier annexe. */
export type GeodesyAnnexFormat = 'gdp-rgp2';
export interface GeodesyAnnexLayerDefinition {
    id: GeodesyAnnexLayerId;
    title: string;
    shortLabel: string;
    url: string;
    format: GeodesyAnnexFormat;
    /** Champs affichés dans la popup / fiche point. */
    attributeKeys: readonly string[];
    /** Clés pour le titre affiché (défaut : nom, commune). */
    titleKeys?: readonly string[];
    /** Signalement sur point (défaut : false pour les flux annexes). */
    reportingEnabled?: boolean;
}
/** Champs du flux {@link GEODESY_GDP_RGP2_URL}. */
export declare const GEODESY_GDP_RGP2_ATTRIBUTE_KEYS: readonly ["nom", "cadence", "commune", "reseaux", "longitude", "latitude", "hauteur", "info", "dispo"];
/** Catalogue des flux annexes géodésie documentés — ajouter ici de nouvelles couches. */
export declare const GEODESY_ANNEX_LAYERS: readonly GeodesyAnnexLayerDefinition[];
export declare const GEODESY_ANNEX_LAYER_IDS: readonly GeodesyAnnexLayerId[];
//# sourceMappingURL=annex.d.ts.map