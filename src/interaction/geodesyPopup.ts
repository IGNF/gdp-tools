import Feature from 'ol/Feature';
import type Geometry from 'ol/geom/Geometry';
import type Map from 'ol/Map';
import type { MapBrowserEvent } from 'ol';
import { listen, unlistenByKey } from 'ol/events';
import OverlayPopup from 'ol-ext/overlay/Popup.js';
import OverlayPopupFeature from 'ol-ext/overlay/PopupFeature.js';

import {
  prefetchGeodesyImagesFromHits,
  rewriteGeodesyHtmlSnippetImages,
} from '../cache/geodesyImageCache';
import { getGeodesyCatalogFromMap } from '../catalog/getGeodesyCatalogFromMap';
import { buildGeodesyPopupTemplate } from './geodesyPopupTemplate';
import { queryGeodesyAtClick } from './queryGeodesyAtClick';

import 'ol-ext/overlay/Popup.css';
import '../styles/geodesyPopup.css';

const POPUP_CLASS = 'default anim geodesy-ec';

export interface RegisterGeodesyPopupOptions {
  /** Désactiver l’info-bulle au clic. */
  disabled?: boolean;
}

/** Ajoute l’info-bulle géodésie (ol-ext PopupFeature, style EspaceCo). */
export function registerGeodesyPopup(
  map: Map,
  options: RegisterGeodesyPopupOptions = {},
): () => void {
  if (options.disabled) {
    return () => undefined;
  }

  const popup = new OverlayPopupFeature({
    popupClass: POPUP_CLASS,
    closeBox: true,
    positioning: 'auto',
    template: (feature: Feature<Geometry>) => {
      const catalog = getGeodesyCatalogFromMap(map);
      return buildGeodesyPopupTemplate(feature, catalog.attributes, {
        pictoUrlMaps: catalog.wfsPictoUrlMaps,
      });
    },
  });

  map.addOverlay(popup);

  const htmlPopup = new OverlayPopup({
    popupClass: POPUP_CLASS,
    closeBox: true,
    positioning: 'auto',
  });
  map.addOverlay(htmlPopup);

  let queryGeneration = 0;

  const clickKey = listen(map, 'singleclick', (event) => {
    const mapEvent = event as MapBrowserEvent<PointerEvent>;
    void (async () => {
      const generation = ++queryGeneration;
      popup.hide();
      htmlPopup.hide();

      const hits = await queryGeodesyAtClick(map, mapEvent.coordinate, mapEvent.pixel);
      if (generation !== queryGeneration) {
        return;
      }

      if (hits.length === 0) {
        return;
      }

      await prefetchGeodesyImagesFromHits(hits);

      const first = hits[0];
      const htmlSnippet = first.feature.get('_htmlSnippet') as string | undefined;

      if (htmlSnippet) {
        const cachedHtmlSnippet = await rewriteGeodesyHtmlSnippetImages(htmlSnippet);
        htmlPopup.show(
          mapEvent.coordinate,
          `<div class="geodesy-popup-html">${cachedHtmlSnippet}</div>`,
        );
        return;
      }

      popup.show(
        mapEvent.coordinate,
        hits.map((hit) => hit.feature),
      );
    })();
  });

  return () => {
    queryGeneration += 1;
    unlistenByKey(clickKey);
    map.removeOverlay(popup);
    map.removeOverlay(htmlPopup);
  };
}
