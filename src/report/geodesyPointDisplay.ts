import type { Coordinate } from 'ol/coordinate';
import Point from 'ol/geom/Point';
import { toLonLat } from 'ol/proj';

import type { GeodesyAttributeCatalog } from '../catalog/geodesyAttributeCatalog';
import {
  formatGdpRgp2DispoForDisplay,
  parseGdpRgp2DispoStates,
  type GdpRgp2DispoState,
} from '../annex/geodesyGdpRgp2Dispo';
import {
  buildGdpRgp2StationFicheUrl,
  GEODESY_GDP_RGP2_FICHE_LINK_LABEL,
  GEODESY_GDP_RGP2_FICHE_LINK_TEXT,
} from '../annex/geodesyGdpRgp2FicheUrl';
import {
  createGeodesyExternalUrlTransform,
  resolveGeodesyExternalUrlSource,
} from '../constants/geodesyExternalUrl';
import type { GeodesyCatalog } from '../catalog/geodesyCatalog';
import { resolveGeodesyHitAttributeCatalog } from '../catalog/resolveGeodesyHitAttributeCatalog';
import {
  DEFAULT_GEODESY_ATTRIBUTE_CATALOG,
  getGeodesyAttributeLabelFromCatalog,
  resolveGeodesyPopupTitle,
  selectGeodesyDisplayEntries,
} from '../catalog/geodesyAttributeCatalog';
import { resolveGeodesyImageDisplayUrl } from '../cache/geodesyImageCache';
import {
  DEFAULT_GEODESY_WFS_PICTO_URL_MAPS,
  resolveGeodesyPictoImageUrl,
} from '../constants/geodesyPictoUrls';
import type { GeodesyPictoUrlMap } from '../style/geodesyWfsPictoStyle';
import type { GeodesyWfsLayerId } from '../constants/wfs';
import {
  getGeodesyScalarPropertyEntries,
  isGeodesyAttributeImageUrl,
  isGeodesyAttributePicto,
  isGeodesyAttributeUrl,
} from '../interaction/geodesyFeatureAttributes';
import type { GeodesyFeatureInfoHit } from '../wms/queryGeodesyAtCoordinate';
import { collectGeodesyPointPhotos, type GeodesyPointPhoto } from './geodesyPointPhotos';

export interface GeodesyPointAttribute {
  label: string;
  value: string;
  href?: string;
  imageUrl?: string;
  displayImageUrl?: string;
  /** Affiche le code `picto` en plus de l’image (identification / complétion du dictionnaire). */
  isPicto?: boolean;
  /** Indicateurs de disponibilité RGP (`1` vert, `0` rouge). */
  dispoStates?: readonly GdpRgp2DispoState[];
}

export interface GeodesyPointTitlePicto {
  value: string;
  imageUrl: string;
  displayImageUrl?: string;
  href?: string;
}

export interface GeodesyPointDisplay {
  title: string;
  /** Symbole IGN affiché avant le titre (champ `picto`). */
  titlePicto?: GeodesyPointTitlePicto;
  layerTitle: string;
  longitude: number;
  latitude: number;
  attributes: GeodesyPointAttribute[];
  photos: GeodesyPointPhoto[];
  comment: string;
}

export interface BuildGeodesyPointDisplayOptions {
  attributeCatalog?: GeodesyAttributeCatalog;
  /** Catalogue carte pour résoudre les attributs des couches annexes. */
  geodesyCatalog?: GeodesyCatalog;
  /**
   * Paramètre `source` des liens externes IGN.
   * Défaut package : {@link DEFAULT_GEODESY_EXTERNAL_URL_SOURCE}.
   */
  externalUrlSource?: string;
  /** Surcharge complète du transformateur d’URL (prioritaire sur {@link externalUrlSource}). */
  transformExternalUrl?: (url: string) => string;
  /** Tables `picto` → URL (défaut : {@link DEFAULT_GEODESY_WFS_PICTO_URL_MAPS}). */
  pictoUrlMaps?: Readonly<Partial<Record<GeodesyWfsLayerId, GeodesyPictoUrlMap>>>;
  /** Couche source pour résoudre le symbole `picto`. */
  layerId?: string;
}

