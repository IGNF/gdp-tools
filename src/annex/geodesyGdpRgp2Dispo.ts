const UNAVAILABLE_LABEL = 'Non disponible';
const AVAILABLE_LABEL = 'Disponible';

/** État d’un indicateur de disponibilité RGP (`0` ou `1`). */
export type GdpRgp2DispoState = 'available' | 'unavailable';

/**
 * État global d’une station RGP, déduit de l’ensemble du champ `dispo` :
 * `full` (tout disponible), `partial`, `none` (aucune donnée), `down` (station en panne).
 */
export type GdpRgp2AvailabilityLevel = 'full' | 'partial' | 'none' | 'down';

/** Couleurs des états globaux — partagées par la carte, les listes et la légende. */
export const GDP_RGP2_AVAILABILITY_COLORS: Readonly<Record<GdpRgp2AvailabilityLevel, string>> = {
  full: '#26a581',
  partial: '#f18345',
  none: '#f72525',
  down: '#6c6661',
};

/** Libellés des états globaux (légende, accessibilité). */
export const GDP_RGP2_AVAILABILITY_LABELS: Readonly<Record<GdpRgp2AvailabilityLevel, string>> = {
  full: 'Station opérationnelle',
  partial: 'Station opérationnelle, données en attente',
  none: 'Données manquantes',
  down: 'Station en panne',
};

function normalizeDispoRaw(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }

  const raw = String(value).trim().toLowerCase();
  if (!raw || raw === 'null') {
    return '';
  }

  return raw;
}

function parseGdpRgp2DispoDigit(digit: string): GdpRgp2DispoState | null {
  if (digit === '1') {
    return 'available';
  }

  if (digit === '0') {
    return 'unavailable';
  }

  return null;
}

/**
 * Décode le champ `dispo` en états pour affichage (cercles verts / rouges).
 * `null` ou vide → un cercle rouge.
 */
export function parseGdpRgp2DispoStates(value: unknown): readonly GdpRgp2DispoState[] {
  const raw = normalizeDispoRaw(value);
  if (!raw) {
    return ['unavailable'];
  }

  if (!/^[01]+$/.test(raw)) {
    return ['unavailable'];
  }

  return raw.split('').flatMap((digit) => {
    const state = parseGdpRgp2DispoDigit(digit);
    return state ? [state] : [];
  });
}

/** Traduit un chiffre de disponibilité RGP (`0` ou `1`) — texte brut (commentaires). */
export function translateGdpRgp2DispoDigit(digit: string): string {
  if (digit === '1') {
    return AVAILABLE_LABEL;
  }

  if (digit === '0') {
    return UNAVAILABLE_LABEL;
  }

  return digit;
}

/**
 * Formate le champ `dispo` du flux GDP_RGP2 pour affichage fiche.
 * Chaque caractère `0`/`1` est traduit (ex. `1011` → « Disponible, Non disponible, Disponible, Disponible »).
 */
export function formatGdpRgp2DispoForDisplay(value: unknown): string {
  const raw = normalizeDispoRaw(value);
  if (!raw) {
    return UNAVAILABLE_LABEL;
  }

  if (!/^[01]+$/.test(raw)) {
    return String(value).trim();
  }

  return raw.split('').map(translateGdpRgp2DispoDigit).join(', ');
}

/**
 * True si le champ `dispo` contient des données exploitables (chaîne de `0`/`1` non vide).
 * False si absent/vide/invalide → la station elle-même est considérée en panne.
 */
export function hasGdpRgp2DispoData(value: unknown): boolean {
  const raw = normalizeDispoRaw(value);
  return raw !== '' && /^[01]+$/.test(raw);
}

/** État global de la station : `down` si `dispo` est absent/invalide, sinon selon la part de `1`. */
export function resolveGdpRgp2AvailabilityLevel(value: unknown): GdpRgp2AvailabilityLevel {
  if (!hasGdpRgp2DispoData(value)) {
    return 'down';
  }

  const states = parseGdpRgp2DispoStates(value);
  const availableCount = states.filter((state) => state === 'available').length;

  if (availableCount === 0) {
    return 'none';
  }

  return availableCount === states.length ? 'full' : 'partial';
}

/**
 * True si la station est entièrement disponible (tous les chiffres `dispo` valent `1`).
 * `null`, vide ou présence d’un `0` → indisponible (cercle rouge).
 */
export function isGdpRgp2StationAvailable(value: unknown): boolean {
  const raw = normalizeDispoRaw(value);
  if (!raw || !/^[01]+$/.test(raw)) {
    return false;
  }

  return raw.split('').every((digit) => digit === '1');
}
