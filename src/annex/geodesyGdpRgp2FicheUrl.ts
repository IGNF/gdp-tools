import {
  appendGeodesySourceParam,
  DEFAULT_GEODESY_EXTERNAL_URL_SOURCE,
  resolveGeodesyExternalUrlSource,
} from '../constants/geodesyExternalUrl';

/** URL de redirection vers la fiche station RGP (fiches géodésie IGN). */
export const GEODESY_GDP_RGP2_FICHE_URL =
  'https://fiches-geodesie.ign.fr/st-datageod.php/pt-rgp-1-redirect.html';

/** Libellé du lien fiche dans la fiche repère RGP. */
export const GEODESY_GDP_RGP2_FICHE_LINK_LABEL = 'Fiche IGN';

/** Texte affiché pour le lien fiche station RGP. */
export const GEODESY_GDP_RGP2_FICHE_LINK_TEXT = 'Consulter la fiche station';

/**
 * Construit l’URL de fiche station RGP pour l’acronyme donné (`nom` du flux GDP_RGP2).
 * @param stationAcronym Code station (ex. `OP71`, `EOST`).
 */
export function buildGdpRgp2StationFicheUrl(
  stationAcronym: string,
  source: string = DEFAULT_GEODESY_EXTERNAL_URL_SOURCE,
): string | undefined {
  const station = stationAcronym.trim();
  if (!station) {
    return undefined;
  }

  const baseUrl = `${GEODESY_GDP_RGP2_FICHE_URL}?station=${encodeURIComponent(station)}`;
  return appendGeodesySourceParam(baseUrl, resolveGeodesyExternalUrlSource(source));
}
