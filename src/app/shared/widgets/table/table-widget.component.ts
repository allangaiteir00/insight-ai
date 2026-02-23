import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { Widget } from '../../../core/models/workspace.model';
import { EntityDefinition, EntityField } from '../../../core/page-engine/models/entity.model';
import { EntityDataService } from '../../../core/page-engine/services/entity-data.service';
import { PageInteractionService } from '../../../core/page-engine/services/page-interaction.service';

@Component({
  selector: 'app-table-widget',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="table-container">
      <div class="table-header-info">
        <span class="entity-badge">{{ entity().label }}</span>
        <span class="count-badge">{{ filteredItems().length }} registros</span>
      </div>

      <div class="table-scroll">
        <table class="dynamic-table">
          <thead>
            <tr>
              @for (field of displayFields(); track field.key) {
                <th (click)="toggleSort(field.key)" [class.sortable]="true">
                  <div class="th-content">
                    {{ field.label }}
                    @if (sortField() === field.key) {
                      <span class="sort-icon">{{ sortDir() === 'asc' ? '↑' : '↓' }}</span>
                    }
                  </div>
                </th>
              }
            </tr>
          </thead>
          <tbody>
            @for (item of paginatedItems(); track item.id) {
              <tr (click)="onSelect(item.id)">
                @for (field of displayFields(); track field.key) {
                  <td>
                    @if (field.type === 'select') {
                      <span class="badge" [class]="item.data[field.key]">
                        {{ getOptionLabel(field, item.data[field.key]) }}
                      </span>
                    } @else if (field.type === 'boolean') {
                      <span class="bool-indicator" [class.active]="item.data[field.key]"></span>
                    } @else {
                      {{ item.data[field.key] || '---' }}
                    }
                  </td>
                }
              </tr>
            } @empty {
              <tr>
                <td [attr.colspan]="displayFields().length" class="empty-row">
                  Nenhum dado encontrado.
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <div class="table-footer">
        <div class="pagination">
          <button [disabled]="currentPage() === 0" (click)="currentPage.set(currentPage() - 1)">Anterior</button>
          <span class="page-info">Página {{ currentPage() + 1 }} de {{ totalPages() || 1 }}</span>
          <button [disabled]="currentPage() >= totalPages() - 1" (click)="currentPage.set(currentPage() + 1)">Próxima</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; height: 100%; }
    .table-container { height: 100%; display: flex; flex-direction: column; background: var(--color-surface-card); border-radius: var(--radius); border: 1px solid var(--color-border); overflow: hidden; }
    
    .table-header-info { padding: 12px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--color-border); background: var(--color-surface); }
    .entity-badge { font-size: 0.75rem; font-weight: 800; color: var(--color-primary-600); text-transform: uppercase; letter-spacing: 0.05em; }
    .count-badge { font-size: 0.7rem; color: var(--color-text-muted); font-weight: 600; }

    .table-scroll { flex: 1; overflow: auto; }
    .dynamic-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
    
    th { text-align: left; padding: 12px 20px; background: var(--color-surface); font-weight: 700; color: var(--color-text-secondary); text-transform: uppercase; font-size: 0.7rem; letter-spacing: 0.05em; border-bottom: 2px solid var(--color-border); position: sticky; top: 0; z-index: 10; cursor: pointer; }
    th:hover { background: var(--color-surface-dark); }
    .th-content { display: flex; align-items: center; gap: 8px; }
    
    td { padding: 12px 20px; border-bottom: 1px solid var(--color-border); color: var(--color-text-primary); transition: background 0.2s; }
    tr:hover td { background: var(--color-surface); cursor: pointer; }
    
    .badge { font-size: 0.7rem; padding: 2px 8px; border-radius: 4px; font-weight: 700; background: var(--color-surface); border: 1px solid var(--color-border); }
    .bool-indicator { width: 10px; height: 10px; border-radius: 50%; background: #ef4444; display: inline-block; }
    .bool-indicator.active { background: #10b981; }

    .empty-row { text-align: center; padding: 40px; color: var(--color-text-muted); font-style: italic; }

    .table-footer { padding: 12px 20px; border-top: 1px solid var(--color-border); background: var(--color-surface); }
    .pagination { display: flex; align-items: center; justify-content: flex-end; gap: 16px; }
    .pagination button { background: var(--color-surface-card); border: 1px solid var(--color-border); padding: 4px 12px; border-radius: 6px; cursor: pointer; font-size: 0.75rem; font-weight: 600; color: var(--color-text-primary); }
    .pagination button:disabled { opacity: 0.5; cursor: not-allowed; }
    .page-info { font-size: 0.75rem; color: var(--color-text-secondary); }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableWidgetComponent {
  config = input.required<Widget['config']>();
  entity = input.required<EntityDefinition>();

  private readonly dataService = inject(EntityDataService);
  private readonly interactionBus = inject(PageInteractionService);

  protected currentPage = signal(0);
  protected pageSize = signal(10);
  protected sortField = signal<string | null>(null);
  protected sortDir = signal<'asc' | 'desc'>('asc');

  protected readonly displayFields = computed(() => {
    const configured = this.config().customSettings?.['displayFields'];
    if (configured && Array.isArray(configured) && configured.length > 0) {
      return this.entity().fields.filter(f => configured.includes(f.key));
    }
    return this.entity().fields.slice(0, 4);
  });

  protected readonly filteredItems = computed(() => {
    const items = [...this.dataService.getRecords(this.entity().id)()];
    const field = this.sortField();
    const dir = this.sortDir();

    if (field) {
      items.sort((a, b) => {
        const valA = a.data[field];
        const valB = b.data[field];
        if (valA < valB) return dir === 'asc' ? -1 : 1;
        if (valA > valB) return dir === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return items;
  });

  protected readonly totalPages = computed(() => Math.ceil(this.filteredItems().length / this.pageSize()));

  protected readonly paginatedItems = computed(() => {
    const start = this.currentPage() * this.pageSize();
    return this.filteredItems().slice(start, start + this.pageSize());
  });

  toggleSort(field: string) {
    if (this.sortField() === field) {
      this.sortDir.set(this.sortDir() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortField.set(field);
      this.sortDir.set('asc');
    }
  }

  getOptionLabel(field: EntityField, value: any): string {
    return field.options?.find(o => o.value === value)?.label || String(value);
  }

  onSelect(id: string) {
    this.interactionBus.emit({
      sourceId: this.config().title,
      type: 'recordSelected',
      entityId: this.entity().id,
      payload: id
    });
  }
}
