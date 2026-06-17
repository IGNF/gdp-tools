import {
  GEODESY_WFS_DOMAINE_PROPERTY,
  normalizeGeodesyWfsDomaine,
} from '../constants/wfsDomainLayers';
import type { GeodesyPointReportContext } from './geodesyPointReportContext';

/** Domaines WFS pour lesquels la position peut être ajustée lors d’un signalement. */
export const GEODESY_POINT_REPORT_POSITION_EDITABLE_DOMAINES = ['nivf', 'nivo'] as const;

export function extractGeodesyPointReportDomaine(
  context: Pick<GeodesyPointReportContext, 'properties'>,
): string | undefined {
  return normalizeGeodesyWfsDomaine(
    context.properties[GEODESY_WFS_DOMAINE_PROPERTY] ?? context.properties.DOMAINE,
  );
}

/** True si le signalement sur ce repère autorise le déplacement de la position. */
export function isGeodesyPointReportPositionEditable(
  context: Pick<GeodesyPointReportContext, 'properties'>,
): boolean {
  const domaine = extractGeodesyPointReportDomaine(context);
  if (!domaine) {
    return false;
  }

  const allowed = new Set(
    GEODESY_POINT_REPORT_POSITION_EDITABLE_DOMAINES.map((code) => code.toLowerCase()),
  );

  return allowed.has(domaine);
}

/** Contexte signalement avec une position ajustée par l’utilisateur. */
export function withGeodesyPointReportPosition(
  context: GeodesyPointReportContext,
  position: { longitude: number; latitude: number },
): GeodesyPointReportContext {
  return {
    ...context,
    longitude: position.longitude,
    latitude: position.latitude,
  };
}
