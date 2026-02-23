import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Widget } from '../../../core/models/workspace.model';
import { EntityDefinition } from '../../../core/page-engine/models/entity.model';
import { PageInteractionService } from '../../../core/page-engine/services/page-interaction.service';

@Component({
  selector: 'app-filter-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="filter-container">
      <div class="filter-header">
         <span class="filter-label">{{ config().title }}</span>
      </div>
      
      <div class="filter-controls">
         <select [(ngModel)]="selectedValue" (change)="onFilterChange()" class="filter-select">
            <option [value]="null">Todos (Sem Filtro)</option>
            @for (option of options(); track option.value) {
                <option [value]="option.value">{{ option.label }}</option>
            }
         </select>
      </div>
    </div>
  `,
  styles: [`
    .filter-container {
      padding: 16px;
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: 12px;
      justify-content: center;
    }
    .filter-label {
      font-size: 0.75rem;
      font-weight: 800;
      color: var(--color-text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .filter-select {
      width: 100%;
      padding: 10px 14px;
      border: 2px solid var(--color-border);
      border-radius: var(--radius);
      background: var(--color-surface-card);
      color: var(--color-text-primary);
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .filter-select:focus {
      outline: none;
      border-color: var(--color-primary);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterWidgetComponent {
  config = input.required<Widget['config']>();
  entity = input<EntityDefinition | null>(null);

  private readonly interactionService = inject(PageInteractionService);

  protected selectedValue: any = null;

  protected options = computed(() => {
    // Para simplificar, usamos as opções do primeiro campo 'select' da entidade se disponível
    const entity = this.entity();
    if (!entity) return [];

    const filterField = entity.fields.find(f => f.type === 'select');
    return filterField?.options || [];
  });

  onFilterChange() {
    const fieldKey = this.entity()?.fields.find(f => f.type === 'select')?.key || 'filter';
    const payload = this.selectedValue ? { [fieldKey]: this.selectedValue } : {};

    this.interactionService.applyFilter(
      'filter-widget',
      payload,
      this.entity()?.id
    );
  }
}
