import type Feature from 'ol/Feature';
import type Geometry from 'ol/geom/Geometry';

import {
  DEFAULT_GEODESY_ATTRIBUTE_CATALOG,
  getGeodesyAttributeLabelFromCatalog,
  resolveGeodesyPopupTitle,
  selectGeodesyDisplayEntries,
  type GeodesyAttributeCatalog,
} from '../catalog/geodesyAttributeCatalog';
import { GEODESY_LAYER_ID_PROPERTY } from '../constants/wms';
import {
  DEFAULT_GEODESY_WFS_PICTO_URL_MAPS,
  resolveGeodesyPictoImageUrl,
} from '../constants/geodesyPictoUrls';
import type { GeodesyWfsLayerId } from '../constants/wfs';
import type { GeodesyPictoUrlMap } from '../style/geodesyWfsPictoStyle';
import {
  formatGeodesyAttributeImageUrlHtml,
  formatGeodesyAttributeUrlHtml,
  getGeodesyScalarPropertyEntries,
  isEmptyGeodesyAttributeValue,
  isGeodesyAttributeImageUrl,
  isGeodesyAttributePicto,
  isGeodesyAttributeUrl,
} from './geodesyFeatureAttributes';

export interface BuildGeodesyPopupTemplateOptions {
  pictoUrlMaps?: Readonly<Partial<Record<GeodesyWfsLayerId, GeodesyPictoUrlMap>>>;
}

export interface GeodesyPopupAttributeTemplate {
  title: string;
  format?: (value: unknown, feature: Feature<Geometry>) => string;
  visible?: boolean | ((feature: Feature<Geometry>, value: unknown) => boolean);
}

export interface GeodesyPopupTemplate {
  title: string;
  attributes: Record<string, GeodesyPopupAttributeTemplate>;
}

/** Gabarit popup aligné sur ol-ext PopupFeature (comme EspaceCo / ol-ext « default »). */
export function buildGeodesyPopupTemplate(
  feature: Feature<Geometry>,
  attributeCatalog: GeodesyAttributeCatalog = DEFAULT_GEODESY_ATTRIBUTE_CATALOG,
  options: BuildGeodesyPopupTemplateOptions = {},
): GeodesyPopupTemplate {
  const properties = feature.getProperties();
  const title = resolveGeodesyPopupTitle(properties, attributeCatalog);
  const pictoUrlMaps = options.pictoUrlMaps ?? DEFAULT_GEODESY_WFS_PICTO_URL_MAPS;

  const attributes: Record<string, GeodesyPopupAttributeTemplate> = {};
  selectGeodesyDisplayEntries(
    getGeodesyScalarPropertyEntries(properties, attributeCatalog),
    attributeCatalog,
  ).forEach(([key, value]) => {
    const label = getGeodesyAttributeLabelFromCatalog(key, attributeCatalog);
    attributes[key] = {
      title: label,
      visible: (currentFeature) => !isEmptyGeodesyAttributeValue(currentFeature.get(key)),
      ...(isGeodesyAttributePicto(key)
        ? {
            format: (attributeValue, currentFeature) => {
              const layerId = currentFeature.get(GEODESY_LAYER_ID_PROPERTY) as string | undefined;
              const imageUrl = resolveGeodesyPictoImageUrl(attributeValue, {
                pictoUrlMaps,
                layerId,
              });
              return imageUrl
                ? formatGeodesyAttributeImageUrlHtml(imageUrl, label)
                : String(attributeValue);
            },
          }
        : isGeodesyAttributeImageUrl(key, value)
        ? {
            format: (attributeValue) =>
              formatGeodesyAttributeImageUrlHtml(attributeValue, label),
          }
        : isGeodesyAttributeUrl(key, value)
          ? { format: (attributeValue) => formatGeodesyAttributeUrlHtml(attributeValue) }
          : {}),
    };
  });

  return { title, attributes };
}
