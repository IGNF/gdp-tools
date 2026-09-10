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
  /**
   * Clés de repli si `themeAttributes` est omis.
   * Sans effet sur pof-mobile, qui fournit déjà `themeAttributes`.
   */
  attributeKeys?: readonly string[];
  /** Statut collaboratif (défaut : `submit`, attendu par l’API EspaceCo). */
  status?: string;
}

/**
 * Corps de requête `report.add()` pour un signalement sur point géodésique.
 * Pas de `sketch` : seuls géométrie, commentaire, thème et pièces jointes sont transmis.
 */
export function mapGeodesyPointReportToApiBody(
  context: GeodesyPointReportContext,
  options: MapGeodesyPointReportToApiBodyOptions,
): Record<string, unknown> {
  const themeAttributes = mergeGeodesyPointReportMandatoryThemeAttributes(
    context,
    options.themeAttributes ??
      buildGeodesyPointReportThemeAttributes(
        context,
        options.attributeKeys ? { keys: options.attributeKeys } : undefined,
      ),
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
