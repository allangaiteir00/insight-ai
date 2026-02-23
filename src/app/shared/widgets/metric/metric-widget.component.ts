import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Widget } from '../../../core/models/dashboard.model';
import { EntityDefinition } from '../../../core/page-engine/models/entity.model';
import { EntityDataService } from '../../../core/page-engine/services/entity-data.service';

@Component({
    selector: 'app-metric-widget',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="metric-container" [class.no-data]="!value()">
      <div class="metric-content">
        <span class="metric-label">{{ config().title }}</span>
        <div class="value-wrapper">
          <span class="metric-value">{{ displayValue() }}</span>
          @if (trend()) {
            <span class="metric-trend" [class.up]="trend() > 0" [class.down]="trend() < 0">
              {{ trend() > 0 ? '▲' : '▼' }} {{ Math.abs(trend()) }}%
            </span>
          }
        </div>
        @if (config().subtitle) {
          <span class="metric-subtitle">{{ config().subtitle }}</span>
        }
      </div>
      
      <div class="metric-visual">
         <div class="glow-orb"></div>
      </div>
    </div>
  `,
    styles: [`
    :host { display: block; height: 100%; }
    .metric-container {
      height: 100%;
      background: var(--color-surface-card);
      border-radius: var(--radius);
      border: 1px solid var(--color-border);
      padding: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      overflow: hidden;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .metric-container:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 24px rgba(0,0,0,0.1);
      border-color: var(--color-primary-400);
    }

    .metric-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
      z-index: 2;
    }

    .metric-label {
      font-size: 0.75rem;
      font-weight: 800;
      color: var(--color-text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .value-wrapper {
      display: flex;
      align-items: baseline;
      gap: 12px;
      margin: 8px 0;
    }

    .metric-value {
      font-size: 2.5rem;
      font-weight: 900;
      color: var(--color-text-primary);
      letter-spacing: -0.03em;
      line-height: 1;
    }

    .metric-trend {
      font-size: 0.85rem;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 6px;
    }
    .metric-trend.up { color: #10b981; background: color-mix(in srgb, #10b981 10%, transparent); }
    .metric-trend.down { color: #ef4444; background: color-mix(in srgb, #ef4444 10%, transparent); }

    .metric-subtitle {
      font-size: 0.8rem;
      color: var(--color-text-muted);
      font-weight: 500;
    }

    .metric-visual {
      position: absolute;
      right: -20px;
      top: -20px;
      width: 140px;
      height: 140px;
      z-index: 1;
    }

    .glow-orb {
      width: 100%;
      height: 100%;
      background: radial-gradient(circle, var(--color-primary-500) 0%, transparent 70%);
      opacity: 0.15;
      filter: blur(20px);
      border-radius: 50%;
    }

    .no-data .metric-value { color: var(--color-text-muted); font-size: 1.5rem; }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MetricWidgetComponent {
    config = input.required<Widget['config']>();
    entity = input<EntityDefinition | null>(null);
    data = input<any>(null);

    private readonly dataService = inject(EntityDataService);
    protected readonly Math = Math;

    protected readonly value = computed(() => {
        const mappings = this.config().mappings;
        const entityId = this.entity()?.id;

        if (entityId) {
            const records = this.dataService.getRecords(entityId)();
            if (records.length === 0) return null;
            // Se houver mapeamento de valor, usa ele. Se não, usa a data do primeiro registro.
            return mappings?.['value'] ? records[0].data[mappings['value']] : records[0].data;
        }

        // Se não for entidade, usa o dado externo passado (.data)
        const d = this.data();
        if (!d) return null;

        if (mappings?.['value'] && typeof d === 'object') {
            return d[mappings['value']];
        }

        return (typeof d === 'number' || typeof d === 'string') ? d : null;
    });

    protected readonly trend = computed(() => {
        // Stub para tendência. Em um caso real, compararia records[0] com records[1]
        return 12.5;
    });

    protected readonly displayValue = computed(() => {
        const val = this.value();

        // Se estiver em modo preview/sem valor, mostra um valor mock "bonito"
        if (val === null || val === undefined) {
            return '10.450';
        }

        if (typeof val === 'number') {
            return new Intl.NumberFormat('pt-BR', {
                maximumFractionDigits: 2,
                notation: Math.abs(val) > 999999 ? 'compact' : 'standard'
            }).format(val);
        }

        if (val && typeof val === 'object') {
            return '---';
        }

        return String(val);
    });
}
