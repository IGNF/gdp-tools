import {
  buildGeodesyPointReportThemeAttributes,
  mergeGeodesyPointReportMandatoryThemeAttributes,
} from './buildGeodesyPointReportThemeAttributes';
import {
  GEODESY_POINT_REPORT_THEME,
} from './geodesyPointReportConstants';
import type { GeodesyPointReportContext } from './geodesyPointReportContext';

export interface MapGeodesyPointReportToApiBodyOptions {
  communityId: number;
  comment: string;
  /** Identifiant thème tel que configuré dans EspaceCo (prioritaire sur la constante package). */
  theme?: string;
  /** Fusionnés avec les attributs dérivés du repère. */
  themeAttributes?: Record<string, string>;
  /** Statut collaboratif (défaut : `submit`, attendu par l’API EspaceCo). */
  status?: string;
}

/**
 * Corps de requête `report.add()` pour un signalement sur point géodésique.
 * L’app cliente appelle l’API collaboratif ; le thème est {@link GEODESY_POINT_REPORT_THEME}.
 */
export function mapGeodesyPointReportToApiBody(
  context: GeodesyPointReportContext,
  options: MapGeodesyPointReportToApiBodyOptions,
): Record<string, unknown> {
  const themeAttributes = mergeGeodesyPointReportMandatoryThemeAttributes(
    context,
    options.themeAttributes ?? buildGeodesyPointReportThemeAttributes(context),
  );

  const apiAttributes = {
    community: options.communityId,
    theme: options.theme ?? GEODESY_POINT_REPORT_THEME,
    attributes: themeAttributes,
  };

  return {
    geometry: `POINT(${context.longitude} ${context.latitude})`,
    community: options.communityId,
    comment: options.comment,
    status: options.status ?? 'submit',
    attributes: JSON.stringify(apiAttributes),
  };
}
