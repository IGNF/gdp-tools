import Feature from 'ol/Feature';
import type Geometry from 'ol/geom/Geometry';
import type { GeodesyCatalog } from '../catalog/geodesyCatalog';
import type { GeodesyAnnexLayerDefinition } from '../constants/annex';
/** Vide le cache mémoire des flux annexes (tout ou une définition précise). */
export declare function clearGeodesyAnnexFeaturesCache(definition?: GeodesyAnnexLayerDefinition, catalog?: GeodesyCatalog): void;
/** Date du dernier chargement réussi d’un flux annexe (null si jamais chargé). */
export declare function getGeodesyAnnexFeaturesLastLoadedAt(options: Pick<LoadGeodesyAnnexFeaturesOptions, 'definition' | 'catalog'>): Date | null;
export interface LoadGeodesyAnnexFeaturesOptions {
    catalog?: GeodesyCatalog;
    definition: GeodesyAnnexLayerDefinition;
}
/** Charge les entités d’un flux annexe (mise en cache par URL). */
export declare function loadGeodesyAnnexFeatures(options: LoadGeodesyAnnexFeaturesOptions): Promise<Feature<Geometry>[]>;
//# sourceMappingURL=loadGeodesyAnnexFeatures.d.ts.map