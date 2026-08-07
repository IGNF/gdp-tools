const UNAVAILABLE_LABEL = 'Non disponible';
const AVAILABLE_LABEL = 'Disponible';

/** État d’un indicateur de disponibilité RGP (`0` ou `1`). */
export type GdpRgp2DispoState = 'available' | 'unavailable';

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
