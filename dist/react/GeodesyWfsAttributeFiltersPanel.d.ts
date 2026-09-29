import type { GeodesyWfsAttributeFilterDefinition, GeodesyWfsAttributeFilterValues } from '../constants/wfsAttributeFilters';
export interface GeodesyWfsAttributeFiltersPanelProps {
    filters: readonly GeodesyWfsAttributeFilterDefinition[];
    values: GeodesyWfsAttributeFilterValues;
    onChange: (values: GeodesyWfsAttributeFilterValues) => void;
    onClear?: () => void;
    className?: string;
}
/** Panneau de filtres attributs WFS (profil expert). */
export declare function GeodesyWfsAttributeFiltersPanel({ filters, values, onChange, onClear, className, }: GeodesyWfsAttributeFiltersPanelProps): import("react").JSX.Element | null;
//# sourceMappingURL=GeodesyWfsAttributeFiltersPanel.d.ts.map