import { computed, Injectable, signal } from '@angular/core';
import { EntityRecord } from '../models/entity.model';

@Injectable({ providedIn: 'root' })
export class EntityDataService {
    // Estado centralizado: Record de EntityId para um sinal com a lista de registros
    private readonly _recordsMap = signal<Record<string, EntityRecord[]>>({});

    constructor() {
        this.seedInitialData();
    }

    /** Retorna um sinal com os registros de uma entidade específica */
    getRecords(entityId: string) {
        return computed(() => this._recordsMap()[entityId] || []);
    }

    /** Adiciona um novo registro a uma entidade */
    addRecord(entityId: string, data: Record<string, any>) {
        const newRecord: EntityRecord = {
            id: `${entityId.slice(0, 3)}-${Date.now()}`,
            data
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
        this.addRecord('tasks', { title: 'Corrigir bug de layout', status: 'todo', dueDate: '2026-02-22' });
        this.addRecord('tasks', { title: 'Implementar Kanban Engine', status: 'doing', dueDate: '2026-02-21' });

        this.addRecord('customers', { name: 'Acme Corp', email: 'contato@acme.com', tier: 'pro' });

        // Dados de Planejamento (Projetos)
        this.addRecord('projects', {
            name: 'Reforma Sede Alpha',
            start_date: '2026-02-01',
            end_date: '2026-02-15',
            status: 'active',
            lat: -23.5505,
            lng: -46.6333
        });
        this.addRecord('projects', {
            name: 'Deploy Cloud Infra',
            start_date: '2026-02-15',
            end_date: '2026-02-28',
            status: 'planned',
            lat: 40.7128,
            lng: -74.0060
        });
    }
}
