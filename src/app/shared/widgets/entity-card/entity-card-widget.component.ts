import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Widget } from '../../../core/models/workspace.model';
import { EntityDefinition, EntityField, EntityRecord } from '../../../core/page-engine/models/entity.model';
import { EntityDataService } from '../../../core/page-engine/services/entity-data.service';

@Component({
  selector: 'app-entity-card-widget',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card-wrapper">
      @if (selectedRecord(); as record) {
        <div class="card-inner">
          <div class="card-header-main">
            <div class="avatar">{{ record.data['name']?.charAt(0) || record.data['title']?.charAt(0) || '?' }}</div>
            <div class="title-section">
              <h4>{{ record.data['name'] || record.data['title'] || 'Registro sem nome' }}</h4>
              <span class="id-tag">#{{ record.id }}</span>
            </div>
          </div>

          <div class="card-grid">
            @for (fieldKey of displayFields(); track fieldKey) {
              @if (getFieldMeta(fieldKey); as field) {
                <div class="field-item">
                  <span class="field-label">{{ field.label }}</span>
                  <span class="field-value">
                    @if (field.type === 'select') {
                      <span class="badge" [class]="record.data[fieldKey]">
                        {{ getOptionLabel(field, record.data[fieldKey]) }}
                      </span>
                    } @else if (field.type === 'boolean') {
                      <span class="badge" [class.done]="record.data[fieldKey]" [class.todo]="!record.data[fieldKey]">
                        {{ record.data[fieldKey] ? 'SIM' : 'NÃO' }}
                      </span>
                    } @else {
                      {{ record.data[fieldKey] || '---' }}
                    }
                  </span>
                </div>
              }
            }
          </div>
        </div>
      } @else {
        <div class="empty-selection">
          <div class="placeholder-icon">📇</div>
          <p>Selecione um item na lista ou kanban para ver os detalhes aqui.</p>
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; height: 100%; }
    .card-wrapper { height: 100%; background: var(--color-surface-card, rgba(255,255,255,0.03)); border-radius: var(--radius); overflow: hidden; display: flex; flex-direction: column; }
    
    .card-inner { padding: 24px; display: flex; flex-direction: column; gap: 24px; }
    
    .card-header-main { display: flex; align-items: center; gap: 16px; }
    .avatar { width: 56px; height: 56px; border-radius: calc(var(--radius) * 0.8); background: linear-gradient(135deg, var(--color-primary-400), var(--color-primary-600)); color: white; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 800; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 4px 12px color-mix(in srgb, var(--color-primary-600) 30%, transparent); }
    
    .title-section h4 { margin: 0; font-size: 1.2rem; font-weight: 800; color: var(--color-text-primary); letter-spacing: -0.02em; }
    .id-tag { font-size: 0.7rem; font-weight: 700; color: var(--color-text-secondary); background: var(--color-surface); padding: 4px 8px; border-radius: 6px; border: 1px solid var(--color-border); }

    .card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 20px; }
    .field-item { display: flex; flex-direction: column; gap: 4px; }
    .field-label { font-size: 0.7rem; font-weight: 700; color: var(--color-text-secondary); text-transform: uppercase; letter-spacing: 0.05em; opacity: 0.7; }
    .field-value { font-size: 0.95rem; font-weight: 600; color: var(--color-text-primary); }

    .badge { font-size: 0.75rem; padding: 4px 12px; border-radius: var(--radius); font-weight: 700; background: var(--color-surface); color: var(--color-text-primary); border: 1px solid var(--color-border); }
    .badge.todo { background: color-mix(in srgb, #f59e0b 15%, transparent); color: #f59e0b; border-color: color-mix(in srgb, #f59e0b 20%, transparent); }
    .badge.doing { background: color-mix(in srgb, #38bdf8 15%, transparent); color: #38bdf8; border-color: color-mix(in srgb, #38bdf8 20%, transparent); }
    .badge.done { background: color-mix(in srgb, #10b981 15%, transparent); color: #10b981; border-color: color-mix(in srgb, #10b981 20%, transparent); }

    .empty-selection { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; color: var(--color-text-secondary); padding: 40px; }
    .placeholder-icon { font-size: 3rem; margin-bottom: 20px; opacity: 0.5; filter: drop-shadow(0 4px 12px rgba(0,0,0,0.2)); }
    .empty-selection p { font-size: 0.95rem; max-width: 200px; line-height: 1.5; font-weight: 500; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntityCardWidgetComponent {
  config = input.required<Widget['config']>();
  entity = input.required<EntityDefinition>();
  selectedRecordId = input<string | null>(null);

  private readonly dataService = inject(EntityDataService);

  protected readonly selectedRecord = computed(() => {
    const id = this.selectedRecordId();
    if (!id) return null;
    return this.dataService.getRecords(this.entity().id)().find((r: EntityRecord) => r.id === id);
  });

  protected readonly displayFields = computed(() => {
    // Busca campos selecionados no WidgetEditor, ou mostra os 3 primeiros por padrão
    const configured = this.config().customSettings?.['displayFields'];
    if (configured && Array.isArray(configured) && configured.length > 0) return configured;
    return this.entity().fields.slice(0, 3).map(f => f.key);
  });

  getFieldMeta(key: string): EntityField | undefined {
    return this.entity().fields.find((f: EntityField) => f.key === key);
  }

  getOptionLabel(field: EntityField, value: any): string {
    if (field.options) {
      const option = field.options.find(opt => opt.value === value);
      if (option) return option.label;
    }
    return String(value);
  }
}
