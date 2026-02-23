import { computed, inject, Injectable, signal } from '@angular/core';
import { IdentityService } from '../../services/identity.service';
import { EntityRecord } from '../models/entity.model';

@Injectable({ providedIn: 'root' })
export class EntityDataService {
    private readonly identityService = inject(IdentityService);

    // Estado centralizado: Record de EntityId para um sinal com a lista de registros
    private readonly _recordsMap = signal<Record<string, EntityRecord[]>>({});

    constructor() {
        this.seedInitialData();
    }

    /** 
     * Retorna um sinal com os registros de uma entidade específica.
     * Implementa filtragem automática por Tenant (SaaS Isolation).
     */
    getRecords(entityId: string) {
        return computed(() => {
            const allRecords = this._recordsMap()[entityId] || [];
            const currentTenantId = this.identityService.currentTenant()?.id;

            // Se for uma entidade de sistema (como tenants), mostra tudo ou aplica regras específicas.
            // Para as demais, filtra pelo tenantId no contexto.
            if (['tenants', 'roles'].includes(entityId)) return allRecords;

            return allRecords.filter(rec =>
                !rec.data['tenantId'] || rec.data['tenantId'] === currentTenantId
            );
        });
    }

    /** Adiciona um novo registro a uma entidade, injetando automaticamente o tenantId atual */
    addRecord(entityId: string, data: Record<string, any>) {
        const currentTenantId = this.identityService.currentTenant()?.id;

        const newRecord: EntityRecord = {
            id: data['id'] || `${entityId.slice(0, 3)}-${Date.now()}`,
            data: {
                ...data,
                tenantId: data['tenantId'] || currentTenantId // Injeção automática de Tenancy
            }
        };

        this._recordsMap.update(prev => ({
            ...prev,
            [entityId]: [...(prev[entityId] || []), newRecord]
        }));

        return newRecord;
    }

    /** Atualiza um registro existente */
    updateRecord(entityId: string, recordId: string, data: Partial<Record<string, any>>) {
        this._recordsMap.update(prev => {
            const records = prev[entityId] || [];
            const updatedRecords = records.map(rec =>
                rec.id === recordId
                    ? { ...rec, data: { ...rec.data, ...data } }
                    : rec
            );

            return {
                ...prev,
                [entityId]: updatedRecords
            };
        });
    }

    /** Remove um registro */
    deleteRecord(entityId: string, recordId: string) {
        this._recordsMap.update(prev => ({
            ...prev,
            [entityId]: (prev[entityId] || []).filter(rec => rec.id !== recordId)
        }));
    }

    private seedInitialData() {
        // --- Seed IAM Data (IDs devem bater com IdentityService para o Allan) ---
        this.addRecord('tenants', { id: 'ten-acme', name: 'Acme Corp', domain: 'acme.com', plan: 'pro' });
        this.addRecord('tenants', { id: 'ten-stark', name: 'Stark Industries', domain: 'stark.com', plan: 'ent' });

        this.addRecord('roles', { id: 'rol-admin', name: 'Admin', description: 'Acesso total', permissions: '*' });
        this.addRecord('roles', { id: 'rol-viewer', name: 'Viewer', description: 'Apenas leitura', permissions: 'view:*' });

        // Allan Gaiteiro na Acme
        this.addRecord('users', {
            name: 'Allan Gaiteiro',
            email: 'allan@acme.com',
            status: 'active',
            roleId: 'rol-admin',
            tenantId: 'ten-acme'
        });

        // Tony Stark na Stark Industries
        this.addRecord('users', {
            name: 'Tony Stark',
            email: 'tony@stark.com',
            status: 'active',
            roleId: 'rol-admin',
            tenantId: 'ten-stark'
        });

        // Negócio (Acme)
        this.addRecord('tasks', { title: 'Corrigir bug de layout', status: 'todo', dueDate: '2026-02-22', tenantId: 'ten-acme' });
        this.addRecord('tasks', { title: 'Implementar Kanban Engine', status: 'doing', dueDate: '2026-02-21', tenantId: 'ten-acme' });
        this.addRecord('customers', { name: 'Acme Corp Client', email: 'contato@acme.com', tier: 'pro', tenantId: 'ten-acme' });

        this.addRecord('projects', {
            name: 'Reforma Sede Alpha',
            start_date: '2026-02-01',
            end_date: '2026-02-15',
            status: 'active',
            lat: -23.5505,
            lng: -46.6333,
            tenantId: 'ten-acme'
        });

        // Negócio (Stark)
        this.addRecord('projects', {
            name: 'Deploy Cloud Infra',
            start_date: '2026-02-15',
            end_date: '2026-02-28',
            status: 'planned',
            lat: 40.7128,
            lng: -74.0060,
            tenantId: 'ten-stark'
        });

        this.addRecord('groups', { name: 'Engenharia', tenantId: 'ten-acme' });
        this.addRecord('groups', { name: 'Diretoria', tenantId: 'ten-stark' });
    }
}
