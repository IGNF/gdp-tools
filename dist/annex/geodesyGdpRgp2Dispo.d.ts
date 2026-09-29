/** État d’un indicateur de disponibilité RGP (`0` ou `1`). */
export type GdpRgp2DispoState = 'available' | 'unavailable';
/**
 * Décode le champ `dispo` en états pour affichage (cercles verts / rouges).
 * `null` ou vide → un cercle rouge.
 */
export declare function parseGdpRgp2DispoStates(value: unknown): readonly GdpRgp2DispoState[];
/** Traduit un chiffre de disponibilité RGP (`0` ou `1`) — texte brut (commentaires). */
export declare function translateGdpRgp2DispoDigit(digit: string): string;
/**
 * Formate le champ `dispo` du flux GDP_RGP2 pour affichage fiche.
 * Chaque caractère `0`/`1` est traduit (ex. `1011` → « Disponible, Non disponible, Disponible, Disponible »).
 */
export declare function formatGdpRgp2DispoForDisplay(value: unknown): string;
/**
 * True si le champ `dispo` contient des données exploitables (chaîne de `0`/`1` non vide).
 * False si absent/vide/invalide → la station elle-même est considérée en panne.
 */
export declare function hasGdpRgp2DispoData(value: unknown): boolean;
/**
 * True si la station est entièrement disponible (tous les chiffres `dispo` valent `1`).
 * `null`, vide ou présence d’un `0` → indisponible (cercle rouge).
 */
export declare function isGdpRgp2StationAvailable(value: unknown): boolean;
//# sourceMappingURL=geodesyGdpRgp2Dispo.d.ts.map