import { type GeodesyCatalog, type GeodesyCatalogOptions, type GeodesyLayerId } from '../catalog/geodesyCatalog';
import type { GeodesyWfsLayerId } from '../constants/wfs';
/** Couche WFS source par défaut (flux public GEODESIE:data_geod). */
export declare const GEODESY_EXPERT_WFS_PRIMARY_LAYER: GeodesyWfsLayerId;
/** Couche WFS optionnelle (flux privé GDP, si clé API). */
export declare const GEODESY_EXPERT_WFS_FALLBACK_LAYER: GeodesyWfsLayerId;
export interface CreateGeodesyExpertCatalogOptions extends GeodesyCatalogOptions {
    /** Clé API WFS privé — ajoute GDP en option à DATA_GEOD. */
    wfsApiKey?: string;
}
/** Couches actives par défaut (profil expert) — filtres domaine ou flux WFS unique. */
export declare function defaultGeodesyExpertActiveLayerIds(options?: Pick<CreateGeodesyExpertCatalogOptions, 'wfsApiKey' | 'wfsLayerIds' | 'wfsDomainLayers'>): readonly GeodesyLayerId[];
/**
 * Catalogue « expert » : affichage WFS (DATA_GEOD + GDP optionnel), attributs GEODESIE_DATA complets,
 * TOUT WMS réservé au secours GetFeatureInfo. Filtres domaine dans le switcher par défaut.
 */
export declare function createGeodesyExpertCatalog(options?: CreateGeodesyExpertCatalogOptions): GeodesyCatalog;
//# sourceMappingURL=geodesyExpertCatalog.d.ts.map