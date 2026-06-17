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

/** Style d’un cluster WFS (cercle + effectif). */
export interface GeodesyWfsClusterStyleOptions {
  /** Couleur fixe (prioritaire sur le dégradé). */
  fillColor?: string;
  /** Couleur des petits clusters (défaut : vert). */
  minClusterColor?: string;
  /** Couleur des grands clusters (défaut : rouge). */
  maxClusterColor?: string;
  /** Effectif à partir duquel la pastille est rouge (défaut : 12). */
  gradientMaxCount?: number;
  strokeColor?: string;
  textColor?: string;
  /** Rayon minimal du cercle cluster (défaut : 12). */
  minRadius?: number;
  /** Rayon maximal du cercle cluster (défaut : 22). */
  maxRadius?: number;
}

const DEFAULT_CLUSTER_STYLE_OPTIONS = {
  strokeColor: '#ffffff',
  textColor: '#ffffff',
  minRadius: 12,
  maxRadius: 22,
  minClusterColor: 'rgba(38, 165, 129, 0.88)',
  maxClusterColor: 'rgba(220, 53, 69, 0.88)',
  gradientMaxCount: 12,
} as const satisfies Omit<GeodesyWfsClusterStyleOptions, 'fillColor'>;

type ResolvedClusterStyleOptions = {
  fillColor?: string;
  minClusterColor: string;
  maxClusterColor: string;
  gradientMaxCount: number;
  strokeColor: string;
  textColor: string;
  minRadius: number;
  maxRadius: number;
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

function resolveClusterFillColor(size: number, options: ResolvedClusterStyleOptions): string {
  if (options.fillColor) {
    return options.fillColor;
  }

  const minColor = parseRgbaColor(options.minClusterColor) ?? [38, 165, 129, 0.88];
  const maxColor = parseRgbaColor(options.maxClusterColor) ?? [220, 53, 69, 0.88];
  const gradientMaxCount = Math.max(2, options.gradientMaxCount);
  const ratio = Math.min(1, Math.max(0, (size - 2) / (gradientMaxCount - 2)));

  return formatRgbaColor(
    minColor[0] + ratio * (maxColor[0] - minColor[0]),
    minColor[1] + ratio * (maxColor[1] - minColor[1]),
    minColor[2] + ratio * (maxColor[2] - minColor[2]),
    minColor[3] + ratio * (maxColor[3] - minColor[3]),
  );
}

function createClusterBadgeStyle(
  size: number,
  options: ResolvedClusterStyleOptions,
): Style {
  const radius = Math.min(
    options.maxRadius,
    Math.max(options.minRadius, options.minRadius + Math.log2(size) * 3),
  );

  return new Style({
    image: new CircleStyle({
      radius,
      fill: new Fill({ color: resolveClusterFillColor(size, options) }),
      stroke: new Stroke({ color: options.strokeColor, width: 2 }),
    }),
    text: new Text({
      text: String(size),
      fill: new Fill({ color: options.textColor }),
      stroke: new Stroke({ color: 'rgba(0, 0, 0, 0.35)', width: 2 }),
    }),
  });
}

/**
 * Style combiné : picto pour un point seul, pastille numérotée pour un cluster.
 * Inspiré de {@link https://viglino.github.io/ol-ext/examples/animation/map.animatedcluster.html}.
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
