import Feature from 'ol/Feature';
import type Geometry from 'ol/geom/Geometry';
import type { GeodesyWfsLayerId } from '../constants/wfs';
/** Identifiant métier d’une entité WFS (`id`, `no`, …). */
export declare function readGeodesyWfsBusinessId(properties: Record<string, unknown>): string | undefined;
/**
 * Identifiant OpenLayers stable pour éviter les doublons avec la stratégie bbox.
 * OpenLayers ignore les features déjà présentes si {@link Feature#getId} est identique.
 */
export declare function assignGeodesyWfsFeatureId(feature: Feature<Geometry>, layerId: GeodesyWfsLayerId): void;
//# sourceMappingURL=geodesyWfsFeatureId.d.ts.map