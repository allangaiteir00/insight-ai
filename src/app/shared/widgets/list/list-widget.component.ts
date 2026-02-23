import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Widget } from '../../../core/models/workspace.model';
import { EntityDefinition, EntityRecord } from '../../../core/page-engine/models/entity.model';
import { EntityDataService } from '../../../core/page-engine/services/entity-data.service';
import { PageInteractionService } from '../../../core/page-engine/services/page-interaction.service';

@Component({
  selector: 'app-list-widget',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="list-wrapper">
      <div class="list-header">
        <span class="entity-name">{{ entity().label }}</span>
        <span class="record-qty">{{ items().length }} registros</span>
      </div>
      
      <div class="list-scroll">
        @for (item of items(); track item.id) {
          <div class="list-item" (click)="onSelect(item.id)">
            <div class="avatar">{{ item.data['name']?.charAt(0) || item.data['title']?.charAt(0) || '?' }}</div>
            <div class="info">
              <div class="line1">{{ item.data['name'] || item.data['title'] || 'Sem título' }}</div>
              <div class="line2">{{ getSummary(item) }}</div>
            </div>
            <div class="status-indicator" [attr.data-status]="item.data['status'] || item.data['tier']"></div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; height: 100%; }
    .list-wrapper { display: flex; flex-direction: column; height: 100%; background: var(--color-surface-card); border-radius: var(--radius); border: 1px solid var(--color-border); overflow: hidden; }
    .list-header { padding: 16px 20px; background: var(--color-surface); border-bottom: 1px solid var(--color-border); display: flex; justify-content: space-between; align-items: center; }
    .entity-name { font-size: 0.85rem; font-weight: 800; color: var(--color-text-primary); text-transform: uppercase; letter-spacing: 0.05em; }
    .record-qty { font-size: 0.7rem; color: var(--color-text-muted); font-weight: 600; }

    .list-scroll { flex: 1; overflow-y: auto; }
    .list-item { display: flex; align-items: center; gap: 14px; padding: 14px 20px; border-bottom: 1px solid var(--color-border); cursor: pointer; transition: all 0.2s; position: relative; }
    .list-item:hover { background: var(--color-surface); padding-left: 24px; }
    
    .avatar { width: 36px; height: 36px; border-radius: calc(var(--radius) * 0.5); background: var(--color-primary-100); color: var(--color-primary-600); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.9rem; }
    .info { flex: 1; min-width: 0; }
    .line1 { font-size: 0.9rem; font-weight: 700; color: var(--color-text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .line2 { font-size: 0.75rem; color: var(--color-text-secondary); }

    .status-indicator { width: 8px; height: 8px; border-radius: 50%; background: var(--color-border); }
    .status-indicator[data-status="done"] { background: #10b981; box-shadow: 0 0 8px rgba(16, 185, 129, 0.4); }
    .status-indicator[data-status="todo"] { background: #f59e0b; box-shadow: 0 0 8px rgba(245, 158, 11, 0.4); }
    .status-indicator[data-status="enterprise"] { background: var(--color-primary); box-shadow: 0 0 8px color-mix(in srgb, var(--color-primary) 40%, transparent); }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListWidgetComponent {
  config = input.required<Widget['config']>();
  entity = input.required<EntityDefinition>();

  private readonly dataService = inject(EntityDataService);
  private readonly interactionBus = inject(PageInteractionService);

  protected readonly items = computed(() => this.dataService.getRecords(this.entity().id)());

  getSummary(item: EntityRecord): string {
    return Object.values(item.data).filter(v => typeof v === 'string' && v.length < 30).slice(0, 2).join(' • ');
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
