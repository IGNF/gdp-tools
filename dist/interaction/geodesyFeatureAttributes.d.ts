import { type GeodesyAttributeCatalog } from '../catalog/geodesyAttributeCatalog';
import { getGeodesyAttributeLabel } from '../constants/geodesyAttributeLabels';
/** Champs techniques ou non affichables dans les popups / fiches repère. */
export declare const EXCLUDED_GEODESY_ATTRIBUTE_KEYS: readonly ["geometry", "boundedBy", "coordinate"];
export declare function isExcludedGeodesyAttributeKey(key: string): boolean;
export { getGeodesyAttributeLabel };
/** Alias conservé pour compatibilité. */
export declare function formatGeodesyAttributeLabel(key: string): string;
/** Valeur absente ou chaîne vide (espaces ignorés). */
export declare function isEmptyGeodesyAttributeValue(value: unknown): boolean;
export declare function isGeodesyAttributeUrl(key: string, value: unknown): boolean;
export declare function isGeodesyAttributePicto(key: string): boolean;
/** Champs *_url photo / croquis géodésie (hors PDF et autres liens). */
export declare function isGeodesyAttributeImageUrl(key: string, value: unknown): boolean;
export declare function formatGeodesyAttributeUrlHtml(value: unknown): string;
/** Miniature cliquable pour les URLs d’images dans la popup ol-ext. */
export declare function formatGeodesyAttributeImageUrlHtml(value: unknown, label?: string): string;
export declare function getGeodesyScalarPropertyEntries(properties: Record<string, unknown>, attributeCatalog?: GeodesyAttributeCatalog): Array<[string, string]>;
//# sourceMappingURL=geodesyFeatureAttributes.d.ts.map