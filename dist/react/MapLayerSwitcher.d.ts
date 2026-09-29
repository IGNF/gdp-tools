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
/** Pastilles de sélection de fonds / couches (charte EspaceCo via variables CSS globales). */
export declare function MapLayerSwitcher(props: MapLayerSwitcherProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=MapLayerSwitcher.d.ts.map