/** Clés utilisées pour le titre de la popup / fiche repère (ordre de priorité). */
export declare const DEFAULT_GEODESY_TITLE_KEYS: readonly ["nom", "NOM", "libelle", "LIBELLE", "name", "NAME", "id", "ID", "code", "CODE", "_caption"];
export interface GeodesyAttributeCatalog {
    attributeKeys: readonly string[];
    excludedKeys: readonly string[];
    titleKeys: readonly string[];
    labels: Readonly<Record<string, string>>;
}
export interface GeodesyAttributeCatalogOptions {
    /**
     * Champs affichables dans la popup / fiche repère (ordre respecté).
     * Défaut : {@link GEODESIE_DATA_ATTRIBUTE_KEYS} (catalogue IGN complet).
     */
    attributeKeys?: readonly string[];
    /** Champs techniques exclus en plus des exclusions par défaut. */
    excludedKeys?: readonly string[];
    /** Clés pour déduire le titre affiché. */
    titleKeys?: readonly string[];
    /** Surcharge des libellés (fusionnés avec {@link GEODESY_ATTRIBUTE_LABELS}). */
    labels?: Readonly<Record<string, string>>;
}
/** Construit un catalogue d’attributs GEODESIE_DATA (liste IGN complète par défaut). */
export declare function createGeodesyAttributeCatalog(options?: GeodesyAttributeCatalogOptions): GeodesyAttributeCatalog;
/** Catalogue IGN complet (tous les attributs documentés). */
export declare const DEFAULT_GEODESY_ATTRIBUTE_CATALOG: GeodesyAttributeCatalog;
export declare function getGeodesyAttributeLabelFromCatalog(key: string, catalog?: GeodesyAttributeCatalog): string;
export declare function isExcludedGeodesyAttributeKeyForCatalog(key: string, catalog?: GeodesyAttributeCatalog): boolean;
/** Retourne le titre popup / fiche à partir des propriétés du point. */
export declare function resolveGeodesyPopupTitle(properties: Record<string, unknown>, catalog?: GeodesyAttributeCatalog, fallback?: string): string;
/**
 * Filtre et ordonne les entrées attributs selon le catalogue.
 * Seuls les champs non vides présents dans {@link GeodesyAttributeCatalog.attributeKeys} sont conservés.
 */
export declare function selectGeodesyDisplayEntries(entries: Array<[string, string]>, catalog?: GeodesyAttributeCatalog): Array<[string, string]>;
//# sourceMappingURL=geodesyAttributeCatalog.d.ts.map