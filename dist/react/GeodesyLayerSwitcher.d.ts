import { type GeodesyCatalog } from '../catalog/geodesyCatalog';
import type { GeodesyLayerVisibility } from '../geodesyLayerVisibility';
import type { GeodesyWmsLayerId } from '../constants/wms';
export interface GeodesyLayerSwitcherProps {
    visibility: GeodesyLayerVisibility;
    onToggle: (layerId: GeodesyWmsLayerId) => void;
    /** Catalogue des couches (catalogue IGN complet par défaut). */
    catalog?: GeodesyCatalog;
    groupLabel?: string;
    className?: string;
}
/** Sélecteur des couches WMS géodésie (RBF, RDF, RN, GRAV…). */
export declare function GeodesyLayerSwitcher({ visibility, onToggle, catalog, groupLabel, className, }: GeodesyLayerSwitcherProps): import("react").JSX.Element;
//# sourceMappingURL=GeodesyLayerSwitcher.d.ts.map