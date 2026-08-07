import type Feature from 'ol/Feature';

import { resolveGeodesyNetworkFilterCategories } from './geodesyNetworkFilterCategories';
import { isEmptyGeodesyAttributeValue } from '../interaction/geodesyFeatureAttributes';
import { readGeodesyWfsBusinessId } from '../wfs/geodesyWfsFeatureId';
import type { GeodesyWfsLayerId } from './wfs';

/** Identifiant d’un filtre attribut WFS (profil expert). */
export type GeodesyWfsAttributeFilterId = string;

/** Propriété OpenLayers du groupe géodésie : valeurs des filtres attributs actifs. */
export const GEODESY_WFS_ATTRIBUTE_FILTER_VALUES_PROPERTY = 'geodesyWfsAttributeFilterValues';

export interface GeodesyWfsAttributeFilterDefinitionBase {
  id: GeodesyWfsAttributeFilterId;
  title: string;
  /** Propriété feature WFS (ex. `img1_url`, `vis_date`, `proprio_id`). */
  property: string;
  /**
   * Couche WFS portant la propriété (ex. `GDP` pour `proprio_id`).
   * Si absent, la couche source des filtres domaine est utilisée.
   */
  wfsLayerId?: GeodesyWfsLayerId;
}

/** Filtre oui/non sur présence d’une valeur (ex. photo `img1_url`). */
export interface GeodesyWfsBooleanFilterDefinition extends GeodesyWfsAttributeFilterDefinitionBase {
  type: 'boolean';
  trueLabel?: string;
  falseLabel?: string;
}

/** Filtre date (ex. `vis_date` inférieure à une date). */
export interface GeodesyWfsDateFilterDefinition extends GeodesyWfsAttributeFilterDefinitionBase {
  type: 'date';
  operator: 'before' | 'after';
}

/** Filtre texte (égalité, contient…). */
export interface GeodesyWfsTextFilterDefinition extends GeodesyWfsAttributeFilterDefinitionBase {
  type: 'text';
  operator?: 'equals' | 'contains' | 'notEquals';
  placeholder?: string;
}

export interface GeodesyWfsChoiceFilterOption {
  value: string;
  label: string;
  /** Toutes les valeurs sauf les autres options explicites (ex. « Autre »). */
  matchOthers?: boolean;
}

/** Filtre à choix (ex. propriétaire IGN / autre). */
export interface GeodesyWfsChoiceFilterDefinition extends GeodesyWfsAttributeFilterDefinitionBase {
  type: 'choice';
  options: readonly GeodesyWfsChoiceFilterOption[];
}

/** Filtre à choix multiples (ex. RBF / RDF / Triplet / Non triplet). */
export interface GeodesyWfsMultiChoiceFilterDefinition extends GeodesyWfsAttributeFilterDefinitionBase {
  type: 'multiChoice';
  options: readonly GeodesyWfsChoiceFilterOption[];
  /**
   * Stratégie de classification des repères.
   * Défaut : `network-category`.
   */
  matcher?: 'network-category';
}

export type GeodesyWfsAttributeFilterDefinition =
  | GeodesyWfsBooleanFilterDefinition
  | GeodesyWfsDateFilterDefinition
  | GeodesyWfsTextFilterDefinition
  | GeodesyWfsChoiceFilterDefinition
  | GeodesyWfsMultiChoiceFilterDefinition;

/**
 * Valeurs actives des filtres.
 * Clé absente, `null` ou `undefined` → filtre inactif.
 * - `boolean` : `true` = propriété renseignée, `false` = vide
 * - `date` / `text` / `choice` : chaîne non vide
 */
export type GeodesyWfsAttributeFilterValues = Partial<
  Record<GeodesyWfsAttributeFilterId, boolean | string | null | undefined>
>;

/** Conteneur mutable partagé entre le groupe OL et les styles WFS. */
export interface GeodesyWfsAttributeFilterValuesHolder {
  values: GeodesyWfsAttributeFilterValues;
  /** Attributs indexés par identifiant métier pour les couches WFS auxiliaires aux filtres. */
  auxiliaryPropertiesByLayerId?: ReadonlyMap<
    GeodesyWfsLayerId,
    ReadonlyMap<string, Readonly<Record<string, unknown>>>
  >;
}

