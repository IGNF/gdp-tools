/** Thème collaboratif pour un signalement sur point géodésique existant. */
export const GEODESY_POINT_REPORT_THEME = 'gdp-tools';

/** Rôle logique d’une photo utilisateur pour le signalement géodésie. */
export type GeodesyPointReportPhotoRole = 'photo1' | 'photo2';

export interface GeodesyPointReportPhotoSlot {
  role: GeodesyPointReportPhotoRole;
  /** Clé attendue par `report.addAttachments` (`photo0`, `photo1`, …). */
  attachmentKey: string;
  label: string;
  mandatory: boolean;
}

/** Schéma des pièces jointes photo pour le signalement sur point géodésique. */
export const GEODESY_POINT_REPORT_PHOTO_SLOTS: readonly GeodesyPointReportPhotoSlot[] = [
  { role: 'photo1', attachmentKey: 'photo0', label: 'Photo du repère', mandatory: true },
  { role: 'photo2', attachmentKey: 'photo1', label: 'Photo complémentaire', mandatory: false },
];

/** Attributs thème préremplis depuis les propriétés du repère. */
export const GEODESY_POINT_REPORT_THEME_ATTRIBUTE_KEYS = [
  'id',
  'domaine',
  'nom',
  'no',
  'type',
  'etat',
  'commune',
] as const;

/** Toujours transmis au signalement, même absents de la fiche ou du thème collaboratif. */
export const GEODESY_POINT_REPORT_MANDATORY_ATTRIBUTE_KEYS = ['id', 'domaine'] as const;
