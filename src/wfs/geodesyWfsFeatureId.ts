import Feature from 'ol/Feature';
import type Geometry from 'ol/geom/Geometry';
import Point from 'ol/geom/Point';

import type { GeodesyWfsLayerId } from '../constants/wfs';

const GEODESY_WFS_ID_PROPERTY_KEYS = ['id', 'ID', 'no', 'NO'] as const;

/** Identifiant métier d’une entité WFS (`id`, `no`, …). */
export function readGeodesyWfsBusinessId(properties: Record<string, unknown>): string | undefined {
  for (const key of GEODESY_WFS_ID_PROPERTY_KEYS) {
    const raw = properties[key];
    if (raw === null || raw === undefined) {
      continue;
    }

    const id = String(raw).trim();
    if (id) {
      return id;
    }
  }

  return undefined;
}

function buildGeodesyWfsFeatureId(layerId: GeodesyWfsLayerId, businessId: string): string {
  return `${layerId}:${businessId}`;
}

function buildCoordinateFallbackId(feature: Feature<Geometry>, layerId: GeodesyWfsLayerId): string | undefined {
  const geometry = feature.getGeometry();
  if (!(geometry instanceof Point)) {
    return undefined;
  }

  const [x, y] = geometry.getCoordinates();
  return buildGeodesyWfsFeatureId(layerId, `${x.toFixed(3)}:${y.toFixed(3)}`);
}

/**
 * Identifiant OpenLayers stable pour éviter les doublons avec la stratégie bbox.
 * OpenLayers ignore les features déjà présentes si {@link Feature#getId} est identique.
 */
export function assignGeodesyWfsFeatureId(
  feature: Feature<Geometry>,
  layerId: GeodesyWfsLayerId,
): void {
  const layerPrefix = `${layerId}:`;
  const currentId = feature.getId();
  if (currentId !== undefined && String(currentId).startsWith(layerPrefix)) {
    return;
  }

  const properties = feature.getProperties();
  const businessId =
    readGeodesyWfsBusinessId(properties) ??
    (currentId !== undefined ? String(currentId).trim() : undefined) ??
    buildCoordinateFallbackId(feature, layerId);

  if (businessId) {
    feature.setId(
      businessId.startsWith(layerPrefix) ? businessId : buildGeodesyWfsFeatureId(layerId, businessId),
    );
  }
}
