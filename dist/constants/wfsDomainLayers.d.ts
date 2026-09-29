import type Feature from 'ol/Feature';
/** Propriété feature WFS portant le code domaine (ex. `rsgf`, `nivo`). */
export declare const GEODESY_WFS_DOMAINE_PROPERTY = "domaine";
/** Identifiant d’une couche d’affichage filtrée par codes `domaine`. */
export type GeodesyWfsDomainLayerId = string;
/** Regroupement de codes `domaine` → une couche switcher (extensible). */
export interface GeodesyWfsDomainLayerDefinition {
    id: GeodesyWfsDomainLayerId;
    title: string;
    shortLabel: string;
    /** Codes `domaine` inclus (comparaison insensible à la casse). */
    domaines: readonly string[];
}
/** Propriété OpenLayers : couche WFS source d’un filtre domaine. */
export declare const GEODESY_WFS_DOMAIN_SOURCE_LAYER_PROPERTY = "geodesyWfsDomainSourceLayerId";
/** Propriété OpenLayers : couche WFS chargement données uniquement (non cliquable). */
export declare const GEODESY_WFS_DATA_LAYER_PROPERTY = "geodesyWfsDataLayer";
/** Filtres domaine documentés (profil expert). */
export declare const DEFAULT_GEODESY_WFS_DOMAIN_LAYERS: readonly GeodesyWfsDomainLayerDefinition[];
export declare function normalizeGeodesyWfsDomaine(value: unknown): string | undefined;
/** True si la feature (ou un membre cluster) appartient à l’un des domaines. */
export declare function geodesyWfsFeatureMatchesDomaines(feature: Feature, domaines: readonly string[]): boolean;
//# sourceMappingURL=wfsDomainLayers.d.ts.map