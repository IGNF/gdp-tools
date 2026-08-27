import Feature from 'ol/Feature';
import type { FeatureLike } from 'ol/Feature';
import Icon from 'ol/style/Icon';
import Style, { type StyleFunction } from 'ol/style/Style';

import { parseGdpRgp2DispoStates } from '../annex/geodesyGdpRgp2Dispo';

type GdpRgp2AvailabilityLevel = 'full' | 'partial' | 'none';

const AVAILABILITY_COLORS: Record<GdpRgp2AvailabilityLevel, string> = {
  full: '#26a581',
  partial: '#f18345',
  none: '#e86f4a',
};

function resolveGdpRgp2AvailabilityLevel(dispo: unknown): GdpRgp2AvailabilityLevel {
  const states = parseGdpRgp2DispoStates(dispo);
  const availableCount = states.filter((state) => state === 'available').length;

  if (availableCount === 0) {
    return 'none';
  }

  return availableCount === states.length ? 'full' : 'partial';
}

/** Picto satellite (badge circulaire coloré) encodé en SVG data-URI, pour une couleur donnée. */
function buildSatelliteMarkerSvg(color: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
<circle cx="14" cy="14" r="11" fill="${color}" stroke="#ffffff" stroke-width="2"/>
<g fill="#ffffff">
<rect x="4" y="16.4" width="5.5" height="4.5" rx="0.8"/>
<rect x="18.5" y="16.4" width="5.5" height="4.5" rx="0.8"/>
<rect x="9.5" y="17.6" width="1.2" height="2.1"/>
<rect x="17.3" y="17.6" width="1.2" height="2.1"/>
<rect x="10.7" y="14.4" width="6.6" height="6.6" rx="1.2"/>
<rect x="13.2" y="8.9" width="1.6" height="5.8"/>
<circle cx="14" cy="8.6" r="1.6"/>
</g>
</svg>`;
}

function buildSatelliteMarkerStyle(color: string): Style {
  const src = `data:image/svg+xml;utf8,${encodeURIComponent(buildSatelliteMarkerSvg(color))}`;

  return new Style({
    image: new Icon({
      src,
      anchor: [0.5, 0.5],
    }),
  });
}

const MARKER_STYLES: Record<GdpRgp2AvailabilityLevel, Style> = {
  full: buildSatelliteMarkerStyle(AVAILABILITY_COLORS.full),
  partial: buildSatelliteMarkerStyle(AVAILABILITY_COLORS.partial),
  none: buildSatelliteMarkerStyle(AVAILABILITY_COLORS.none),
};

/**
 * Style des stations RGP : icône satellite colorée selon la disponibilité des données
 * (`dispo`) — vert si totale, orange si partielle, rouge si aucune (ou `dispo` invalide/absent).
 */
export function createGeodesyGdpRgp2StyleFunction(): StyleFunction {
  return (feature: FeatureLike) => {
    if (!(feature instanceof Feature)) {
      return MARKER_STYLES.none;
    }

    return MARKER_STYLES[resolveGdpRgp2AvailabilityLevel(feature.get('dispo'))];
  };
}
