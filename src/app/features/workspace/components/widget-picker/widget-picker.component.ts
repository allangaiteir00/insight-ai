import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { WidgetType } from '../../../../core/models/workspace.model';
import { WIDGET_ICON_REGISTRY, WIDGET_METADATA, WidgetMeta } from '../../widget-metadata.constants';

interface CategoryGroup {
  category: WidgetMeta['category'];
  options: WidgetMeta[];
}

const CATEGORY_ORDER: WidgetMeta['category'][] = ['Tendência', 'Comparação', 'Distribuição', 'Avançado', 'Interação', 'Dados', 'Outros'];

@Component({
  selector: 'app-widget-picker',
  standalone: true,
  imports: [CommonModule, NgIcon],
  providers: [provideIcons(WIDGET_ICON_REGISTRY)],
  template: `
    <div class="modal-overlay" (click)="close.emit()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>Escolha o tipo de Widget</h3>
          <button class="btn-close" (click)="close.emit()">×</button>
        </div>

        <div class="picker-grid">
          @for (group of groupedOptions(); track group.category) {
            <div class="category-section">
              <h4>{{ group.category }}</h4>
              <div class="options-row">
                @for (option of group.options; track option.type) {
                  <div class="option-card" (click)="select.emit(option.type)">
                    <div class="option-icon">
                      <ng-icon [name]="option.iconName" size="28" />
                    </div>
                    <div class="option-info">
                      <span class="option-label">{{ option.label }}</span>
                      <span class="option-desc">{{ option.subtitle }}</span>
                    </div>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(var(--color-surface-rgb, 15, 23, 42), 0.6);
      backdrop-filter: blur(10px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.3s ease;
    }

    .modal-content {
      background: var(--color-surface);
      border-radius: var(--radius);
      width: 95%;
      max-width: 1000px;
      padding: 40px;
      box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.2);
      max-height: 85vh;
      overflow-y: auto;
      border: 1px solid var(--color-border);
    }

    .category-error {
      padding: 12px;
      border-radius: 8px;
      font-size: 0.8rem;
      color: #ef4444;
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.2);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 40px;
    }

    .modal-header h3 {
      font-size: 1.6rem;
      font-weight: 800;
      color: var(--color-text-primary);
      letter-spacing: -0.02em;
      margin: 0;
    }

    .btn-close {
      background: var(--color-surface-card);
      border: 1px solid var(--color-border);
      width: 36px;
      height: 36px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      color: var(--color-text-secondary);
    }

    .btn-close:hover { 
      transform: rotate(90deg); 
      color: #ef4444; 
      background: #fee2e2;
      border-color: #fecaca;
    }

    .category-section { margin-bottom: 24px; }

    .category-section h4 {
      color: var(--color-text-secondary);
      font-size: 0.8rem;
      text-transform: uppercase;
      font-weight: 700;
      letter-spacing: 0.1em;
      margin-bottom: 20px;
      padding-left: 4px;
    }

    .options-row {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
    }

    .option-card {
      background: var(--color-surface-card);
      border: 1px solid var(--color-border);
      border-radius: calc(var(--radius) * 0.75);
      padding: 24px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.02);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .option-card:hover {
      border-color: var(--color-primary);
      transform: translateY(-4px);
      box-shadow: 0 12px 25px rgba(0, 0, 0, 0.05);
    }

    .option-icon {
      background: var(--color-primary-50);
      width: 54px;
      height: 54px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: calc(var(--radius) * 0.65);
      color: var(--color-primary-600);
      flex-shrink: 0;
      transition: all 0.3s;
    }

    .option-card:hover .option-icon {
      background: var(--color-primary-600);
      color: white;
    }

    .option-info { display: flex; flex-direction: column; }

    .option-label {
      font-weight: 700;
      color: var(--color-text-primary);
      font-size: 1rem;
      margin-bottom: 4px;
      display: block;
    }

    .option-desc {
      font-size: 0.8rem;
      color: var(--color-text-secondary);
      line-height: 1.4;
      display: block;
    }

    @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WidgetPickerComponent {
  select = output<WidgetType>();
  close = output<void>();

  protected groupedOptions = computed<CategoryGroup[]>(() =>
    CATEGORY_ORDER.map(category => ({
      category,
      options: WIDGET_METADATA.filter(meta => meta.category === category)
    }))
  );
}
