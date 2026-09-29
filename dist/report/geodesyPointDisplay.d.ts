import type { Coordinate } from 'ol/coordinate';
import type { GeodesyAttributeCatalog } from '../catalog/geodesyAttributeCatalog';
import { type GdpRgp2DispoState } from '../annex/geodesyGdpRgp2Dispo';
import type { GeodesyCatalog } from '../catalog/geodesyCatalog';
import type { GeodesyPictoUrlMap } from '../style/geodesyWfsPictoStyle';
import type { GeodesyWfsLayerId } from '../constants/wfs';
import type { GeodesyFeatureInfoHit } from '../wms/queryGeodesyAtCoordinate';
import { type GeodesyPointPhoto } from './geodesyPointPhotos';
export interface GeodesyPointAttribute {
    label: string;
    value: string;
    href?: string;
    imageUrl?: string;
    displayImageUrl?: string;
    /** Affiche le code `picto` en plus de l’image (identification / complétion du dictionnaire). */
    isPicto?: boolean;
    /** Indicateurs de disponibilité RGP (`1` vert, `0` rouge). */
    dispoStates?: readonly GdpRgp2DispoState[];
}
export interface GeodesyPointTitlePicto {
    value: string;
    imageUrl: string;
    displayImageUrl?: string;
    href?: string;
}
export interface GeodesyPointDisplay {
    title: string;
    /** Symbole IGN affiché avant le titre (champ `picto`). */
    titlePicto?: GeodesyPointTitlePicto;
    layerTitle: string;
    longitude: number;
    latitude: number;
    attributes: GeodesyPointAttribute[];
    photos: GeodesyPointPhoto[];
    comment: string;
}
export interface BuildGeodesyPointDisplayOptions {
    attributeCatalog?: GeodesyAttributeCatalog;
    /** Catalogue carte pour résoudre les attributs des couches annexes. */
    geodesyCatalog?: GeodesyCatalog;
    /**
     * Paramètre `source` des liens externes IGN.
     * Défaut package : {@link DEFAULT_GEODESY_EXTERNAL_URL_SOURCE}.
     */
    externalUrlSource?: string;
    /** Surcharge complète du transformateur d’URL (prioritaire sur {@link externalUrlSource}). */
    transformExternalUrl?: (url: string) => string;
    /** Tables `picto` → URL (défaut : {@link DEFAULT_GEODESY_WFS_PICTO_URL_MAPS}). */
    pictoUrlMaps?: Readonly<Partial<Record<GeodesyWfsLayerId, GeodesyPictoUrlMap>>>;
    /** Couche source pour résoudre le symbole `picto`. */
    layerId?: string;
}
export declare function extractGeodesyCoordinates(hit: GeodesyFeatureInfoHit, fallbackCoordinate: Coordinate): {
    longitude: number;
    latitude: number;
};
export declare function formatGeodesyHitAsComment(hit: GeodesyFeatureInfoHit, attributeCatalog?: GeodesyAttributeCatalog, options?: Pick<BuildGeodesyPointDisplayOptions, 'layerId'>): string;
export declare function buildGeodesyPointDisplay(hit: GeodesyFeatureInfoHit, fallbackCoordinate: Coordinate, options?: BuildGeodesyPointDisplayOptions): GeodesyPointDisplay;
export interface GeodesyPointTitleDisplay {
    title: string;
    titlePicto?: GeodesyPointTitlePicto;
}
/**
 * Titre + symbole d’un repère à partir de ses seules propriétés WFS (sans feature OL),
 * ex. pour un repère relu par identifiant ({@link fetchGeodesyWfsPointsByRef}).
 */
export declare function buildGeodesyPointTitleDisplay(properties: Record<string, unknown>, options?: BuildGeodesyPointDisplayOptions): GeodesyPointTitleDisplay;
export declare function formatMapCoordinateSubtitle(longitude: number, latitude: number): string;
//# sourceMappingURL=geodesyPointDisplay.d.ts.map