export function extractGeodesyCoordinates(
  hit: GeodesyFeatureInfoHit,
  fallbackCoordinate: Coordinate,
): { longitude: number; latitude: number } {
  const geometry = hit.feature.getGeometry();
  if (geometry instanceof Point) {
    const [longitude, latitude] = toLonLat(geometry.getCoordinates());
    return { longitude, latitude };
  }

  const storedCoordinate = hit.feature.get('coordinate') as Coordinate | undefined;
  if (storedCoordinate) {
    const [longitude, latitude] = toLonLat(storedCoordinate);
    return { longitude, latitude };
  }

  const [longitude, latitude] = toLonLat(fallbackCoordinate);
  return { longitude, latitude };
}

function resolveTransformExternalUrl(
  options: BuildGeodesyPointDisplayOptions,
): (url: string) => string {
  if (options.transformExternalUrl) {
    return options.transformExternalUrl;
  }

  return createGeodesyExternalUrlTransform(resolveGeodesyExternalUrlSource(options.externalUrlSource));
}

function appendGdpRgp2FicheLink(
  attributes: GeodesyPointAttribute[],
  properties: Record<string, unknown>,
  options: BuildGeodesyPointDisplayOptions,
): GeodesyPointAttribute[] {
  if (options.layerId !== 'GDP_RGP2') {
    return attributes;
  }

  const station = String(properties.nom ?? '').trim();
  const ficheUrl = buildGdpRgp2StationFicheUrl(
    station,
    resolveGeodesyExternalUrlSource(options.externalUrlSource),
  );

  if (!ficheUrl) {
    return attributes;
  }

  return [
    ...attributes,
    {
      label: GEODESY_GDP_RGP2_FICHE_LINK_LABEL,
      value: GEODESY_GDP_RGP2_FICHE_LINK_TEXT,
      href: ficheUrl,
    },
  ];
}

function formatGeodesyPointAttributeValueForComment(
  key: string,
  value: string,
  options: BuildGeodesyPointDisplayOptions,
): string {
  const trimmedValue = value.trim();
  const layerId = options.layerId;

  if (layerId === 'GDP_RGP2' && key.toLowerCase() === 'dispo') {
    return formatGdpRgp2DispoForDisplay(trimmedValue);
  }

  return trimmedValue;
}

function buildGeodesyPointAttribute(
  key: string,
  value: string,
  attributeCatalog: GeodesyAttributeCatalog,
  options: BuildGeodesyPointDisplayOptions,
): GeodesyPointAttribute {
  const trimmedValue = value.trim();
  const label = getGeodesyAttributeLabelFromCatalog(key, attributeCatalog);
  const transformUrl = resolveTransformExternalUrl(options);

  if (options.layerId === 'GDP_RGP2' && key.toLowerCase() === 'dispo') {
    return {
      label,
      value: trimmedValue,
      dispoStates: parseGdpRgp2DispoStates(trimmedValue),
    };
  }

  if (isGeodesyAttributePicto(key)) {
    const pictoUrlMaps = options.pictoUrlMaps ?? DEFAULT_GEODESY_WFS_PICTO_URL_MAPS;
    const imageUrl = resolveGeodesyPictoImageUrl(trimmedValue, {
      pictoUrlMaps,
      layerId: options.layerId,
    });

    if (imageUrl) {
      const href = transformUrl(imageUrl);
      return {
        label,
        value: trimmedValue,
        isPicto: true,
        href,
        imageUrl,
        displayImageUrl: resolveGeodesyImageDisplayUrl(imageUrl),
      };
    }

    return {
      label,
      value: trimmedValue,
      isPicto: true,
    };
  }

  if (isGeodesyAttributeImageUrl(key, value)) {
    const href = transformUrl(trimmedValue);
    return {
      label,
      value: trimmedValue,
      href,
      imageUrl: trimmedValue,
      displayImageUrl: resolveGeodesyImageDisplayUrl(trimmedValue),
    };
  }

  return {
    label,
    value: trimmedValue,
    ...(isGeodesyAttributeUrl(key, value) ? { href: transformUrl(trimmedValue) } : {}),
  };
}

