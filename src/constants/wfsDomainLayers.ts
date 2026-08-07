import type Feature from 'ol/Feature';

/** Propriété feature WFS portant le code domaine (ex. `rsgf`, `nivo`). */
export const GEODESY_WFS_DOMAINE_PROPERTY = 'domaine';

/** Identifiant d’une couche d’affichage filtrée par codes `domaine`. */
export type GeodesyWfsDomainLayerId = string;

/** Regroupement de codes `domaine` → une couche switcher (extensible). */
export interface GeodesyWfsDomainLayerDefinition {
  id: GeodesyWfsDomainLayerId;
  title: string;
  shortLabel: string;
  /** Codes `domaine` inclus (comparaison insensible à la casse). */
  domaines: readonly string[];
}

/** Propriété OpenLayers : couche WFS source d’un filtre domaine. */
export const GEODESY_WFS_DOMAIN_SOURCE_LAYER_PROPERTY = 'geodesyWfsDomainSourceLayerId';

/** Propriété OpenLayers : couche WFS chargement données uniquement (non cliquable). */
export const GEODESY_WFS_DATA_LAYER_PROPERTY = 'geodesyWfsDataLayer';

/** Filtres domaine documentés (profil expert). */
export const DEFAULT_GEODESY_WFS_DOMAIN_LAYERS: readonly GeodesyWfsDomainLayerDefinition[] = [
  {
    id: 'DOMAIN_GEODESIE',
    title: 'Géodésie',
    shortLabel: 'Géod',
    domaines: ['rsgf', 'rsgo', 'rsge'],
  },
  {
    id: 'DOMAIN_NIVELLEMENT',
    title: 'Nivellement',
    shortLabel: 'Niv',
    domaines: ['nivf', 'nivo','nive'],
  },
];

export function normalizeGeodesyWfsDomaine(value: unknown): string | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }

  const code = String(value).trim().toLowerCase();
  return code || undefined;
}

function readFeatureDomaine(feature: Feature): string | undefined {
  return normalizeGeodesyWfsDomaine(
    feature.get(GEODESY_WFS_DOMAINE_PROPERTY) ?? feature.get('DOMAINE'),
  );
}

/** True si la feature (ou un membre cluster) appartient à l’un des domaines. */
export function geodesyWfsFeatureMatchesDomaines(
  feature: Feature,
  domaines: readonly string[],
): boolean {
  if (!domaines.length) {
    return true;
  }

  const allowed = new Set(domaines.map((code) => code.toLowerCase()));
  const members = feature.get('features') as Feature[] | undefined;

  if (members?.length) {
    return members.some((member) => {
      const code = readFeatureDomaine(member);
      return code !== undefined && allowed.has(code);
    });
  }

  const code = readFeatureDomaine(feature);
  return code !== undefined && allowed.has(code);
}
