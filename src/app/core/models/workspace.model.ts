export type WidgetType = 'chart-line' | 'chart-bar' | 'chart-bar-horizontal' | 'chart-pie' | 'chart-area' | 'chart-heatmap' | 'chart-boxplot' | 'chart-mixed' | 'metric' | 'table' | 'text' | 'form' | 'kanban' | 'list' | 'action-button' | 'entity-card' | 'filter' | 'gantt' | 'map' | 'calendar';

export type WorkspacePalette = 'indigo' | 'violet' | 'sky' | 'emerald' | 'rose';

export type WidgetState = 'normal' | 'mock' | 'error';

export interface WidgetConfig {
    title: string;
    subtitle?: string;
    dataUrl?: string;
    refreshInterval?: number;
    customSettings?: Record<string, any>;
    mappings?: Record<string, string>;
    hideCard?: boolean;
}

export interface WidgetPosition {
    x: number;
    y: number;
    w: number;
    h: number;
}

export interface Widget {
    readonly id: string;
    readonly type: WidgetType;
    config: WidgetConfig;
    position: WidgetPosition;
    mappings?: Record<string, string>;
}

export interface Filter {
    readonly id: string;
    label: string;
    type: 'select' | 'date' | 'text' | 'multi-select';
    key: string;
    options?: { label: string; value: any }[];
    value?: any;
}

export interface WorkspaceVersion {
    readonly id: string;
    readonly dashboardId: string;
    versionNumber: number;
    widgets: Widget[];
    filters: Filter[];
    isActive: boolean;
    createdAt: string;
    palette?: WorkspacePalette;
}

export interface Workspace {
    readonly id: string;
    readonly tenantId: string;
    name: string;
    activeVersionId?: string;
}
