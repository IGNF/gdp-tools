import type { FeatureLike } from 'ol/Feature';
import Style, { type StyleFunction, type StyleLike } from 'ol/style/Style';
import type { GeodesyCatalog } from '../catalog/geodesyCatalog';
/** Base URL IGN des symboles géodésie (ex. `…/symbol/rbf_bon_15.gif`). */
export declare const GEODESY_PICTO_SYMBOL_BASE_URL = "https://data.geopf.fr/annexes/geodesie/symbol";
/** Correspondance code `picto` (feature WFS) → URL du symbole. */
export type GeodesyPictoUrlMap = Readonly<Record<string, string>>;
export declare function normalizeGeodesyPictoCode(value: unknown): string | undefined;
export declare function resolveGeodesyPictoUrl(pictoUrlMap: GeodesyPictoUrlMap, pictoCode: string): string | undefined;
export interface CreateGeodesyWfsPictoStyleOptions {
    /** Style si `picto` absent ou non référencé. */
    fallbackStyle?: Style;
    /** Propriété feature portant le code picto (défaut : `picto`). */
    pictoProperty?: string;
    /** Échelle ol/style/Icon (défaut : 1). */
    iconScale?: number;
}
export declare const DEFAULT_GEODESY_WFS_POINT_STYLE: Style;
/** Style vectoriel WFS basé sur le champ `picto` et une table nom → URL. */
export declare function createGeodesyWfsPictoStyleFunction(pictoUrlMap: GeodesyPictoUrlMap, options?: CreateGeodesyWfsPictoStyleOptions): (feature: FeatureLike) => Style;
/** Résout le style d’une couche WFS (fixe ou fonction picto). */
export declare function resolveGeodesyWfsLayerStyle(pictoUrlMap: GeodesyPictoUrlMap | undefined, styleOverride?: StyleLike): StyleLike;
/** Style picto d’une entité WFS à partir du catalogue (via {@link GEODESY_LAYER_ID_PROPERTY}). */
export declare function createGeodesyWfsFeatureStyleResolver(catalog: GeodesyCatalog): StyleFunction;
/** Style des repères éclatés par {@link SelectCluster} (ol-ext). */
export declare function createGeodesyWfsExplodedClusterFeatureStyle(catalog: GeodesyCatalog): StyleFunction;
//# sourceMappingURL=geodesyWfsPictoStyle.d.ts.map