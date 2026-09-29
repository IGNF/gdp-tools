import type { GeodesyPointAttribute } from '../report/geodesyPointDisplay';
export interface GeodesyPointDetailsProps {
    layerTitle: string;
    longitude: number;
    latitude: number;
    attributes: GeodesyPointAttribute[];
    /** Affiche la ligne réseau / coordonnées (défaut : true). */
    showMeta?: boolean;
}
/** Fiche point géodésique (attributs + photos IGN). */
export declare function GeodesyPointDetails({ layerTitle, longitude, latitude, attributes, showMeta, }: GeodesyPointDetailsProps): import("react").JSX.Element;
//# sourceMappingURL=GeodesyPointDetails.d.ts.map