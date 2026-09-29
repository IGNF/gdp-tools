import type Map from 'ol/Map';
import 'ol-ext/overlay/Popup.css';
import '../styles/geodesyPopup.css';
export interface RegisterGeodesyPopupOptions {
    /** Désactiver l’info-bulle au clic. */
    disabled?: boolean;
}
/** Ajoute l’info-bulle géodésie (ol-ext PopupFeature, style EspaceCo). */
export declare function registerGeodesyPopup(map: Map, options?: RegisterGeodesyPopupOptions): () => void;
//# sourceMappingURL=geodesyPopup.d.ts.map