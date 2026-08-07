import type { GeodesyCatalog, GeodesyLayerId } from '../catalog/geodesyCatalog';

/** True si un signalement peut être créé sur un repère de cette couche. */
export function isGeodesyLayerReportingEnabled(
  catalog: GeodesyCatalog,
  layerId: GeodesyLayerId | undefined,
): boolean {
  if (!layerId) {
    return true;
  }

  const annexLayer = catalog.annexLayers.find((layer) => layer.id === layerId);
  if (annexLayer) {
    return annexLayer.reportingEnabled ?? false;
  }

  return true;
}
