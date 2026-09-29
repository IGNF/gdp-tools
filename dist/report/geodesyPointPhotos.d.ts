import type { GeodesyAttributeCatalog } from '../catalog/geodesyAttributeCatalog';
export interface GeodesyPointPhoto {
    key: string;
    label: string;
    url: string;
    displayUrl: string;
}
/** Extrait les photos officielles du repère (champs `*_url` image). */
export declare function collectGeodesyPointPhotos(properties: Record<string, unknown>, attributeCatalog?: GeodesyAttributeCatalog): GeodesyPointPhoto[];
//# sourceMappingURL=geodesyPointPhotos.d.ts.map