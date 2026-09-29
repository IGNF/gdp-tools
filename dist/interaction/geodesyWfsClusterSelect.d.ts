import type Map from 'ol/Map';
import type { GeodesyCatalog } from '../catalog/geodesyCatalog';
import { GeodesySelectCluster } from './geodesySelectCluster';
export declare function getGeodesyWfsClusterSelectInteraction(map: Map): GeodesySelectCluster | null;
export declare function clearGeodesyWfsClusterExplosion(map: Map): void;
/** Interaction ol-ext : éclate un cluster WFS au clic pour choisir un repère. */
export declare function registerGeodesyWfsClusterSelect(map: Map, catalog: GeodesyCatalog): () => void;
//# sourceMappingURL=geodesyWfsClusterSelect.d.ts.map