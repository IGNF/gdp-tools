import { type GeodesyCatalog, type GeodesyCatalogOptions, type GeodesyLayerId } from '../catalog/geodesyCatalog';
import { type GeodesyPublicAttributeKey } from './geodesyPublicAttributeKeys';
/** Flux WMS proposés en profil grand public (TOUT reste technique pour GetFeatureInfo). */
export declare const GEODESY_PUBLIC_WMS_UI_LAYER_IDS: readonly ["RBF", "RDF", "RN"];
/** Couches actives par défaut (profil grand public). */
export declare const GEODESY_PUBLIC_DEFAULT_ACTIVE: readonly GeodesyLayerId[];
export interface CreateGeodesyPublicCatalogOptions extends GeodesyCatalogOptions {
    /**
     * Clé API WFS privé (GDP). Ignorée si {@link enableWfsLayers} est false.
     */
    wfsApiKey?: string;
    /**
     * Ajoute les flux WFS en complément du WMS (défaut : false — affichage tuiles seul).
     */
    enableWfsLayers?: boolean;
    /** Surcharge des champs fiche repère (défaut : {@link GEODESY_PUBLIC_ATTRIBUTE_KEYS}). */
    attributeKeys?: readonly GeodesyPublicAttributeKey[] | readonly string[];
}
/**
 * Catalogue « grand public » : tuiles WMS RBF / RDF / nivellement, GetFeatureInfo via TOUT,
 * fiche repère courte. WFS et annexes désactivés par défaut.
 *
 * Préférer {@link createGeodesyCatalogForProfile}('public', options) pour brancher un profil.
 */
export declare function createGeodesyPublicCatalog(options?: CreateGeodesyPublicCatalogOptions): GeodesyCatalog;
//# sourceMappingURL=geodesyPublicCatalog.d.ts.map