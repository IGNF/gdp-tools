import type { GeodesyAnnexLayerId } from '../constants/annex';
import type { GeodesyFeatureInfoHit } from '../wms/queryGeodesyAtCoordinate';
import { type GeodesyAttributeCatalog } from './geodesyAttributeCatalog';
import type { GeodesyCatalog } from './geodesyCatalog';
/** Catalogue d’attributs adapté au type de couche cliquée (annexe ou défaut). */
export declare function resolveGeodesyHitAttributeCatalog(catalog: GeodesyCatalog, hit: GeodesyFeatureInfoHit, fallback?: GeodesyAttributeCatalog): GeodesyAttributeCatalog;
export declare function isGeodesyAnnexLayerId(catalog: GeodesyCatalog, layerId: string): layerId is GeodesyAnnexLayerId;
//# sourceMappingURL=resolveGeodesyHitAttributeCatalog.d.ts.map