export function createGeodesyWfsAttributeFilterValuesHolder(
  values: GeodesyWfsAttributeFilterValues = {},
): GeodesyWfsAttributeFilterValuesHolder {
  return { values: { ...values } };
}

/** Filtres attributs documentés (profil expert — surchargeables par l’app cliente). */
export const DEFAULT_GEODESY_EXPERT_WFS_ATTRIBUTE_FILTERS: readonly GeodesyWfsAttributeFilterDefinition[] =
  [
    {
      id: 'HAS_PHOTO',
      type: 'boolean',
      title: 'Photo',
      property: 'img1_url',
      trueLabel: 'Oui',
      falseLabel: 'Non',
    },
    {
      id: 'DATE_PHOTO',
      type: 'date',
      title: 'Date Photo',
      property: 'img1_date',
      operator: 'before',
    },
    {
      id: 'VIS_DATE_BEFORE',
      type: 'date',
      title: 'Date de visite avant',
      property: 'vis_date',
      operator: 'before',
    },
    {
      id: 'PROPRIO',
      type: 'choice',
      title: 'Propriétaire',
      property: 'proprio_sigle',
      options: [
        { value: 'IGN', label: 'IGN' },
        { value: '__other__', label: 'Autre', matchOthers: true },
      ],
    },
    {
      id: 'GPS',
      type: 'choice',
      title: 'Exploitation GPS',
      property: 'expl_gps',
      options: [
        { value: 'EXPLOITABLE DIRECTEMENT PAR GNSS', label: 'DIRECTEMENT' },
        { value: 'EXPLOITABLE PAR GNSS DEPUIS UNE STATION EXCENTREE', label: 'STATION EXCENTREE', matchOthers: true },
        { value: 'INEXPLOITABLE PAR GNSS', label: 'NON EXPLOITABLE' },
        { value: '__other__', label: 'Autre', matchOthers: true },
      ],
    },
    {
      id: 'LOCALISATION_CONTAINS',
      type: 'text',
      title: 'Localisation contient',
      property: 'localisation',
      operator: 'contains',
      placeholder: 'ex. Borne frontiere',
    },
    {
      id: 'G',
      type: 'boolean',
      title: 'G',
      property: 'g',
      trueLabel: 'Oui',
      falseLabel: 'Non',
    },
  ];

function readFeatureProperty(feature: Feature, property: string): unknown {
  return feature.get(property) ?? feature.get(property.toUpperCase());
}

function readRecordProperty(record: Readonly<Record<string, unknown>>, property: string): unknown {
  return record[property] ?? record[property.toUpperCase()];
}

export type GeodesyWfsAttributeFilterAuxiliaryProperties = ReadonlyMap<
  GeodesyWfsLayerId,
  ReadonlyMap<string, Readonly<Record<string, unknown>>>
>;

/** Couches WFS à charger en auxiliaire pour les filtres attributs (hors couche source domaine). */
export function resolveGeodesyWfsAttributeFilterAuxiliaryLayerIds(
  definitions: readonly GeodesyWfsAttributeFilterDefinition[],
  domainSourceLayerId?: GeodesyWfsLayerId,
): GeodesyWfsLayerId[] {
  const layerIds = new Set<GeodesyWfsLayerId>();

  for (const definition of definitions) {
    if (!definition.wfsLayerId) {
      continue;
    }

    if (domainSourceLayerId && definition.wfsLayerId === domainSourceLayerId) {
      continue;
    }

    layerIds.add(definition.wfsLayerId);
  }

  return [...layerIds];
}

function readWfsAttributeFilterProperty(
  feature: Feature,
  definition: GeodesyWfsAttributeFilterDefinitionBase,
  options: {
    domainSourceLayerId?: GeodesyWfsLayerId;
    auxiliaryPropertiesByLayerId?: GeodesyWfsAttributeFilterAuxiliaryProperties;
  } = {},
): unknown {
  const { domainSourceLayerId, auxiliaryPropertiesByLayerId } = options;

  if (
    definition.wfsLayerId &&
    domainSourceLayerId &&
    definition.wfsLayerId !== domainSourceLayerId
  ) {
    const businessId = readGeodesyWfsBusinessId(feature.getProperties());
    if (!businessId) {
      return undefined;
    }

    const auxiliaryProperties = auxiliaryPropertiesByLayerId?.get(definition.wfsLayerId)?.get(businessId);
    if (!auxiliaryProperties) {
      return undefined;
    }

    return readRecordProperty(auxiliaryProperties, definition.property);
  }

  return readFeatureProperty(feature, definition.property);
}

