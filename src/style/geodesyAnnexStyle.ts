import Feature from 'ol/Feature';
import type { FeatureLike } from 'ol/Feature';
import Icon from 'ol/style/Icon';
import Style, { type StyleFunction } from 'ol/style/Style';

import { hasGdpRgp2DispoData, parseGdpRgp2DispoStates } from '../annex/geodesyGdpRgp2Dispo';

type GdpRgp2AvailabilityLevel = 'full' | 'partial' | 'none' | 'down';

const AVAILABILITY_COLORS: Record<GdpRgp2AvailabilityLevel, string> = {
  full: '#26a581',
  partial: '#f18345',
  none: '#e86f4a',
  down: '#6c6661',
};

function resolveGdpRgp2AvailabilityLevel(dispo: unknown): GdpRgp2AvailabilityLevel {
  if (!hasGdpRgp2DispoData(dispo)) {
    return 'down';
  }

  const states = parseGdpRgp2DispoStates(dispo);
  const availableCount = states.filter((state) => state === 'available').length;

  if (availableCount === 0) {
    return 'none';
  }

  return availableCount === states.length ? 'full' : 'partial';
}

/** Pastille circulaire colorée (sans bordure), encodée en SVG data-URI, pour une couleur donnée. */
function buildDiscMarkerSvg(color: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
<circle cx="14" cy="14" r="6.5" fill="${color}"/>
</svg>`;
}

function buildDiscMarkerStyle(color: string): Style {
  const src = `data:image/svg+xml;utf8,${encodeURIComponent(buildDiscMarkerSvg(color))}`;

  return new Style({
    image: new Icon({
      src,
      anchor: [0.5, 0.5],
    }),
  });
}

const MARKER_STYLES: Record<GdpRgp2AvailabilityLevel, Style> = {
  full: buildDiscMarkerStyle(AVAILABILITY_COLORS.full),
  partial: buildDiscMarkerStyle(AVAILABILITY_COLORS.partial),
  none: buildDiscMarkerStyle(AVAILABILITY_COLORS.none),
  down: buildDiscMarkerStyle(AVAILABILITY_COLORS.down),
};

/**
 * Style des stations RGP : pastille colorée selon la disponibilité des données (`dispo`) —
 * vert si totale, orange si partielle, rouge si aucune, gris si la station est en panne
 * (`dispo` absent/invalide).
 */
export function createGeodesyGdpRgp2StyleFunction(): StyleFunction {
  return (feature: FeatureLike) => {
    if (!(feature instanceof Feature)) {
      return MARKER_STYLES.down;
    }

    return MARKER_STYLES[resolveGdpRgp2AvailabilityLevel(feature.get('dispo'))];
  };
}
