import type { GeodesyCatalog } from '../catalog/geodesyCatalog';
import { type GeodesyWfsLayerId } from '../constants/wfs';
/**
 * Référence d’un repère : `id` n’est unique qu’au sein d’un `domaine`
 * (ex. `id=1000` existe en `rsge`, `rsgf` et `rsgo`).
 */
export interface GeodesyPointRef {
    id: string;
    domaine: string;
}
export interface FetchGeodesyWfsPointsByRefOptions {
    catalog: GeodesyCatalog;
    refs: readonly GeodesyPointRef[];
    /** Couche WFS interrogée (défaut : `DATA_GEOD`, flux public). */
    layerId?: GeodesyWfsLayerId;
    /** Propriétés à renvoyer (toutes si omis). */
    propertyNames?: readonly string[];
    timeoutMs?: number;
}
/** Clé stable d’un repère (`domaine:id`), utilisée pour indexer les résultats. */
export declare function geodesyPointRefKey(ref: GeodesyPointRef): string;
/**
 * Relit des repères par identifiant (`id` + `domaine`) — ex. pour enrichir une liste de
 * signalements qui ne stocke que ces deux champs. Résultats mis en cache mémoire.
 *
 * @returns propriétés indexées par {@link geodesyPointRefKey} ; les repères introuvables sont absents.
 */
export declare function fetchGeodesyWfsPointsByRef(options: FetchGeodesyWfsPointsByRefOptions): Promise<Map<string, Record<string, unknown>>>;
//# sourceMappingURL=fetchGeodesyWfsPointsByRef.d.ts.map