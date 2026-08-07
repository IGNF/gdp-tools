import type { Coordinate } from 'ol/coordinate';
import type Map from 'ol/Map';
import type { Pixel } from 'ol/pixel';

import type { GeodesyFeatureInfoHit } from '../wms/queryGeodesyAtCoordinate';
import { queryGeodesyAtCoordinate, type QueryGeodesyAtCoordinateOptions } from '../wms/queryGeodesyAtCoordinate';
import { queryGeodesyAnnexAtPixel, type QueryGeodesyAnnexAtPixelOptions } from '../annex/queryGeodesyAnnexAtPixel';
import { queryGeodesyWfsAtPixel, type QueryGeodesyWfsAtPixelOptions } from '../wfs/queryGeodesyWfsAtPixel';

export interface QueryGeodesyAtClickOptions {
  wfs?: QueryGeodesyWfsAtPixelOptions;
  annex?: QueryGeodesyAnnexAtPixelOptions;
  wms?: QueryGeodesyAtCoordinateOptions;
  /** Interroger d’abord les entités vectorielles WFS / annexes (défaut : true). */
  preferWfs?: boolean;
}

/**
 * Interroge la géodésie au clic : entité WFS sous le pixel, puis GetFeatureInfo WMS.
 */
export async function queryGeodesyAtClick(
  map: Map,
  coordinate: Coordinate,
  pixel: Pixel,
  options: QueryGeodesyAtClickOptions = {},
): Promise<GeodesyFeatureInfoHit[]> {
  const preferWfs = options.preferWfs ?? true;

  if (preferWfs) {
    const wfsHits = queryGeodesyWfsAtPixel(map, pixel, options.wfs);
    if (wfsHits.length > 0) {
      return wfsHits;
    }

    const annexHits = queryGeodesyAnnexAtPixel(map, pixel, options.annex);
    if (annexHits.length > 0) {
      return annexHits;
    }
  }

  const wmsHits = await queryGeodesyAtCoordinate(map, coordinate, options.wms);
  if (wmsHits.length > 0 || !preferWfs) {
    return wmsHits;
  }

  const annexHits = queryGeodesyAnnexAtPixel(map, pixel, options.annex);
  if (annexHits.length > 0) {
    return annexHits;
  }

  return queryGeodesyWfsAtPixel(map, pixel, options.wfs);
}