function buildGeodesyPointTitlePicto(
  properties: Record<string, unknown>,
  options: BuildGeodesyPointDisplayOptions,
): GeodesyPointTitlePicto | undefined {
  const raw = properties.picto ?? properties.PICTO;
  if (raw === null || raw === undefined || String(raw).trim() === '') {
    return undefined;
  }

  const trimmedValue = String(raw).trim();
  const pictoUrlMaps = options.pictoUrlMaps ?? DEFAULT_GEODESY_WFS_PICTO_URL_MAPS;
  const imageUrl = resolveGeodesyPictoImageUrl(trimmedValue, {
    pictoUrlMaps,
    layerId: options.layerId,
  });

  if (!imageUrl) {
    return undefined;
  }

  const transformUrl = resolveTransformExternalUrl(options);

  return {
    value: trimmedValue,
    imageUrl,
    displayImageUrl: resolveGeodesyImageDisplayUrl(imageUrl),
    href: transformUrl(imageUrl),
  };
}

function buildGeodesyPointAttributes(
  properties: Record<string, unknown>,
  options: BuildGeodesyPointDisplayOptions = {},
): GeodesyPointAttribute[] {
  const attributeCatalog = options.attributeCatalog ?? DEFAULT_GEODESY_ATTRIBUTE_CATALOG;

  const entries = selectGeodesyDisplayEntries(
    getGeodesyScalarPropertyEntries(properties, attributeCatalog),
    attributeCatalog,
  );

  return entries.map(([key, value]) =>
    buildGeodesyPointAttribute(key, value, attributeCatalog, options),
  );
}

export function formatGeodesyHitAsComment(
  hit: GeodesyFeatureInfoHit,
  attributeCatalog: GeodesyAttributeCatalog = DEFAULT_GEODESY_ATTRIBUTE_CATALOG,
  options: Pick<BuildGeodesyPointDisplayOptions, 'layerId'> = {},
): string {
  const properties = hit.feature.getProperties();
  const lines = [`Couche : ${hit.layerTitle}`];
  const layerId = options.layerId ?? hit.layerId;

  selectGeodesyDisplayEntries(
    getGeodesyScalarPropertyEntries(properties, attributeCatalog),
    attributeCatalog,
  ).forEach(([key, value]) => {
    const formattedValue = formatGeodesyPointAttributeValueForComment(key, value, { layerId });
    lines.push(`${getGeodesyAttributeLabelFromCatalog(key, attributeCatalog)} : ${formattedValue}`);
  });

  return lines.join('\n');
}

export function buildGeodesyPointDisplay(
  hit: GeodesyFeatureInfoHit,
  fallbackCoordinate: Coordinate,
  options: BuildGeodesyPointDisplayOptions = {},
): GeodesyPointDisplay {
  const baseAttributeCatalog = options.attributeCatalog ?? DEFAULT_GEODESY_ATTRIBUTE_CATALOG;
  const attributeCatalog = options.geodesyCatalog
    ? resolveGeodesyHitAttributeCatalog(options.geodesyCatalog, hit, baseAttributeCatalog)
    : baseAttributeCatalog;
  const properties = hit.feature.getProperties();
  const { longitude, latitude } = extractGeodesyCoordinates(hit, fallbackCoordinate);
  const displayOptions: BuildGeodesyPointDisplayOptions = {
    ...options,
    attributeCatalog,
    layerId: options.layerId ?? hit.layerId,
  };
  const titlePicto = buildGeodesyPointTitlePicto(properties, displayOptions);

  return {
    title: resolveGeodesyPopupTitle(properties, attributeCatalog),
    titlePicto,
    layerTitle: hit.layerTitle,
    longitude,
    latitude,
    attributes: appendGdpRgp2FicheLink(
      buildGeodesyPointAttributes(properties, displayOptions),
      properties,
      displayOptions,
    ),
    photos: collectGeodesyPointPhotos(properties, attributeCatalog),
    comment: formatGeodesyHitAsComment(hit, attributeCatalog, { layerId: displayOptions.layerId }),
  };
}

export function formatMapCoordinateSubtitle(longitude: number, latitude: number): string {
  return `${latitude.toFixed(5)}° N, ${longitude.toFixed(5)}° E`;
}
