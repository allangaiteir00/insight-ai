export interface InsightGanttItem {
    id: string;
    title: string;
    start: Date;
    end: Date;
    progress?: number; // 0-100
    color?: string;
    type?: 'task' | 'milestone' | 'project';
    origin?: any;
    parentId?: string;
    expanded?: boolean;
    children?: InsightGanttItem[];
    dependencies?: string[]; // IDs of tasks this one depends on
}

export interface GanttDependency {
    fromId: string;
    toId: string;
    type: 'FS' | 'SS' | 'FF' | 'SF';
}

export interface GanttMarker {
    id: string;
    date: Date;
    label: string;
    color?: string;
}

export type GanttViewScale = 'day' | 'week' | 'month';

export interface GanttColumn {
    name: string;
    field: string;
    width?: number;
    type?: 'text' | 'date' | 'progress';
}

export interface GanttCoordinate {
    id: string;
    x: number;
    y: number;
    width: number;
    item: InsightGanttItem;
}