function normalizeText(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }

  return String(value).trim();
}

function parseGeodesyFilterDate(value: unknown): number | null {
  const raw = normalizeText(value);
  if (!raw) {
    return null;
  }

  const iso = Date.parse(raw);
  if (!Number.isNaN(iso)) {
    return iso;
  }

  const frMatch = raw.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/);
  if (frMatch) {
    const [, day, month, year] = frMatch;
    const parsed = Date.parse(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
    return Number.isNaN(parsed) ? null : parsed;
  }

  return null;
}

function featureMatchesBooleanFilter(
  feature: Feature,
  definition: GeodesyWfsBooleanFilterDefinition,
  filterValue: boolean,
  filterContext: GeodesyWfsAttributeFilterMatchContext,
): boolean {
  const hasValue = !isEmptyGeodesyAttributeValue(
    readWfsAttributeFilterProperty(feature, definition, filterContext),
  );
  return filterValue ? hasValue : !hasValue;
}

function featureMatchesDateFilter(
  feature: Feature,
  definition: GeodesyWfsDateFilterDefinition,
  filterValue: string,
  filterContext: GeodesyWfsAttributeFilterMatchContext,
): boolean {
  const featureDate = parseGeodesyFilterDate(
    readWfsAttributeFilterProperty(feature, definition, filterContext),
  );
  const limitDate = parseGeodesyFilterDate(filterValue);

  if (featureDate === null || limitDate === null) {
    return false;
  }

  return definition.operator === 'before' ? featureDate < limitDate : featureDate > limitDate;
}

function featureMatchesTextFilter(
  feature: Feature,
  definition: GeodesyWfsTextFilterDefinition,
  filterValue: string,
  filterContext: GeodesyWfsAttributeFilterMatchContext,
): boolean {
  const haystack = normalizeText(
    readWfsAttributeFilterProperty(feature, definition, filterContext),
  ).toLowerCase();
  const needle = filterValue.trim().toLowerCase();

  if (!needle) {
    return true;
  }

  switch (definition.operator ?? 'equals') {
    case 'contains':
      return haystack.includes(needle);
    case 'notEquals':
      return haystack !== needle;
    default:
      return haystack === needle;
  }
}

function featureMatchesChoiceFilter(
  feature: Feature,
  definition: GeodesyWfsChoiceFilterDefinition,
  filterValue: string,
  filterContext: GeodesyWfsAttributeFilterMatchContext,
): boolean {
  const raw = normalizeText(readWfsAttributeFilterProperty(feature, definition, filterContext));
  const normalized = raw.toLowerCase();
  const selected = definition.options.find((option) => option.value === filterValue);

  if (!selected) {
    return true;
  }

  if (selected.matchOthers) {
    const explicitValues = definition.options
      .filter((option) => !option.matchOthers)
      .map((option) => option.value.toLowerCase());
    return !explicitValues.includes(normalized);
  }

  return normalized === selected.value.toLowerCase();
}

function parseMultiChoiceSelections(value: string): Set<string> {
  return new Set(
    value
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean),
  );
}

export function getGeodesyWfsMultiChoiceSelectedValues(
  definition: GeodesyWfsMultiChoiceFilterDefinition,
  value: boolean | string | null | undefined,
): Set<string> {
  if (value === null || value === undefined) {
    return new Set(definition.options.map((option) => option.value));
  }

  if (typeof value === 'string' && value.trim() === '') {
    return new Set();
  }

  if (typeof value !== 'string') {
    return new Set(definition.options.map((option) => option.value));
  }

  return parseMultiChoiceSelections(value);
}

