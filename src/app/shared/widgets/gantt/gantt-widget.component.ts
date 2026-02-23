// Enterprise Gantt Widget
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { WidgetConfig } from '../../../core/models/workspace.model';
import { EntityDefinition } from '../../../core/page-engine/models/entity.model';
import { GanttColumn, GanttMarker, GanttViewScale, InsightGanttItem } from './engine/gantt-models';
import { InsightGanttComponent } from './engine/insight-gantt.component';

@Component({
  selector: 'app-gantt-widget',
  standalone: true,
  imports: [CommonModule, InsightGanttComponent],
  template: `
    <div class="gantt-widget-wrapper">
      <div class="gantt-controls">
        <div class="view-selector">
          <button (click)="currentScale.set('day')" [class.active]="currentScale() === 'day'">Dia</button>
          <button (click)="currentScale.set('week')" [class.active]="currentScale() === 'week'">Semana</button>
          <button (click)="currentScale.set('month')" [class.active]="currentScale() === 'month'">Mês</button>
        </div>
      </div>

      <div class="gantt-main-container">
        @if (items().length > 0) {
          <insight-gantt
            [items]="items()"
            [viewScale]="currentScale()"
            [columns]="ganttColumns"
            [markers]="ganttMarkers"
          />
        } @else {
          <div class="no-data">
            <p>Nenhum dado mapeado para o Gantt.</p>
            <small>Configure os campos de data no editor.</small>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    :host { 
      display: block; 
      height: 100%; 
      width: 100%;
      --gantt-bg-color: var(--color-surface, #1e1e1e);
      --gantt-container-background-color: var(--color-surface, #1e1e1e);
      --gantt-table-background-color: var(--color-surface, #1e1e1e);
      --gantt-header-background: var(--color-surface-light, #2d2d2d);
      --gantt-primary-color: var(--color-primary-500, #3b82f6);
      --gantt-border-color: var(--color-border, rgba(255, 255, 255, 0.08));
    }

    .gantt-widget-wrapper {
      height: 100%;
      display: flex;
      flex-direction: column;
      background: var(--gantt-bg-color);
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid var(--gantt-border-color);
    }

    .gantt-controls {
      padding: 10px 16px;
      background: rgba(0, 0, 0, 0.3);
      border-bottom: 1px solid var(--gantt-border-color);
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }

    .view-selector {
      display: flex;
      background: rgba(0, 0, 0, 0.2);
      padding: 4px;
      border-radius: 8px;
      gap: 4px;
      border: 1px solid rgba(255, 255, 255, 0.05);
    }

    .view-selector button {
      background: transparent;
      border: none;
      color: var(--color-text-muted, #94a3b8);
      padding: 5px 14px;
      font-size: 11px;
      font-weight: 600;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .view-selector button.active {
      background: var(--gantt-primary-color);
      color: white;
    }

    .gantt-main-container {
      flex: 1;
      height: 100%;
      position: relative;
    }

    .task-title-cell {
      display: flex;
      align-items: center;
      gap: 10px;
      color: var(--color-text-base, #f1f5f9) !important;
    }

    .date-cell {
      font-size: 11px;
      color: var(--color-text-muted, #94a3b8) !important;
      font-family: 'JetBrains Mono', monospace;
    }

    .no-data {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: var(--color-text-muted);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GanttWidgetComponent {
  config = input.required<WidgetConfig>();
  entity = input<EntityDefinition>();
  data = input<any[] | null>();

  protected currentScale = signal<GanttViewScale>('month');

  protected ganttColumns: GanttColumn[] = [
    { name: 'Atividade', field: 'title', width: 250 },
    { name: 'Progresso', field: 'progress', width: 100, type: 'progress' },
    { name: 'Início', field: 'start', width: 100, type: 'date' },
    { name: 'Fim', field: 'end', width: 100, type: 'date' }
  ];

  protected ganttMarkers: GanttMarker[] = [
    { id: 'today', date: new Date(), label: 'Hoje', color: '#f59e0b' },
    { id: 'start', date: new Date(2025, 0, 1), label: 'Início do Projeto', color: '#10b981' }
  ];

  protected items = computed((): InsightGanttItem[] => {
    const rawData = this.data() || [];
    if (rawData.length === 0) return [];

    const mappings = this.config().mappings || {};
    const startKey = mappings['startDate'] || 'start_date';
    const endKey = mappings['endDate'] || 'end_date';
    const titleKey = mappings['title'] || 'name';

    // Criação de tarefas individuais
    const tasks: InsightGanttItem[] = rawData.map((record, index) => {
      const startDate = this.parseDate(record[startKey]);
      const endDate = record[endKey] ? this.parseDate(record[endKey]) : startDate;
      const finalEndDate = endDate.getTime() < startDate.getTime() ? startDate : endDate;
      const title = record[titleKey] || record.name || `Atividade ${index + 1}`;

      return {
        id: `row-${index}`,
        title,
        start: startDate,
        end: finalEndDate,
        progress: Math.floor(Math.random() * 100), // Dado mock para demonstração
        color: 'var(--color-primary-500)',
        parentId: 'project-root',
        dependencies: index > 0 ? [`row-${index - 1}`] : [], // Dependência em cascata mock
        origin: record
      };
    });

    // Nó Pai (Projeto) para demonstrar WBS
    const projectRoot: InsightGanttItem = {
      id: 'project-root',
      title: 'Lançamento Insight AI',
      start: new Date(Math.min(...tasks.map(t => t.start.getTime()))),
      end: new Date(Math.max(...tasks.map(t => t.end.getTime()))),
      progress: 45,
      type: 'project',
      expanded: true,
      children: tasks,
      color: 'var(--color-secondary-500)'
    };

    return [projectRoot];
  });

  private parseDate(val: any): Date {
    if (!val) return new Date();
    const date = new Date(val);
    return isNaN(date.getTime()) ? new Date() : date;
  }
}
