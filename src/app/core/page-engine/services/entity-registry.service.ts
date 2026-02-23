import { computed, Injectable, signal } from '@angular/core';
import { EntityDefinition } from '../models/entity.model';

@Injectable({ providedIn: 'root' })
export class EntityRegistryService {
    private readonly _entities = signal<Map<string, EntityDefinition>>(new Map());

    readonly entities = computed(() => Array.from(this._entities().values()));

    constructor() {
        this.registerSampleEntities();
    }

    registerEntity(entity: EntityDefinition): void {
        this._entities.update(map => {
            const newMap = new Map(map);
            newMap.set(entity.id, entity);
            return newMap;
        });
    }

    getEntity(id: string): EntityDefinition | undefined {
        return this._entities().get(id);
    }

    /**
     * Finds entities that have a relationship pointing to the given parent entity.
     */
    getChildEntities(parentId: string): EntityDefinition[] {
        return this.entities().filter(e =>
            e.relations?.some(r => r.toEntityId === parentId)
        );
    }

    private registerSampleEntities(): void {
        // --- IAM & SaaS Core Entities (Priority Visibility) ---

        this.registerEntity({
            id: 'tenants',
            name: 'Organizações',
            label: 'Tenants & Clientes B2B',
            fields: [
                { key: 'name', label: 'Nome da Org', type: 'string', required: true },
                { key: 'domain', label: 'Domínio', type: 'string' },
                {
                    key: 'plan', label: 'Plano', type: 'select', options: [
                        { label: 'Free', value: 'free' },
                        { label: 'Pro', value: 'pro' },
                        { label: 'Enterprise', value: 'ent' }
                    ]
                }
            ],
            actions: [
                { id: 'add', label: 'Nova Org', type: 'create' },
                { id: 'edit', label: 'Configurar', type: 'update' }
            ]
        });

        this.registerEntity({
            id: 'users',
            name: 'Usuários',
            label: 'Gestão de Usuários',
            fields: [
                { key: 'name', label: 'Nome', type: 'string', required: true },
                { key: 'email', label: 'E-mail', type: 'string', required: true },
                {
                    key: 'status', label: 'Status', type: 'select', options: [
                        { label: 'Ativo', value: 'active' },
                        { label: 'Inativo', value: 'inactive' },
                        { label: 'Pendente', value: 'pending' }
                    ]
                },
                { key: 'roleId', label: 'Perfil', type: 'relation', relationEntityId: 'roles' },
                { key: 'tenantId', label: 'Organização', type: 'relation', relationEntityId: 'tenants' }
            ],
            relations: [
                { fromEntityId: 'users', toEntityId: 'roles', type: 'one-to-many', foreignKey: 'roleId' },
                { fromEntityId: 'users', toEntityId: 'tenants', type: 'one-to-many', foreignKey: 'tenantId' }
            ]
        });

        this.registerEntity({
            id: 'roles',
            name: 'Papéis',
            label: 'Perfis de Acesso (RBAC)',
            fields: [
                { key: 'name', label: 'Nome do Perfil', type: 'string', required: true },
                { key: 'description', label: 'Descrição', type: 'string' },
                { key: 'permissions', label: 'Capabilities (JSON/CSV)', type: 'string' }
            ]
        });

        this.registerEntity({
            id: 'groups',
            name: 'Grupos',
            label: 'Grupos de Trabalho',
            fields: [
                { key: 'name', label: 'Nome do Grupo', type: 'string', required: true },
                { key: 'tenantId', label: 'Organização', type: 'relation', relationEntityId: 'tenants' }
            ],
            relations: [
                { fromEntityId: 'groups', toEntityId: 'tenants', type: 'one-to-many', foreignKey: 'tenantId' }
            ]
        });

        // --- Business Entities ---

        this.registerEntity({
            id: 'tasks',
            name: 'Tarefas',
            label: 'Gestão de Tarefas',
            url: 'https://api.insight-ai.io/v1/tasks',
            fields: [
                { key: 'id', label: 'ID', type: 'string' },
                { key: 'title', label: 'Título', type: 'string', required: true },
                {
                    key: 'status', label: 'Status', type: 'select', options: [
                        { label: 'Pendente', value: 'todo' },
                        { label: 'Fazendo', value: 'doing' },
                        { label: 'Feito', value: 'done' }
                    ]
                },
                { key: 'dueDate', label: 'Prazo', type: 'date' }
            ],
            actions: [
                { id: 'add', label: 'Nova Tarefa', type: 'create', icon: 'plus' },
                { id: 'edit', label: 'Editar', type: 'update' },
                { id: 'delete', label: 'Excluir', type: 'delete' }
            ],
            relations: [
                {
                    fromEntityId: 'tasks',
                    toEntityId: 'customers',
                    type: 'one-to-many',
                    foreignKey: 'customerId'
                }
            ]
        });

        this.registerEntity({
            id: 'customers',
            name: 'Clientes',
            label: 'Base de Clientes',
            url: 'https://api.insight-ai.io/v1/customers',
            fields: [
                { key: 'name', label: 'Nome Completo', type: 'string', required: true },
                { key: 'email', label: 'E-mail', type: 'string' },
                {
                    key: 'tier', label: 'Nível', type: 'select', options: [
                        { label: 'Gratuito', value: 'free' },
                        { label: 'Pro', value: 'pro' },
                        { label: 'Enterprise', value: 'enterprise' }
                    ]
                }
            ]
        });

        this.registerEntity({
            id: 'projects',
            name: 'Projetos',
            label: 'Cronograma de Projetos',
            url: 'https://api.insight-ai.io/v1/projects',
            fields: [
                { key: 'id', label: 'ID', type: 'string' },
                { key: 'name', label: 'Nome do Projeto', type: 'string', required: true },
                { key: 'start_date', label: 'Início', type: 'date' },
                { key: 'end_date', label: 'Previsão de Término', type: 'date' },
                { key: 'lat', label: 'Latitude', type: 'number' },
                { key: 'lng', label: 'Longitude', type: 'number' },
                {
                    key: 'status', label: 'Status', type: 'select', options: [
                        { label: 'Planejado', value: 'planned' },
                        { label: 'Em Execução', value: 'active' },
                        { label: 'Concluído', value: 'done' }
                    ]
                }
            ]
        });
    }
}
