import type Feature from 'ol/Feature';
import type Geometry from 'ol/geom/Geometry';
import { type GeodesyAttributeCatalog } from '../catalog/geodesyAttributeCatalog';
import type { GeodesyWfsLayerId } from '../constants/wfs';
import type { GeodesyPictoUrlMap } from '../style/geodesyWfsPictoStyle';
export interface BuildGeodesyPopupTemplateOptions {
    pictoUrlMaps?: Readonly<Partial<Record<GeodesyWfsLayerId, GeodesyPictoUrlMap>>>;
}
export interface GeodesyPopupAttributeTemplate {
    title: string;
    format?: (value: unknown, feature: Feature<Geometry>) => string;
    visible?: boolean | ((feature: Feature<Geometry>, value: unknown) => boolean);
}
export interface GeodesyPopupTemplate {
    title: string;
    attributes: Record<string, GeodesyPopupAttributeTemplate>;
}
/** Gabarit popup aligné sur ol-ext PopupFeature (comme EspaceCo / ol-ext « default »). */
export declare function buildGeodesyPopupTemplate(feature: Feature<Geometry>, attributeCatalog?: GeodesyAttributeCatalog, options?: BuildGeodesyPopupTemplateOptions): GeodesyPopupTemplate;
//# sourceMappingURL=geodesyPopupTemplate.d.ts.map