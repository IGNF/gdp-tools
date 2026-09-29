/** URL de redirection vers la fiche station RGP (fiches géodésie IGN). */
export declare const GEODESY_GDP_RGP2_FICHE_URL = "https://fiches-geodesie.ign.fr/st-datageod.php/pt-rgp-1-redirect.html";
/** Libellé du lien fiche dans la fiche repère RGP. */
export declare const GEODESY_GDP_RGP2_FICHE_LINK_LABEL = "Fiche RGP";
/** Texte affiché pour le lien fiche station RGP. */
export declare const GEODESY_GDP_RGP2_FICHE_LINK_TEXT = "Consulter la fiche station";
/**
 * Construit l’URL de fiche station RGP pour l’acronyme donné (`nom` du flux GDP_RGP2).
 * @param stationAcronym Code station (ex. `OP71`, `EOST`).
 */
export declare function buildGdpRgp2StationFicheUrl(stationAcronym: string, source?: string): string | undefined;
//# sourceMappingURL=geodesyGdpRgp2FicheUrl.d.ts.map