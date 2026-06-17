import Feature from 'ol/Feature';
import type { FeatureLike } from 'ol/Feature';
import CircleStyle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import Icon from 'ol/style/Icon';
import Stroke from 'ol/style/Stroke';
import Style, {
  type StyleFunction,
  type StyleLike,
} from 'ol/style/Style';

import type { GeodesyCatalog } from '../catalog/geodesyCatalog';
import { GEODESY_LAYER_ID_PROPERTY } from '../constants/wms';
import type { GeodesyWfsLayerId } from '../constants/wfs';

/** Base URL IGN des symboles géodésie (ex. `…/symbol/rbf_bon_15.gif`). */
export const GEODESY_PICTO_SYMBOL_BASE_URL =
  'https://data.geopf.fr/annexes/geodesie/symbol';

/** Correspondance code `picto` (feature WFS) → URL du symbole. */
export type GeodesyPictoUrlMap = Readonly<Record<string, string>>;

export function normalizeGeodesyPictoCode(value: unknown): string | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }

  const code = String(value).trim();
  return code ? code.toUpperCase() : undefined;
}

export function resolveGeodesyPictoUrl(
  pictoUrlMap: GeodesyPictoUrlMap,
  pictoCode: string,
): string | undefined {
  const direct = pictoUrlMap[pictoCode];
  if (direct) {
    return direct;
  }

  const lower = pictoCode.toLowerCase();
  for (const [key, url] of Object.entries(pictoUrlMap)) {
    if (key.toLowerCase() === lower) {
      return url;
    }
  }

  return undefined;
}

export interface CreateGeodesyWfsPictoStyleOptions {
  /** Style si `picto` absent ou non référencé. */
  fallbackStyle?: Style;
  /** Propriété feature portant le code picto (défaut : `picto`). */
  pictoProperty?: string;
  /** Échelle ol/style/Icon (défaut : 1). */
  iconScale?: number;
}

export const DEFAULT_GEODESY_WFS_POINT_STYLE = new Style({
  image: new CircleStyle({
    radius: 5,
    fill: new Fill({ color: 'rgba(38, 165, 129, 0.85)' }),
    stroke: new Stroke({ color: '#ffffff', width: 1.5 }),
  }),
});

function normalizePictoCode(value: unknown): string | undefined {
  return normalizeGeodesyPictoCode(value);
}

function resolvePictoUrl(pictoUrlMap: GeodesyPictoUrlMap, pictoCode: string): string | undefined {
  return resolveGeodesyPictoUrl(pictoUrlMap, pictoCode);
}

/** Style vectoriel WFS basé sur le champ `picto` et une table nom → URL. */
export function createGeodesyWfsPictoStyleFunction(
  pictoUrlMap: GeodesyPictoUrlMap,
  options: CreateGeodesyWfsPictoStyleOptions = {},
): (feature: FeatureLike) => Style {
  const fallbackStyle = options.fallbackStyle ?? DEFAULT_GEODESY_WFS_POINT_STYLE;
  const pictoProperty = options.pictoProperty ?? 'picto';
  const iconScale = options.iconScale ?? 1;
  const styleCache = new Map<string, Style>();

  return (feature) => {
    if (!(feature instanceof Feature)) {
      return fallbackStyle;
    }

    const pictoCode = normalizePictoCode(feature.get(pictoProperty));
    if (!pictoCode) {
      return fallbackStyle;
    }

    const iconUrl = resolvePictoUrl(pictoUrlMap, pictoCode);
    if (!iconUrl) {
      return fallbackStyle;
    }

    const cachedStyle = styleCache.get(pictoCode);
    if (cachedStyle) {
      return cachedStyle;
    }

    const style = new Style({
      image: new Icon({
        src: iconUrl,
        scale: iconScale,
        crossOrigin: 'anonymous',
      }),
    });
    styleCache.set(pictoCode, style);
    return style;
  };
}

/** Résout le style d’une couche WFS (fixe ou fonction picto). */
export function resolveGeodesyWfsLayerStyle(
  pictoUrlMap: GeodesyPictoUrlMap | undefined,
  styleOverride?: StyleLike,
): StyleLike {
  if (styleOverride !== undefined) {
    return styleOverride;
  }

  if (pictoUrlMap && Object.keys(pictoUrlMap).length > 0) {
    return createGeodesyWfsPictoStyleFunction(pictoUrlMap);
  }

  return DEFAULT_GEODESY_WFS_POINT_STYLE;
}

function toStyleFunction(style: StyleLike): StyleFunction {
  return typeof style === 'function' ? style : () => style as Style;
}

/** Style picto d’une entité WFS à partir du catalogue (via {@link GEODESY_LAYER_ID_PROPERTY}). */
export function createGeodesyWfsFeatureStyleResolver(catalog: GeodesyCatalog): StyleFunction {
  const styleByLayerId = new Map<GeodesyWfsLayerId, StyleFunction>();

  for (const layerId of catalog.wfsLayerIds) {
    const pictoUrlMap = catalog.wfsPictoUrlMaps[layerId];
    styleByLayerId.set(layerId, toStyleFunction(resolveGeodesyWfsLayerStyle(pictoUrlMap)));
  }

  return (feature, resolution) => {
    const layerId = feature.get(GEODESY_LAYER_ID_PROPERTY) as GeodesyWfsLayerId | undefined;
    const styleFn = layerId ? styleByLayerId.get(layerId) : undefined;
    return styleFn ? styleFn(feature, resolution) : DEFAULT_GEODESY_WFS_POINT_STYLE;
  };
}

/** Style des repères éclatés par {@link SelectCluster} (ol-ext). */
export function createGeodesyWfsExplodedClusterFeatureStyle(
  catalog: GeodesyCatalog,
): StyleFunction {
  const pointStyle = createGeodesyWfsFeatureStyleResolver(catalog);

  return (feature, resolution) => {
    if (feature.get('selectclusterlink')) {
      return [];
    }

    const members = feature.get('features') as Feature[] | undefined;
    const innerFeature = members?.[0] ?? feature;
    return pointStyle(innerFeature, resolution);
  };
}
