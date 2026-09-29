import { buildGeodesyPointDisplay, type BuildGeodesyPointDisplayOptions } from '../report/geodesyPointDisplay';
import { buildGeodesyPointReportContext } from '../report/geodesyPointReportContext';
import { type QueryGeodesyAtClickOptions } from '../interaction/queryGeodesyAtClick';
import type Map from 'ol/Map';
import type { Coordinate } from 'ol/coordinate';
export interface GeodesyCoordinateClick {
    longitude: number;
    latitude: number;
    subtitle: string;
}
export type GeodesyMapClickResult = {
    kind: 'geodesy';
    display: ReturnType<typeof buildGeodesyPointDisplay>;
    reportContext: ReturnType<typeof buildGeodesyPointReportContext>;
} | {
    kind: 'coordinate';
    coordinate: GeodesyCoordinateClick;
};
export interface UseGeodesyMapClickOptions extends BuildGeodesyPointDisplayOptions {
    enabled?: boolean;
    isMapReady?: boolean;
    query?: QueryGeodesyAtClickOptions;
}
/** Clic carte headless : point géodésique ou coordonnée libre (sans UI ni navigation). */
export declare function useGeodesyMapClick(map: Map | null, options?: UseGeodesyMapClickOptions): {
    pendingClick: GeodesyMapClickResult | null;
    clearPendingClick: () => void;
    /** Rejoue la résolution géodésique du clic à une coordonnée donnée (sans pixel/événement réel) ;
     *  résout à `true` si un point géodésique a été trouvé et affiché. */
    openAtCoordinate: (coordinate: Coordinate) => Promise<boolean>;
};
//# sourceMappingURL=useGeodesyMapClick.d.ts.map