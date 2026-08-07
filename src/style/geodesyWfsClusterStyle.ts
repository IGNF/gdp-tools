import CircleStyle from 'ol/style/Circle';
import Feature from 'ol/Feature';
import type Geometry from 'ol/geom/Geometry';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Style, {
  type StyleFunction,
  type StyleLike,
} from 'ol/style/Style';
import Text from 'ol/style/Text';

import { getGeodesyWfsClusterMemberCount, getGeodesyWfsClusterMembers } from '../wfs/geodesyWfsLayerUtils';

/** Style d’un cluster WFS (cercle rayonné + effectif, aligné sur l’ancien Géodésie de poche). */
export interface GeodesyWfsClusterStyleOptions {
  /** Couleur fixe (prioritaire sur les seuils). */
  fillColor?: string;
  /** Couleur des petits clusters — effectif ≤ mediumClusterThreshold (défaut : vert). */
  smallClusterColor?: string;
  /** Couleur des clusters moyens (défaut : orange). */
  mediumClusterColor?: string;
  /** Couleur des grands clusters (défaut : rouge). */
  largeClusterColor?: string;
  /** Seuil orange strictement supérieur (défaut : 8). */
  mediumClusterThreshold?: number;
  /** Seuil rouge strictement supérieur (défaut : 25). */
  largeClusterThreshold?: number;
  strokeColor?: string;
  textColor?: string;
  /** Rayon minimal du disque (défaut : 8). */
  minRadius?: number;
  /** Rayon maximal du disque (défaut : 20). */
  maxRadius?: number;
  /** Facteur de taille selon l’effectif (défaut : 0,75). */
  radiusScale?: number;
}

const DEFAULT_CLUSTER_STYLE_OPTIONS = {
  strokeColor: '#ffffff',
  textColor: '#ffffff',
  minRadius: 8,
  maxRadius: 20,
  radiusScale: 0.75,
  smallClusterColor: 'rgb(0, 128, 0)',
  mediumClusterColor: 'rgb(255, 128, 0)',
  largeClusterColor: 'rgb(192, 0, 0)',
  mediumClusterThreshold: 8,
  largeClusterThreshold: 25,
} as const satisfies Omit<GeodesyWfsClusterStyleOptions, 'fillColor'>;

type ResolvedClusterStyleOptions = {
  fillColor?: string;
  smallClusterColor: string;
  mediumClusterColor: string;
  largeClusterColor: string;
  mediumClusterThreshold: number;
  largeClusterThreshold: number;
  strokeColor: string;
  textColor: string;
  minRadius: number;
  maxRadius: number;
  radiusScale: number;
};

function parseRgbaColor(color: string): [number, number, number, number] | null {
  const match = color
    .trim()
    .match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)$/i);
  if (!match) {
    return null;
  }

  return [
    Number(match[1]),
    Number(match[2]),
    Number(match[3]),
    match[4] !== undefined ? Number(match[4]) : 1,
  ];
}

function formatRgbaColor(r: number, g: number, b: number, a: number): string {
  return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${a.toFixed(2)})`;
}

function parseRgbTriplet(
  color: string,
  fallback: [number, number, number],
): [number, number, number] {
  const parsed = parseRgbaColor(color);
  if (!parsed) {
    return fallback;
  }

  return [parsed[0], parsed[1], parsed[2]];
}

function resolveClusterRgb(
  size: number,
  options: ResolvedClusterStyleOptions,
): [number, number, number] {
  if (size > options.largeClusterThreshold) {
    return parseRgbTriplet(options.largeClusterColor, [192, 0, 0]);
  }

  if (size > options.mediumClusterThreshold) {
    return parseRgbTriplet(options.mediumClusterColor, [255, 128, 0]);
  }

  return parseRgbTriplet(options.smallClusterColor, [0, 128, 0]);
}

function resolveClusterFillColor(size: number, options: ResolvedClusterStyleOptions): string {
  if (options.fillColor) {
    return options.fillColor;
  }

  const [r, g, b] = resolveClusterRgb(size, options);
  return formatRgbaColor(r, g, b, 1);
}

function resolveClusterRadius(size: number, options: ResolvedClusterStyleOptions): number {
  return Math.max(
    options.minRadius,
    Math.min(size * options.radiusScale, options.maxRadius),
  );
}

const CLUSTER_RAY_COUNT = 6;
const CLUSTER_RAY_STROKE_WIDTH = 15;

function createClusterRayStroke(fillColor: string, radius: number): Stroke {
  const rgba = parseRgbaColor(fillColor);
  const rayColor = rgba
    ? formatRgbaColor(rgba[0], rgba[1], rgba[2], 0.5)
    : fillColor;
  const dashLength = (2 * Math.PI * radius) / CLUSTER_RAY_COUNT;

  return new Stroke({
    color: rayColor,
    width: CLUSTER_RAY_STROKE_WIDTH,
    lineDash: [0, dashLength, dashLength, dashLength, dashLength, dashLength, dashLength],
    lineCap: 'butt',
  });
}

function createClusterBadgeStyle(
  size: number,
  options: ResolvedClusterStyleOptions,
): Style {
  const radius = resolveClusterRadius(size, options);
  const fillColor = resolveClusterFillColor(size, options);

  return new Style({
    image: new CircleStyle({
      radius,
      fill: new Fill({ color: fillColor }),
      stroke: createClusterRayStroke(fillColor, radius),
    }),
    text: new Text({
      text: String(size),
      fill: new Fill({ color: options.textColor }),
      stroke: new Stroke({ color: 'rgba(0, 0, 0, 0.35)', width: 2 }),
    }),
  });
}

/**
 * Style combiné : picto pour un point seul, cluster rayonné pour un amas.
 * Taille et couleurs alignées sur l’ancien Géodésie de poche (`vieux-gdp/src/js/map/style2.js`).
 */
export function createGeodesyWfsClusterStyleFunction(
  pointStyle: StyleFunction,
  clusterStyleOptions: GeodesyWfsClusterStyleOptions = {},
): StyleFunction {
  const resolvedOptions: ResolvedClusterStyleOptions = {
    ...DEFAULT_CLUSTER_STYLE_OPTIONS,
    ...clusterStyleOptions,
  };
  const badgeStyleCache = new Map<number, Style>();

  return (feature, resolution) => {
    const clusterFeature = feature as Feature<Geometry>;
    const size = getGeodesyWfsClusterMemberCount(clusterFeature);

    if (size > 1) {
      let badgeStyle = badgeStyleCache.get(size);
      if (!badgeStyle) {
        badgeStyle = createClusterBadgeStyle(size, resolvedOptions);
        badgeStyleCache.set(size, badgeStyle);
      }
      return badgeStyle;
    }

    const innerFeature = getGeodesyWfsClusterMembers(clusterFeature)[0] ?? clusterFeature;
    return pointStyle(innerFeature, resolution);
  };
}

/** Fusionne un style point et une fonction cluster en StyleLike unique. */
export function wrapGeodesyWfsStyleForCluster(
  pointStyle: StyleLike,
  clusterStyleOptions?: GeodesyWfsClusterStyleOptions,
): StyleFunction {
  const pointStyleFn: StyleFunction =
    typeof pointStyle === 'function'
      ? pointStyle
      : () => pointStyle as Style;

  return createGeodesyWfsClusterStyleFunction(pointStyleFn, clusterStyleOptions);
}
