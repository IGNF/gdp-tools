import { type GeodesyCatalog } from '../catalog/geodesyCatalog';
import { type GeodesyWmsLayerId } from '../constants/wms';
import type { GeodesyFeatureInfoHit } from './queryGeodesyAtCoordinate';
/** Retourne les propriétés GEODESIE_DATA sans fusionner les attributs des couches réseau. */
export declare function mergeGeodesyFeatureProperties(_networkProperties: Record<string, unknown>, dataProperties: Record<string, unknown>): Record<string, unknown>;
/** Déduit le libellé réseau (RBF, RDF…) à partir de `groupe_type` dans GEODESIE_DATA. */
export declare function resolveGeodesyLayerTitle(properties: Record<string, unknown>, fallback?: string, catalog?: GeodesyCatalog): string;
/** Vérifie si le repère correspond à au moins une couche réseau visible sur la carte. */
export declare function featureMatchesVisibleNetworkLayers(properties: Record<string, unknown>, visibleNetworkLayerIds: readonly GeodesyWmsLayerId[], catalog?: GeodesyCatalog): boolean;
/**
 * Normalise les hits GetFeatureInfo : attributs issus de GEODESIE_DATA uniquement.
 * Conserve éventuellement l’identité réseau (titre) sans réutiliser ses attributs.
 */
export declare function mergeGeodesyFeatureHits(hits: GeodesyFeatureInfoHit[], catalog?: GeodesyCatalog): GeodesyFeatureInfoHit[];
//# sourceMappingURL=mergeGeodesyFeatureHits.d.ts.map