function featureMatchesMultiChoiceFilter(
  feature: Feature,
  definition: GeodesyWfsMultiChoiceFilterDefinition,
  filterValue: string,
  _filterContext: GeodesyWfsAttributeFilterMatchContext,
): boolean {
  const selected = parseMultiChoiceSelections(filterValue);
  if (selected.size === 0) {
    return false;
  }

  if (selected.size >= definition.options.length) {
    return true;
  }

  const categories = resolveGeodesyNetworkFilterCategories(feature.getProperties());
  return categories.some((category) => selected.has(category));
}

function isActiveFilterValue(
  definition: GeodesyWfsAttributeFilterDefinition,
  value: boolean | string | null | undefined,
): boolean {
  if (value === null || value === undefined) {
    return false;
  }

  if (definition.type === 'multiChoice') {
    if (typeof value !== 'string') {
      return false;
    }

    const selected = parseMultiChoiceSelections(value);
    return selected.size < definition.options.length;
  }

  if (typeof value === 'boolean') {
    return true;
  }

  return value.trim() !== '';
}

export interface GeodesyWfsAttributeFilterMatchContext {
  domainSourceLayerId?: GeodesyWfsLayerId;
  auxiliaryPropertiesByLayerId?: GeodesyWfsAttributeFilterAuxiliaryProperties;
}

function featureMatchesFilterDefinition(
  feature: Feature,
  definition: GeodesyWfsAttributeFilterDefinition,
  filterValue: boolean | string,
  filterContext: GeodesyWfsAttributeFilterMatchContext,
): boolean {
  switch (definition.type) {
    case 'boolean':
      return featureMatchesBooleanFilter(feature, definition, filterValue as boolean, filterContext);
    case 'date':
      return featureMatchesDateFilter(feature, definition, String(filterValue), filterContext);
    case 'text':
      return featureMatchesTextFilter(feature, definition, String(filterValue), filterContext);
    case 'choice':
      return featureMatchesChoiceFilter(feature, definition, String(filterValue), filterContext);
    case 'multiChoice':
      return featureMatchesMultiChoiceFilter(feature, definition, String(filterValue), filterContext);
    default:
      return true;
  }
}

function featureMatchesAttributeFilters(
  feature: Feature,
  definitions: readonly GeodesyWfsAttributeFilterDefinition[],
  values: GeodesyWfsAttributeFilterValues,
  filterContext: GeodesyWfsAttributeFilterMatchContext,
): boolean {
  for (const definition of definitions) {
    const filterValue = values[definition.id];
    if (!isActiveFilterValue(definition, filterValue)) {
      continue;
    }

    if (
      !featureMatchesFilterDefinition(feature, definition, filterValue as boolean | string, filterContext)
    ) {
      return false;
    }
  }

  return true;
}

/** True si la feature (ou un membre cluster) passe tous les filtres attributs actifs. */
export function geodesyWfsFeatureMatchesAttributeFilters(
  feature: Feature,
  definitions: readonly GeodesyWfsAttributeFilterDefinition[],
  values: GeodesyWfsAttributeFilterValues,
  filterContext: GeodesyWfsAttributeFilterMatchContext = {},
): boolean {
  if (!definitions.length) {
    return true;
  }

  const hasActiveFilter = definitions.some((definition) =>
    isActiveFilterValue(definition, values[definition.id]),
  );

  if (!hasActiveFilter) {
    return true;
  }

  const members = feature.get('features') as Feature[] | undefined;

  if (members?.length) {
    return members.some((member) =>
      featureMatchesAttributeFilters(member, definitions, values, filterContext),
    );
  }

  return featureMatchesAttributeFilters(feature, definitions, values, filterContext);
}

export function countActiveGeodesyWfsAttributeFilters(
  definitions: readonly GeodesyWfsAttributeFilterDefinition[],
  values: GeodesyWfsAttributeFilterValues,
): number {
  return definitions.filter((definition) => isActiveFilterValue(definition, values[definition.id]))
    .length;
}

export function createDefaultGeodesyWfsAttributeFilterValues(
  definitions: readonly GeodesyWfsAttributeFilterDefinition[] = [],
): GeodesyWfsAttributeFilterValues {
  return Object.fromEntries(definitions.map((definition) => [definition.id, null]));
}
