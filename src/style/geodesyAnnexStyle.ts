import Feature from 'ol/Feature';
import type { FeatureLike } from 'ol/Feature';
import CircleStyle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Style, { type StyleFunction } from 'ol/style/Style';

import { isGdpRgp2StationAvailable } from '../annex/geodesyGdpRgp2Dispo';

const OPERATIONAL_STYLE = new Style({
  image: new CircleStyle({
    radius: 6,
    fill: new Fill({ color: 'rgba(38, 165, 129, 0.9)' }),
    stroke: new Stroke({ color: '#ffffff', width: 1.5 }),
  }),
});

const FAILURE_STYLE = new Style({
  image: new CircleStyle({
    radius: 6,
    fill: new Fill({ color: 'rgba(231, 76, 60, 0.9)' }),
    stroke: new Stroke({ color: '#ffffff', width: 1.5 }),
  }),
});

function isGdpRgp2Failure(feature: Feature): boolean {
  return !isGdpRgp2StationAvailable(feature.get('dispo'));
}

/** Style des stations RGP : vert si `dispo` entièrement à `1`, rouge sinon (`0`, `null`…). */
export function createGeodesyGdpRgp2StyleFunction(): StyleFunction {
  return (feature: FeatureLike) => {
    if (!(feature instanceof Feature)) {
      return OPERATIONAL_STYLE;
    }

    return isGdpRgp2Failure(feature) ? FAILURE_STYLE : OPERATIONAL_STYLE;
  };
}
