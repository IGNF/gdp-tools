import type Feature from 'ol/Feature';
import type { GeodesyWfsLayerId } from './wfs';
/** Identifiant d’un filtre attribut WFS (profil expert). */
export type GeodesyWfsAttributeFilterId = string;
/** Propriété OpenLayers du groupe géodésie : valeurs des filtres attributs actifs. */
export declare const GEODESY_WFS_ATTRIBUTE_FILTER_VALUES_PROPERTY = "geodesyWfsAttributeFilterValues";
export interface GeodesyWfsAttributeFilterDefinitionBase {
    id: GeodesyWfsAttributeFilterId;
    title: string;
    /** Propriété feature WFS (ex. `img1_url`, `vis_date`, `proprio_id`). */
    property: string;
    /**
     * Couche WFS portant la propriété (ex. `GDP` pour `proprio_id`).
     * Si absent, la couche source des filtres domaine est utilisée.
     */
    wfsLayerId?: GeodesyWfsLayerId;
}
/** Filtre oui/non sur présence d’une valeur (ex. photo `img1_url`). */
export interface GeodesyWfsBooleanFilterDefinition extends GeodesyWfsAttributeFilterDefinitionBase {
    type: 'boolean';
    trueLabel?: string;
    falseLabel?: string;
}
/** Filtre date (ex. `vis_date` inférieure à une date). */
export interface GeodesyWfsDateFilterDefinition extends GeodesyWfsAttributeFilterDefinitionBase {
    type: 'date';
    operator: 'before' | 'after';
}
/** Filtre texte (égalité, contient…). */
export interface GeodesyWfsTextFilterDefinition extends GeodesyWfsAttributeFilterDefinitionBase {
    type: 'text';
    operator?: 'equals' | 'contains' | 'notEquals';
    placeholder?: string;
}
export interface GeodesyWfsChoiceFilterOption {
    value: string;
    label: string;
    /** Toutes les valeurs sauf les autres options explicites (ex. « Autre »). */
    matchOthers?: boolean;
}
/** Filtre à choix (ex. propriétaire IGN / autre). */
export interface GeodesyWfsChoiceFilterDefinition extends GeodesyWfsAttributeFilterDefinitionBase {
    type: 'choice';
    options: readonly GeodesyWfsChoiceFilterOption[];
}
/** Filtre à choix multiples (ex. RBF / RDF / Triplet / Non triplet). */
export interface GeodesyWfsMultiChoiceFilterDefinition extends GeodesyWfsAttributeFilterDefinitionBase {
    type: 'multiChoice';
    options: readonly GeodesyWfsChoiceFilterOption[];
    /**
     * Stratégie de classification des repères.
     * Défaut : `network-category`.
     */
    matcher?: 'network-category';
}
export type GeodesyWfsAttributeFilterDefinition = GeodesyWfsBooleanFilterDefinition | GeodesyWfsDateFilterDefinition | GeodesyWfsTextFilterDefinition | GeodesyWfsChoiceFilterDefinition | GeodesyWfsMultiChoiceFilterDefinition;
/**
 * Valeurs actives des filtres.
 * Clé absente, `null` ou `undefined` → filtre inactif.
 * - `boolean` : `true` = propriété renseignée, `false` = vide
 * - `date` / `text` / `choice` : chaîne non vide
 */
export type GeodesyWfsAttributeFilterValues = Partial<Record<GeodesyWfsAttributeFilterId, boolean | string | null | undefined>>;
/** Conteneur mutable partagé entre le groupe OL et les styles WFS. */
export interface GeodesyWfsAttributeFilterValuesHolder {
    values: GeodesyWfsAttributeFilterValues;
    /** Attributs indexés par identifiant métier pour les couches WFS auxiliaires aux filtres. */
    auxiliaryPropertiesByLayerId?: ReadonlyMap<GeodesyWfsLayerId, ReadonlyMap<string, Readonly<Record<string, unknown>>>>;
}
export declare function createGeodesyWfsAttributeFilterValuesHolder(values?: GeodesyWfsAttributeFilterValues): GeodesyWfsAttributeFilterValuesHolder;
/** Filtres attributs documentés (profil expert — surchargeables par l’app cliente). */
export declare const DEFAULT_GEODESY_EXPERT_WFS_ATTRIBUTE_FILTERS: readonly GeodesyWfsAttributeFilterDefinition[];
export type GeodesyWfsAttributeFilterAuxiliaryProperties = ReadonlyMap<GeodesyWfsLayerId, ReadonlyMap<string, Readonly<Record<string, unknown>>>>;
/** Couches WFS à charger en auxiliaire pour les filtres attributs (hors couche source domaine). */
export declare function resolveGeodesyWfsAttributeFilterAuxiliaryLayerIds(definitions: readonly GeodesyWfsAttributeFilterDefinition[], domainSourceLayerId?: GeodesyWfsLayerId): GeodesyWfsLayerId[];
export declare function getGeodesyWfsMultiChoiceSelectedValues(definition: GeodesyWfsMultiChoiceFilterDefinition, value: boolean | string | null | undefined): Set<string>;
export interface GeodesyWfsAttributeFilterMatchContext {
    domainSourceLayerId?: GeodesyWfsLayerId;
    auxiliaryPropertiesByLayerId?: GeodesyWfsAttributeFilterAuxiliaryProperties;
}
/** True si la feature (ou un membre cluster) passe tous les filtres attributs actifs. */
export declare function geodesyWfsFeatureMatchesAttributeFilters(feature: Feature, definitions: readonly GeodesyWfsAttributeFilterDefinition[], values: GeodesyWfsAttributeFilterValues, filterContext?: GeodesyWfsAttributeFilterMatchContext): boolean;
/** Nombre de contraintes actives : chaque type de point désactivé compte pour 1. */
export declare function countActiveGeodesyWfsAttributeFilters(definitions: readonly GeodesyWfsAttributeFilterDefinition[], values: GeodesyWfsAttributeFilterValues): number;
export declare function createDefaultGeodesyWfsAttributeFilterValues(definitions?: readonly GeodesyWfsAttributeFilterDefinition[]): GeodesyWfsAttributeFilterValues;
//# sourceMappingURL=wfsAttributeFilters.d.ts.map