declare module 'ol-ext/overlay/Popup.js' {
  import type Overlay from 'ol/Overlay';

  interface PopupOptions {
    popupClass?: string;
    closeBox?: boolean;
    positioning?: string;
  }

  export default class Popup extends Overlay {
    constructor(options?: PopupOptions);
    show(coordinate: import('ol/coordinate').Coordinate, html: string): void;
    hide(): void;
  }
}

declare module 'ol-ext/overlay/PopupFeature.js' {
  import type Feature from 'ol/Feature';
  import type Geometry from 'ol/geom/Geometry';
  import type { Coordinate } from 'ol/coordinate';
  import Popup from 'ol-ext/overlay/Popup.js';
  import type { GeodesyPopupTemplate } from './interaction/geodesyPopupTemplate';

  interface PopupFeatureOptions {
    popupClass?: string;
    closeBox?: boolean;
    positioning?: string;
    template?: (feature: Feature<Geometry>) => GeodesyPopupTemplate;
  }

  export default class PopupFeature extends Popup {
    constructor(options?: PopupFeatureOptions);
    show(
      coordinate: Coordinate,
      features: Feature<Geometry> | Feature<Geometry>[],
    ): void;
    hide(): void;
  }
}
