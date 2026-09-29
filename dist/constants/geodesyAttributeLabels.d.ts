/**
 * Libellés français des attributs GEODESIE_DATA / fiches géodésie IGN.
 * Clés en minuscules ; la recherche est insensible à la casse.
 */
export declare const GEODESY_ATTRIBUTE_LABELS: Readonly<Record<string, string>>;
/** Liste complète des attributs GEODESIE_DATA documentés (ordre stable pour copier-coller). */
export declare const GEODESIE_DATA_ATTRIBUTE_KEYS: (keyof typeof GEODESY_ATTRIBUTE_LABELS)[];
/** Retourne le libellé traduit d’un attribut géodésie, ou une forme lisible par défaut. */
export declare function getGeodesyAttributeLabel(key: string): string;
//# sourceMappingURL=geodesyAttributeLabels.d.ts.map