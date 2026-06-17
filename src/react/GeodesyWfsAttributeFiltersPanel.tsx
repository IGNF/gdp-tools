import type {
  GeodesyWfsAttributeFilterDefinition,
  GeodesyWfsAttributeFilterValues,
} from '../constants/wfsAttributeFilters';

import styles from './GeodesyWfsAttributeFiltersPanel.module.css';

export interface GeodesyWfsAttributeFiltersPanelProps {
  filters: readonly GeodesyWfsAttributeFilterDefinition[];
  values: GeodesyWfsAttributeFilterValues;
  onChange: (values: GeodesyWfsAttributeFilterValues) => void;
  onClear?: () => void;
  className?: string;
}

function updateValue(
  values: GeodesyWfsAttributeFilterValues,
  id: string,
  value: boolean | string | null,
): GeodesyWfsAttributeFilterValues {
  return { ...values, [id]: value };
}

function BooleanFilterControl({
  definition,
  value,
  onChange,
}: {
  definition: Extract<GeodesyWfsAttributeFilterDefinition, { type: 'boolean' }>;
  value: boolean | string | null | undefined;
  onChange: (value: boolean | string | null) => void;
}) {
  const trueLabel = definition.trueLabel ?? 'Oui';
  const falseLabel = definition.falseLabel ?? 'Non';

  return (
    <div className={styles.segmented} role="group" aria-label={definition.title}>
      <button
        type="button"
        className={styles.segment}
        data-active={value === null || value === undefined ? 'true' : undefined}
        onClick={() => onChange(null)}
      >
        Tous
      </button>
      <button
        type="button"
        className={styles.segment}
        data-active={value === true ? 'true' : undefined}
        onClick={() => onChange(true)}
      >
        {trueLabel}
      </button>
      <button
        type="button"
        className={styles.segment}
        data-active={value === false ? 'true' : undefined}
        onClick={() => onChange(false)}
      >
        {falseLabel}
      </button>
    </div>
  );
}

function DateFilterControl({
  value,
  onChange,
}: {
  definition: Extract<GeodesyWfsAttributeFilterDefinition, { type: 'date' }>;
  value: boolean | string | null | undefined;
  onChange: (value: boolean | string | null) => void;
}) {
  const active = typeof value === 'string';

  const handleToggle = (checked: boolean) => {
    if (!checked) {
      onChange(null);
      return;
    }

    if (typeof value === 'string' && value.length > 0) {
      onChange(value);
      return;
    }

    onChange(new Date().toISOString().slice(0, 10));
  };

  return (
    <div className={styles.dateRow}>
      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          checked={active}
          onChange={(event) => handleToggle(event.target.checked)}
        />
        Activer
      </label>
      <input
        type="date"
        className={styles.dateInput}
        value={typeof value === 'string' ? value : ''}
        disabled={!active}
        onChange={(event) => onChange(event.target.value || null)}
      />
    </div>
  );
}

function TextFilterControl({
  definition,
  value,
  onChange,
}: {
  definition: Extract<GeodesyWfsAttributeFilterDefinition, { type: 'text' }>;
  value: boolean | string | null | undefined;
  onChange: (value: boolean | string | null) => void;
}) {
  const active = typeof value === 'string';

  return (
    <div className={styles.textRow}>
      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          checked={active}
          onChange={(event) => onChange(event.target.checked ? String(value ?? '') : null)}
        />
        Activer
      </label>
      <input
        type="text"
        className={styles.textInput}
        value={typeof value === 'string' ? value : ''}
        disabled={!active}
        placeholder={definition.placeholder ?? ''}
        onChange={(event) => onChange(event.target.value || null)}
      />
    </div>
  );
}

function ChoiceFilterControl({
  definition,
  value,
  onChange,
}: {
  definition: Extract<GeodesyWfsAttributeFilterDefinition, { type: 'choice' }>;
  value: boolean | string | null | undefined;
  onChange: (value: boolean | string | null) => void;
}) {
  return (
    <select
      className={styles.select}
      value={typeof value === 'string' ? value : ''}
      onChange={(event) => onChange(event.target.value || null)}
    >
      <option value="">Tous</option>
      {definition.options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

/** Panneau de filtres attributs WFS (profil expert). */
export function GeodesyWfsAttributeFiltersPanel({
  filters,
  values,
  onChange,
  onClear,
  className,
}: GeodesyWfsAttributeFiltersPanelProps) {
  if (!filters.length) {
    return null;
  }

  return (
    <div className={[styles.panel, className].filter(Boolean).join(' ')}>
      {filters.map((definition) => (
        <div key={definition.id} className={styles.filterRow}>
          <span className={styles.filterLabel}>{definition.title}</span>
          {definition.type === 'boolean' ? (
            <BooleanFilterControl
              definition={definition}
              value={values[definition.id]}
              onChange={(next) => onChange(updateValue(values, definition.id, next))}
            />
          ) : null}
          {definition.type === 'date' ? (
            <DateFilterControl
              definition={definition}
              value={values[definition.id]}
              onChange={(next) => onChange(updateValue(values, definition.id, next))}
            />
          ) : null}
          {definition.type === 'text' ? (
            <TextFilterControl
              definition={definition}
              value={values[definition.id]}
              onChange={(next) => onChange(updateValue(values, definition.id, next))}
            />
          ) : null}
          {definition.type === 'choice' ? (
            <ChoiceFilterControl
              definition={definition}
              value={values[definition.id]}
              onChange={(next) => onChange(updateValue(values, definition.id, next))}
            />
          ) : null}
        </div>
      ))}
      {onClear ? (
        <button type="button" className={styles.clearButton} onClick={onClear}>
          Réinitialiser les filtres
        </button>
      ) : null}
    </div>
  );
}
