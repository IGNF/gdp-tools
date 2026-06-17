import {
  DEFAULT_GEODESY_CATALOG,
  type GeodesyCatalog,
} from '../catalog/geodesyCatalog';
import type { GeodesyLayerVisibility } from '../geodesyLayerVisibility';
import type { GeodesyWmsLayerId } from '../constants/wms';
import { MapLayerSwitcher } from './MapLayerSwitcher';

export interface GeodesyLayerSwitcherProps {
  visibility: GeodesyLayerVisibility;
  onToggle: (layerId: GeodesyWmsLayerId) => void;
  /** Catalogue des couches (catalogue IGN complet par défaut). */
  catalog?: GeodesyCatalog;
  groupLabel?: string;
  className?: string;
}

/** Sélecteur des couches WMS géodésie (RBF, RDF, RN, GRAV…). */
export function GeodesyLayerSwitcher({
  visibility,
  onToggle,
  catalog = DEFAULT_GEODESY_CATALOG,
  groupLabel = 'Géodésie',
  className,
}: GeodesyLayerSwitcherProps) {
  const options = catalog.uiLayers.map((layer) => ({
    id: layer.id,
    label: layer.shortLabel,
    title: layer.title,
  }));

  const activeIds = Object.fromEntries(
    options.map((layer) => [layer.id, visibility[layer.id] ?? false]),
  );

  return (
    <MapLayerSwitcher
      mode="multiple"
      groupLabel={groupLabel}
      options={options}
      activeIds={activeIds}
      onToggle={(id) => onToggle(id as GeodesyWmsLayerId)}
      className={className}
    />
  );
}
