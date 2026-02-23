export type EntityFieldType = 'string' | 'number' | 'date' | 'boolean' | 'select' | 'relation';

export interface EntityField {
    readonly key: string;
    readonly label: string;
    readonly type: EntityFieldType;
    readonly required?: boolean;
    readonly options?: { label: string; value: any }[];
    readonly relationEntityId?: string;
}

export interface EntityAction {
    readonly id: string;
    readonly label: string;
    readonly icon?: string;
    readonly type: 'create' | 'update' | 'delete' | 'custom';
}

export interface EntityDefinition {
    readonly id: string;
    readonly name: string;
    readonly label: string;
    readonly fields: EntityField[];
    readonly actions?: EntityAction[];
    readonly url?: string;
    readonly relations?: EntityRelation[];
}

export interface EntityRecord {
    readonly id: string;
    readonly data: Record<string, any>;
}

export interface EntityRelation {
    readonly fromEntityId: string;
    readonly toEntityId: string;
    readonly type: 'one-to-many' | 'many-to-many';
    readonly foreignKey: string;
}
