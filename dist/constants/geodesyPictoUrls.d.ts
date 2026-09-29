import type { GeodesyWfsLayerId } from './wfs';
import { type GeodesyPictoUrlMap } from '../style/geodesyWfsPictoStyle';
/** Fusionne les tables picto de plusieurs flux WFS. */
export declare function mergeGeodesyPictoUrlMaps(pictoUrlMaps: Readonly<Partial<Record<GeodesyWfsLayerId, GeodesyPictoUrlMap>>>): GeodesyPictoUrlMap;
/**
 * Résout l’URL du symbole IGN à partir du code `picto` et des tables du catalogue.
 * Cherche d’abord la couche WFS source, puis l’union de toutes les tables.
 */
export declare function resolveGeodesyPictoImageUrl(pictoCode: unknown, options?: {
    pictoUrlMaps?: Readonly<Partial<Record<GeodesyWfsLayerId, GeodesyPictoUrlMap>>>;
    layerId?: string;
}): string | undefined;
/**
 * Correspondance code `picto` (flux GDP) → URL symbole Géoplateforme.
 * Convention fichiers : `{réseau}_{bon|bad|del}_15.gif` (ex. `rbf_bon_15.gif`).
 */
export declare const GEODESY_GDP_PICTO_URLS: GeodesyPictoUrlMap;
/** Tables picto par défaut pour les couches WFS documentées. */
export declare const DEFAULT_GEODESY_WFS_PICTO_URL_MAPS: Readonly<Partial<Record<GeodesyWfsLayerId, GeodesyPictoUrlMap>>>;
//# sourceMappingURL=geodesyPictoUrls.d.ts.map