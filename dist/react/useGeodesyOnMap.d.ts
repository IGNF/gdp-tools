import type Map from 'ol/Map';
import { type GeodesyCatalog, type GeodesyCatalogOptions, type GeodesyLayerId } from '../catalog/geodesyCatalog';
import { type GeodesyWfsAttributeFilterValues } from '../constants/wfsAttributeFilters';
import type { GeodesyWmsLayerDefinition } from '../constants/wms';
import type { GeodesyAnnexLayerDefinition } from '../constants/annex';
import type { GeodesyWfsLayerDefinition } from '../constants/wfs';
import type { GeodesyWfsDomainLayerDefinition } from '../constants/wfsDomainLayers';
import { type GeodesyLayerVisibility } from '../geodesyLayerVisibility';
import { type RegisterGeodesyOnMapOptions } from '../registerGeodesyOnMap';
export interface UseGeodesyOnMapOptions extends GeodesyCatalogOptions {
    /** Catalogue résolu (prioritaire sur layerIds / uiLayerIds). */
    catalog?: GeodesyCatalog;
    /** Couches actives au montage (par défaut : RBF seul). */
    initialActive?: GeodesyLayerId[];
    /** Valeurs initiales des filtres attributs WFS. */
    initialWfsAttributeFilterValues?: GeodesyWfsAttributeFilterValues;
    /** Popup au clic (désactiver si un autre handler gère le singleclick). */
    popup?: RegisterGeodesyOnMapOptions['popup'];
}
export interface UseGeodesyOnMapResult {
    catalog: GeodesyCatalog;
    /** Couches WMS proposées dans les sélecteurs UI (sans couche attributs). */
    uiLayers: readonly GeodesyWmsLayerDefinition[];
    /** Couches WFS proposées dans les sélecteurs UI (ou filtres domaine). */
    uiWfsLayers: readonly (GeodesyWfsLayerDefinition | GeodesyWfsDomainLayerDefinition)[];
    /** Couches annexes proposées dans les sélecteurs UI. */
    uiAnnexLayers: readonly GeodesyAnnexLayerDefinition[];
    visibility: GeodesyLayerVisibility;
    wfsAttributeFilterValues: GeodesyWfsAttributeFilterValues;
    setWfsAttributeFilterValues: (values: GeodesyWfsAttributeFilterValues) => void;
    clearWfsAttributeFilterValues: () => void;
    toggleLayer: (layerId: GeodesyLayerId) => void;
    setVisibility: (visibility: GeodesyLayerVisibility) => void;
    /** Libellés courts des couches visibles (ex. pour une légende). */
    activeLabels: string[];
}
/** Enregistre les couches géodésie sur la carte et gère leur visibilité. */
export declare function useGeodesyOnMap(map: Map | null, options?: UseGeodesyOnMapOptions): UseGeodesyOnMapResult;
//# sourceMappingURL=useGeodesyOnMap.d.ts.map