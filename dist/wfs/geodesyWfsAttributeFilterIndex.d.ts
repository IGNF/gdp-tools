import type Feature from 'ol/Feature';
import type Geometry from 'ol/geom/Geometry';
import type VectorSource from 'ol/source/Vector';
import type { GeodesyWfsLayerId } from '../constants/wfs';
import type { GeodesyWfsAttributeFilterAuxiliaryProperties } from '../constants/wfsAttributeFilters';
/** Indexe les attributs des couches WFS auxiliaires par identifiant métier (`id`, `no`). */
export declare function buildGeodesyWfsAttributeFilterAuxiliaryProperties(layers: ReadonlyArray<{
    layerId: GeodesyWfsLayerId;
    source: VectorSource<Feature<Geometry>>;
}>): GeodesyWfsAttributeFilterAuxiliaryProperties;
//# sourceMappingURL=geodesyWfsAttributeFilterIndex.d.ts.map