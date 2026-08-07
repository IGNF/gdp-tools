/**
 * Attributs GEODESIE_DATA pour usage « grand public » (fiche repère courte).
 * Les apps peuvent surcharger via {@link CreateGeodesyPublicCatalogOptions.attributeKeys}.
 */
export const GEODESY_PUBLIC_ATTRIBUTE_KEYS = [
  'id',
  'groupe_type',
  'picto',
  'nom',
  'no',
  'commune',
  'etat',
  'localisation',
  'type',
  'img1_url',
  'img2_url',
  'url_pdf',
  'vis_date',
  'maj_date',
  'remarque',
] as const;

export type GeodesyPublicAttributeKey = (typeof GEODESY_PUBLIC_ATTRIBUTE_KEYS)[number];
