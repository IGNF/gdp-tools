import styles from './MapLayerSwitcher.module.css';

export interface MapLayerOption {
  id: string;
  label: string;
  title?: string;
}

interface MapLayerSwitcherBaseProps {
  options: readonly MapLayerOption[];
  groupLabel?: string;
  className?: string;
}

interface SingleSelectProps extends MapLayerSwitcherBaseProps {
  mode: 'single';
  activeId: string;
  onActiveIdChange: (id: string) => void;
}

interface MultiSelectProps extends MapLayerSwitcherBaseProps {
  mode: 'multiple';
  activeIds: Record<string, boolean>;
  onToggle: (id: string) => void;
}

export type MapLayerSwitcherProps = SingleSelectProps | MultiSelectProps;

function isLayerActive(props: MapLayerSwitcherProps, optionId: string): boolean {
  if (props.mode === 'single') {
    return props.activeId === optionId;
  }
  return Boolean(props.activeIds[optionId]);
}

function handleLayerClick(props: MapLayerSwitcherProps, optionId: string): void {
  if (props.mode === 'single') {
    props.onActiveIdChange(optionId);
    return;
  }
  props.onToggle(optionId);
}

/** Pastilles de sélection de fonds / couches (charte EspaceCo via variables CSS globales). */
export function MapLayerSwitcher(props: MapLayerSwitcherProps) {
  const { options, groupLabel, className } = props;
  const rootClassName = className ? `${styles.switcher} ${className}` : styles.switcher;

  return (
    <div className={rootClassName} role="group" aria-label={groupLabel}>
      {groupLabel ? <span className={styles.groupLabel}>{groupLabel}</span> : null}
      {options.map((option) => {
        const active = isLayerActive(props, option.id);
        return (
          <button
            key={option.id}
            type="button"
            title={option.title}
            className={`${styles.layerButton} ${active ? styles.layerButtonActive : ''}`}
            aria-pressed={props.mode === 'multiple' ? active : undefined}
            onClick={() => handleLayerClick(props, option.id)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
