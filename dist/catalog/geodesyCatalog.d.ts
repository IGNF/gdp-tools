import { type GeodesyWmsLayerDefinition, type GeodesyWmsLayerId } from '../constants/wms';
import { type GeodesyAnnexLayerDefinition, type GeodesyAnnexLayerId } from '../constants/annex';
import type { GeodesyWfsLayerId } from '../constants/wfs';
import { type GeodesyWfsAttributeFilterDefinition } from '../constants/wfsAttributeFilters';
import { type GeodesyWfsDomainLayerDefinition, type GeodesyWfsDomainLayerId } from '../constants/wfsDomainLayers';
import { type GeodesyWfsLayerDefinition } from '../constants/wfs';
import type { GeodesyPictoUrlMap } from '../style/geodesyWfsPictoStyle';
import { type GeodesyWfsClusterConfig, type GeodesyWfsClusterOptions } from '../constants/wfsCluster';
import { type GeodesyAttributeCatalog, type GeodesyAttributeCatalogOptions } from './geodesyAttributeCatalog';
/** Identifiant de couche géodésie (WMS, WFS, annexe ou filtre domaine WFS). */
export type GeodesyLayerId = GeodesyWmsLayerId | GeodesyWfsLayerId | GeodesyWfsDomainLayerId | GeodesyAnnexLayerId;
/** Propriété OpenLayers du groupe géodésie : catalogue résolu enregistré à l’init. */
export declare const GEODESY_CATALOG_PROPERTY = "geodesyCatalog";
export interface GeodesyCatalog {
    layers: readonly GeodesyWmsLayerDefinition[];
    layerIds: readonly GeodesyWmsLayerId[];
    uiLayers: readonly GeodesyWmsLayerDefinition[];
    uiLayerIds: readonly GeodesyWmsLayerId[];
    dataLayerId: GeodesyWmsLayerId;
    networkLayerIds: readonly GeodesyWmsLayerId[];
    wmsUrl: string;
    wmsGpOlExt: string;
    attributes: GeodesyAttributeCatalog;
    wfsLayers: readonly GeodesyWfsLayerDefinition[];
    wfsLayerIds: readonly GeodesyWfsLayerId[];
    wfsUiLayers: readonly GeodesyWfsLayerDefinition[];
    wfsUiLayerIds: readonly GeodesyLayerId[];
    /** Filtres d’affichage WFS par champ `domaine` (profil expert). */
    wfsDomainLayers: readonly GeodesyWfsDomainLayerDefinition[];
    wfsDomainLayerIds: readonly GeodesyWfsDomainLayerId[];
    /** Flux WFS chargé une fois ; les couches domaine filtrent sa source. */
    wfsDomainSourceLayerId?: GeodesyWfsLayerId;
    /** Filtres attributs WFS (booléen, date, texte, choix — profil expert). */
    wfsAttributeFilters: readonly GeodesyWfsAttributeFilterDefinition[];
    wfsUrl: string;
    wfsApiKey?: string;
    wfsDataProjection: string;
    wfsBboxPaddingRatio: number;
    wfsUseCacheBuster: boolean;
    /** Symboles par couche WFS : code `picto` → URL (défaut IGN + surcharges catalogue). */
    wfsPictoUrlMaps: Readonly<Partial<Record<GeodesyWfsLayerId, GeodesyPictoUrlMap>>>;
    /** Regroupement animé des entités WFS (ol-ext AnimatedCluster). */
    wfsCluster: GeodesyWfsClusterConfig;
    annexLayers: readonly GeodesyAnnexLayerDefinition[];
    annexLayerIds: readonly GeodesyAnnexLayerId[];
    annexUiLayers: readonly GeodesyAnnexLayerDefinition[];
    annexUiLayerIds: readonly GeodesyAnnexLayerId[];
}
export interface GeodesyCatalogOptions extends GeodesyAttributeCatalogOptions {
    /**
     * Catalogue complet des couches (prioritaire sur {@link layerIds}).
     * Par défaut : {@link GEODESY_WMS_LAYERS}.
     */
    layers?: readonly GeodesyWmsLayerDefinition[];
    /** Sous-ensemble du catalogue IGN par identifiant (ex. exclure GRAVI). */
    layerIds?: readonly GeodesyWmsLayerId[];
    /**
     * Couches proposées dans les sélecteurs UI.
     * Défaut : toutes les couches du catalogue sauf {@link dataLayerId}.
     */
    uiLayerIds?: readonly GeodesyWmsLayerId[];
    /** Couche attributs GetFeatureInfo. Défaut : `TOUT`. */
    dataLayerId?: GeodesyWmsLayerId;
    /**
     * Couches réseau pour le filtrage `groupe_type` au clic.
     * Défaut : toutes sauf {@link dataLayerId}.
     */
    networkLayerIds?: readonly GeodesyWmsLayerId[];
    wmsUrl?: string;
    wmsGpOlExt?: string;
    /** Catalogue attributs (prioritaire sur attributeKeys / excludedKeys…). */
    attributes?: GeodesyAttributeCatalog;
    /** Catalogue WFS complet (prioritaire sur {@link wfsLayerIds}). */
    wfsLayers?: readonly GeodesyWfsLayerDefinition[];
    /** Sous-ensemble des flux WFS (publics ou privés avec {@link wfsApiKey}). */
    wfsLayerIds?: readonly GeodesyWfsLayerId[];
    /** Couches WFS proposées dans les sélecteurs UI. Défaut : toutes les couches WFS actives. */
    wfsUiLayerIds?: readonly GeodesyWfsLayerId[];
    wfsUrl?: string;
    /** Clé API pour les flux WFS privés (`requiresApiKey: true`). */
    wfsApiKey?: string;
    /** Projection des coordonnées dans la réponse CSV. */
    wfsDataProjection?: string;
    /** Marge relative autour de l’emprise pour le paramètre bbox (ex. 0.05). */
    wfsBboxPaddingRatio?: number;
    /** Ajoute le paramètre `_t` anti-cache aux requêtes WFS. */
    wfsUseCacheBuster?: boolean;
    /** Surcharge des symboles WFS (fusionnée avec {@link DEFAULT_GEODESY_WFS_PICTO_URL_MAPS}). */
    wfsPictoUrlMaps?: Partial<Record<GeodesyWfsLayerId, GeodesyPictoUrlMap>>;
    /** Clustering WFS (défaut : activé). Passer `{ enabled: false }` pour afficher chaque repère. */
    wfsCluster?: GeodesyWfsClusterOptions;
    /**
     * Couches switcher filtrées par `domaine` (ex. rsgf/rsgo → Géodésie).
     * Si non vide, remplace {@link wfsUiLayerIds} et masque le flux source dans l’UI.
     */
    wfsDomainLayers?: readonly GeodesyWfsDomainLayerDefinition[];
    /** Flux WFS source des filtres domaine (défaut : DATA_GEOD si actif, sinon GDP). */
    wfsDomainSourceLayerId?: GeodesyWfsLayerId;
    /** Filtres attributs proposés dans l’UI cliente (défaut : aucun). */
    wfsAttributeFilters?: readonly GeodesyWfsAttributeFilterDefinition[];
    /** Catalogue annexes complet (prioritaire sur {@link annexLayerIds}). */
    annexLayers?: readonly GeodesyAnnexLayerDefinition[];
    /** Sous-ensemble des flux annexes (fichiers texte Géoplateforme). */
    annexLayerIds?: readonly GeodesyAnnexLayerId[];
    /** Couches annexes proposées dans les sélecteurs UI. Défaut : toutes les couches annexes actives. */
    annexUiLayerIds?: readonly GeodesyAnnexLayerId[];
}
/** Construit un catalogue géodésie (catalogue IGN complet par défaut). */
export declare function createGeodesyCatalog(options?: GeodesyCatalogOptions): GeodesyCatalog;
/** Catalogue IGN complet (toutes les couches documentées). */
export declare const DEFAULT_GEODESY_CATALOG: GeodesyCatalog;
export declare function getLayerDefinition(catalog: GeodesyCatalog, layerId: GeodesyWmsLayerId): GeodesyWmsLayerDefinition | undefined;
export declare function getLayerStackIndex(catalog: GeodesyCatalog, layerId: GeodesyWmsLayerId): number;
/** Identifiants WMS + WFS (ou filtres domaine) + annexes du catalogue. */
export declare function getGeodesyCatalogLayerIds(catalog: GeodesyCatalog): GeodesyLayerId[];
//# sourceMappingURL=geodesyCatalog.d.ts.map