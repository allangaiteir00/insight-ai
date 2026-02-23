import {
  CdkDragDrop,
  DragDropModule
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Widget } from '../../../core/models/dashboard.model';
import { EntityDefinition, EntityField, EntityRecord } from '../../../core/page-engine/models/entity.model';
import { EntityDataService } from '../../../core/page-engine/services/entity-data.service';
import { PageInteractionService } from '../../../core/page-engine/services/page-interaction.service';

interface KanbanColumn {
  label: string;
  value: any;
  records: EntityRecord[];
}

@Component({
  selector: 'app-kanban-widget',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  template: `
    <div class="kanban-wrapper" [class.is-empty]="!config().customSettings?.['statusFieldKey']">
      @if (!config().customSettings?.['statusFieldKey']) {
        <div class="setup-message">
          <p>Configuração Pendente: Selecione o Campo de Status nas configurações do widget.</p>
        </div>
      } @else {
        <div class="kanban-header">
          <div class="title-group">
            <h3>{{ config().title }}</h3>
            <span class="entity-badge">{{ entity().label }}</span>
          </div>
        </div>

        <div class="kanban-board" cdkDropListGroup>
          @for (column of columns(); track column.value) {
            <div class="kanban-column">
              <div class="column-header">
                <span class="column-name">{{ column.label }}</span>
                <span class="column-count">{{ column.records.length }}</span>
                <button class="btn-add-inline" (click)="addNewRecord(column.value)" title="Adicionar registro">+ Adicionar</button>
              </div>

              <div 
                class="column-body"
                cdkDropList
                [cdkDropListData]="column.records"
                (cdkDropListDropped)="onDrop($event, column.value)"
              >
                @for (record of column.records; track record.id) {
                  <div 
                    class="kanban-card" 
                    cdkDrag 
                    [cdkDragData]="record"
                    (click)="selectRecord(record.id)"
                  >
                    <div class="card-content">
                      <div class="card-title">{{ getRecordTitle(record) }}</div>
                      @if (getRecordSubtitle(record)) {
                        <div class="card-subtitle">{{ getRecordSubtitle(record) }}</div>
                      }
                    </div>
                    <div class="card-footer">
                      <span class="record-id">#{{ record.id.split('-').pop() }}</span>
                    </div>
                  </div>
                }
                @if (column.records.length === 0) {
                  <div class="empty-column-state">Solte aqui...</div>
                }
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; height: 100%; }
    .kanban-wrapper { display: flex; flex-direction: column; height: 100%; background: var(--color-surface); border-radius: var(--radius); border: 1px solid var(--color-border); overflow: hidden; }
    .is-empty { justify-content: center; align-items: center; }
    .setup-message { padding: 40px; text-align: center; color: var(--color-text-muted); font-weight: 600; font-size: 0.9rem; }
    
    .kanban-header { padding: 20px; background: var(--color-surface-card); border-bottom: 1px solid var(--color-border); }
    .title-group { display: flex; align-items: center; justify-content: space-between; }
    .title-group h3 { margin: 0; font-size: 1.1rem; font-weight: 700; color: var(--color-text-primary); }
    .entity-badge { font-size: 0.65rem; padding: 4px 10px; background: var(--color-primary-100); color: var(--color-primary-700); border-radius: var(--radius); font-weight: 800; text-transform: uppercase; }

    .kanban-board { flex: 1; display: flex; padding: 20px; gap: 20px; overflow-x: auto; }
    .kanban-column { flex: 1; min-width: 300px; max-width: 400px; display: flex; flex-direction: column; gap: 16px; background: color-mix(in srgb, var(--color-surface) 50%, transparent); border-radius: calc(var(--radius) * 0.8); border: 1px solid var(--color-border); padding: 12px; }
    
    .column-header { display: flex; align-items: center; gap: 10px; padding: 4px 8px; }
    .column-name { font-size: 0.85rem; font-weight: 800; color: var(--color-text-secondary); text-transform: uppercase; letter-spacing: 0.05em; }
    .column-count { font-size: 0.75rem; background: var(--color-surface-card); color: var(--color-text-muted); padding: 2px 8px; border-radius: calc(var(--radius) * 0.5); font-weight: 700; border: 1px solid var(--color-border); }
    .btn-add-inline { margin-left: auto; background: transparent; border: 1.5px dashed var(--color-border); color: var(--color-text-muted); font-size: 0.75rem; font-weight: 700; padding: 4px 12px; border-radius: calc(var(--radius) * 0.4); cursor: pointer; transition: all 0.2s; }
    .btn-add-inline:hover { background: var(--color-primary-50); border-color: var(--color-primary-400); color: var(--color-primary-600); }

    .column-body { flex: 1; display: flex; flex-direction: column; gap: 12px; min-height: 100px; }
    .kanban-card { background: var(--color-surface-card); border-radius: calc(var(--radius) * 0.7); padding: 16px; border: 1px solid var(--color-border); cursor: pointer; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); }
    .kanban-card:hover { transform: translateY(-3px); border-color: var(--color-primary-300); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
    .kanban-card:active { cursor: grabbing; scale: 0.98; }

    .card-title { font-size: 0.95rem; font-weight: 700; color: var(--color-text-primary); margin-bottom: 6px; line-height: 1.3; }
    .card-subtitle { font-size: 0.8rem; color: var(--color-text-secondary); margin-bottom: 12px; font-weight: 500; }
    .card-footer { border-top: 1px solid var(--color-border); padding-top: 10px; display: flex; align-items: center; }
    .record-id { font-size: 0.7rem; font-weight: 700; color: var(--color-text-muted); font-family: monospace; opacity: 0.6; }

    .empty-column-state { flex: 1; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; color: var(--color-text-secondary); font-style: italic; border: 2px dashed var(--color-border); border-radius: var(--radius); opacity: 0.5; }

    .cdk-drag-preview { box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2), 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12); }
    .cdk-drag-placeholder { opacity: 0.3; }
    .cdk-drag-animating { transition: transform 250ms cubic-bezier(0, 0, 0.2, 1); }
    .column-body.cdk-drop-list-dragging .kanban-card:not(.cdk-drag-placeholder) { transition: transform 250ms cubic-bezier(0, 0, 0.2, 1); }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KanbanWidgetComponent {
  config = input.required<Widget['config']>();
  entity = input.required<EntityDefinition>();

  private readonly dataService = inject(EntityDataService);
  private readonly interactionBus = inject(PageInteractionService);

  // Sinal de registros vindo do serviço transacional
  private readonly allRecords = computed(() => this.dataService.getRecords(this.entity().id)());

  // Configurações do Kanban
  protected readonly statusField = computed(() => {
    const key = this.config().customSettings?.['statusFieldKey'];
    return this.entity().fields.find((f: EntityField) => f.key === key);
  });

  protected readonly titleFieldKey = computed(() => this.config().customSettings?.['titleFieldKey']);
  protected readonly subtitleFieldKey = computed(() => this.config().customSettings?.['subtitleFieldKey']);

  // Colunas computadas com registros filtrados
  protected readonly columns = computed<KanbanColumn[]>(() => {
    const field = this.statusField();
    if (!field || !field.options) return [];

    return field.options.map((opt: { label: string; value: any }) => ({
      label: opt.label,
      value: opt.value,
      records: this.allRecords().filter((r: EntityRecord) => r.data[field.key] === opt.value)
    }));
  });

  getRecordTitle(record: EntityRecord): string {
    const key = this.titleFieldKey();
    return record.data[key || 'id'] || 'Sem título';
  }

  getRecordSubtitle(record: EntityRecord): string | null {
    const key = this.subtitleFieldKey();
    return key ? record.data[key] : null;
  }

  onDrop(event: CdkDragDrop<EntityRecord[]>, targetStatus: any) {
    const record = event.item.data as EntityRecord;
    const statusField = this.statusField();

    if (statusField && record.data[statusField.key] !== targetStatus) {
      // Persistência Transacional
      this.dataService.updateRecord(this.entity().id, record.id, {
        [statusField.key]: targetStatus
      });

      // Emite evento global de atualização
      this.interactionBus.emit({
        sourceId: this.config().title,
        type: 'dataChanged',
        entityId: this.entity().id,
        payload: { recordId: record.id }
      });
    }
  }

  addNewRecord(status: any) {
    const statusField = this.statusField();
    const titleField = this.titleFieldKey();

    const initialData: Record<string, any> = {};
    if (statusField) initialData[statusField.key] = status;
    if (titleField) initialData[titleField.key] = `Novo(a) ${this.entity().name}`;

    const record = this.dataService.addRecord(this.entity().id, initialData);

    this.interactionBus.emit({
      sourceId: this.config().title,
      type: 'dataChanged',
      entityId: this.entity().id,
      payload: { recordId: record.id }
    });

    // Seleciona automaticamente o novo registro para que o Formulário o carregue
    this.selectRecord(record.id);
  }

  selectRecord(id: string) {
    this.interactionBus.emit({
      sourceId: this.config().title,
      type: 'recordSelected',
      entityId: this.entity().id,
      payload: id
    });
  }
}
