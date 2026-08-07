import Feature from 'ol/Feature';
import GeoJSON from 'ol/format/GeoJSON';
import type Geometry from 'ol/geom/Geometry';

export interface ParseGeodesyWfsGeoJsonOptions {
  dataProjection?: string;
  featureProjection?: string;
}

const GEOJSON_FORMAT = new GeoJSON();

/** Parse une réponse WFS GeoJSON (`application/json`) en features OpenLayers. */
export function parseGeodesyWfsGeoJson(
  payload: string,
  options: ParseGeodesyWfsGeoJsonOptions = {},
): Feature<Geometry>[] {
  const { dataProjection = 'EPSG:4326', featureProjection = 'EPSG:3857' } = options;

  try {
    const data = JSON.parse(payload) as {
      type?: string;
      features?: unknown[];
    };

    if (!data.features?.length) {
      return [];
    }

    return GEOJSON_FORMAT.readFeatures(data, {
      dataProjection,
      featureProjection,
    }) as Feature<Geometry>[];
  } catch {
    return [];
  }
}
