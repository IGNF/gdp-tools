import {
  appendGeodesySourceParam,
  DEFAULT_GEODESY_EXTERNAL_URL_SOURCE,
  resolveGeodesyExternalUrlSource,
} from '../constants/geodesyExternalUrl';

/** Portail RGP IGN — liste des stations ; l’acronyme est passé en fragment (`#CHEV`). */
export const GEODESY_GDP_RGP2_FICHE_URL = 'https://rgp.ign.fr/STATIONS/';

/** Libellé du lien fiche dans la fiche repère RGP. */
export const GEODESY_GDP_RGP2_FICHE_LINK_LABEL = 'Fiche RGP';

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

  const baseUrl = `${GEODESY_GDP_RGP2_FICHE_URL}#${encodeURIComponent(station)}`;
  return appendGeodesySourceParam(baseUrl, resolveGeodesyExternalUrlSource(source));
}
