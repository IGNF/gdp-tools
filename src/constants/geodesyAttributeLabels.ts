/**
 * Libellés français des attributs GEODESIE_DATA / fiches géodésie IGN.
 * Clés en minuscules ; la recherche est insensible à la casse.
 */
export const GEODESY_ATTRIBUTE_LABELS: Readonly<Record<string, string>> = {
  id: 'Identifiant',
  domaine: 'Domaine',
  picto: 'Pictogramme',
  nom: 'Nom',
  no: 'Numéro',
  type: 'Type de repère',
  type_info: 'Complément de type',
  remarque: 'Remarque',
  diffusion: 'Diffusion',

  maj_date: 'Date de mise à jour',
  commune: 'Commune',
  cadence: 'Cadence',
  reseaux: 'Réseaux',
  hauteur: 'Hauteur (m)',
  info: 'Info',
  dispo: 'Disponibilité',
  insee: 'Code INSEE',
  entite: 'Entité administrative',
  entite_no: 'N° entité',
  entite_nature: 'Nature entité',
  localisation: 'Localisation',
  carte: 'Carte',
  carte_no: 'N° carte',

  voie_suivie: 'Voie suivie',
  voie_de: 'Voie — de',
  voie_vers: 'Voie — vers',
  voie_cote: 'Voie — côté',
  voie_pk: 'Voie — PK',

  etat: 'État',
  action: 'Action',
  action_date: 'Date action',
  vis_date: 'Date visite',
  obs_date: 'Date observation',
  obs_org: 'Organisme observation',
  expl_gps: 'Exploitation GPS',

  cg1_coord1: 'Longitude (décimale)',
  cg1_coord2: 'Latitude (décimale)',
  cg1_coord3: 'Hauteur ellipsoïdale (m)',
  cg1_coord1_dms: 'Longitude (DMS)',
  cg1_coord2_dms: 'Latitude (DMS)',
  cg1_srt: 'Système de référence géographique',
  cg1_prec: 'Précision planimétrique',
  cg1_date: 'Date coordonnées géographiques',

  cp1_coord1: 'X',
  cp1_coord2: 'Y',
  cp1_coord3: 'Altitude (m)',
  cp1_srt: 'Système de projection',
  cp1_prec: 'Précision planimétrique (projection)',
  cp1_srv: 'Système altimétrique',
  cp1_precv: 'Précision altimétrique',
  cp1_altitude_type: 'Type d’altitude',
  cp1_date: 'Date coordonnées projetées',

  cg2_coord1: 'Longitude 2 (décimale)',
  cg2_coord2: 'Latitude 2 (décimale)',
  cg2_coord3: 'Hauteur ellipsoïdale 2 (m)',
  cg2_coord1_dms: 'Longitude 2 (DMS)',
  cg2_coord2_dms: 'Latitude 2 (DMS)',
  cg2_srt: 'Système de référence géographique 2',
  cg2_prec: 'Précision planimétrique 2',
  cg2_date: 'Date coordonnées géographiques 2',

  cp2_coord1: 'X',
  cp2_coord2: 'Y',
  cp2_coord3: 'Altitude 2',
  cp2_srt: 'Système de projection 2',
  cp2_prec: 'Précision planimétrique 2',
  cp2_srv: 'Système altimétrique 2',
  cp2_precv: 'Précision altimétrique 2',
  cp2_altitude_type: 'Type d’altitude 2',
  cp2_date: 'Date coordonnées projetées 2',

  g: 'Valeur de g',
  gravi_no: 'N° gravimétrique',
  gravi_srg: 'Réseau gravimétrique',
  gravi_traitprecision: 'Précision traitement gravimétrique',
  gravi_calcul_date: 'Date calcul gravimétrique',
  gravi_abs_date: 'Date mesure absolue',
  gravi_rel_date: 'Date mesure relative',
  gravi_gradient: 'Gradient gravimétrique',
  gravi_gradient_ecart_type: 'Écart-type gradient',
  gravi_grad_date: 'Date gradient',

  freres_info: 'Repères frères',
  groupe_info: 'Groupe',
  voisin: 'Repère voisin',
  voisin_distance: 'Distance voisin',
  voisin_domaine: 'Domaine voisin',
  jumeau: 'Repère jumeau',
  jumeau_no: 'N° jumeau',
  jumeau_info: 'Info jumeau',
  jumeau_dom: 'Domaine jumeau',
  autre_canevas_info: 'Autre canevas',

  support: 'Support',
  support_part: 'Partie de support',
  rep_hori: 'Repère horizontal',
  rep_vert: 'Repère vertical',

  proprio: 'Propriétaire',
  proprio_artic: 'Propriétaire (article)',
  proprio_sigle: 'Sigle propriétaire',
  proprio_adr: 'Adresse propriétaire',

  url_pdf: 'Fiche PDF',
  img1: 'Photo 1 ( fichier )',
  img1_date: 'Date photo 1',
  img1_azim: 'Azimut photo 1',
  img1_url: 'Photo 1',
  img2: 'Photo 2 ( fichier )',
  img2_date: 'Date photo 2',
  img2_azim: 'Azimut photo 2',
  img2_url: 'Photo 2',

  groupe_img1: 'Photo groupe 1 ( fichier )',
  groupe_img1_date: 'Date photo groupe 1',
  groupe_img1_azim: 'Azimut photo groupe 1',
  groupe_img1_url: 'Photo groupe 1',
  groupe_img2: 'Photo groupe 2 ( fichier )',
  groupe_img2_date: 'Date photo groupe 2',
  groupe_img2_azim: 'Azimut photo groupe 2',
  groupe_img2_url: 'Photo groupe 2',

  groupe_croquis1: 'Croquis groupe 1 ( fichier )',
  groupe_croquis1_date: 'Date croquis groupe 1',
  groupe_croquis1_azim: 'Azimut croquis groupe 1',
  groupe_croquis1_url: 'Croquis groupe 1',
  groupe_croquis2: 'Croquis groupe 2 ( fichier )',
  groupe_croquis2_date: 'Date croquis groupe 2',
  groupe_croquis2_azim: 'Azimut croquis groupe 2',
  groupe_croquis2_url: 'Croquis groupe 2',

  groupe_type: 'Type de réseau',
  groupe_typecode: 'Code réseau',
  groupe_typeinfo: 'Info type réseau',
  groupe_lieudit: 'Lieu-dit du groupe',
};

/** Liste complète des attributs GEODESIE_DATA documentés (ordre stable pour copier-coller). */
export const GEODESIE_DATA_ATTRIBUTE_KEYS = Object.keys(
  GEODESY_ATTRIBUTE_LABELS,
) as (keyof typeof GEODESY_ATTRIBUTE_LABELS)[];

/** Retourne le libellé traduit d’un attribut géodésie, ou une forme lisible par défaut. */
export function getGeodesyAttributeLabel(key: string): string {
  const normalizedKey = key.toLowerCase();
  const label = GEODESY_ATTRIBUTE_LABELS[normalizedKey];
  if (label) {
    return label;
  }

  return key
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .trim();
}
