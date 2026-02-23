export type InteractionType = 'recordSelected' | 'actionTriggered' | 'dataChanged' | 'filterApplied' | 'refresh';

export interface InteractionEvent<T = any> {
    sourceId: string;      // ID of the widget emitting the event
    type: InteractionType;
    entityId?: string;     // Contextual entity (optional)
    payload?: T;           // Event data (e.g. record ID)
    timestamp: number;
}

export interface InteractionConfig {
    emits: InteractionType[];
    listensTo: InteractionType[];
    targetChannel?: string;
}
