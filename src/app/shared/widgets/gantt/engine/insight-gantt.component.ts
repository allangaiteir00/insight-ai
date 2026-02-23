// Enterprise refined Gantt engine
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { GanttColumn, GanttCoordinate, GanttMarker, GanttViewScale, InsightGanttItem } from './gantt-models';

@Component({
    selector: 'insight-gantt',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="insight-gantt-container" [style.--gantt-row-height.px]="rowHeight">
      <!-- Top Level Header (Sticky) -->
      <div class="gantt-master-header">
        <div class="side-header-container" [style.width.px]="totalSideWidth()">
          @for (col of columns(); track col.name) {
            <div class="side-col-header" [style.width.px]="col.width || 100">
              {{ col.name }}
            </div>
          }
        </div>
        <div class="timeline-header-viewport">
          <svg [attr.width]="totalWidth()" height="64" class="gantt-header-svg">
            <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="var(--color-primary-400)" />
                </marker>
            </defs>
            <!-- Upper Header (Month/Year) -->
            @for (tier of upperHeaderTicks(); track tier.label) {
              <rect [attr.x]="tier.x" y="0" [attr.width]="tier.width" height="32" class="header-tier-bg" />
              <text [attr.x]="tier.x + tier.width/2" y="20" class="header-tier-text upper">{{ tier.label }}</text>
              <line [attr.x1]="tier.x" y1="0" [attr.x2]="tier.x" y2="32" class="header-divider" />
            }
            <!-- Lower Header (Days/Weeks) -->
            @for (tick of timelineTicks(); track tick.date.getTime()) {
              <text [attr.x]="tick.x" y="52" class="header-tick-text">{{ tick.label }}</text>
              <line [attr.x1]="tick.x" y1="32" [attr.x2]="tick.x" y2="64" class="header-divider" />
            }
            <line x1="0" y1="32" [attr.x2]="totalWidth()" y2="32" class="header-tier-divider" />
          </svg>
        </div>
      </div>

      <div class="gantt-body">
        <!-- Tabela Lateral (Multi-Coluna Hierárquica) -->
        <div class="gantt-side-panel" [style.width.px]="totalSideWidth()">
          <div class="side-rows">
            @for (item of flattenedItems(); track item.id) {
              <div class="side-row" [class.is-project]="item.type === 'project'">
                @for (col of columns(); track col.name; let first = $first) {
                  <div class="side-cell" [style.width.px]="col.width || 100">
                    @if (first) {
                        <div class="cell-content" [style.padding-left.px]="getLevel(item) * 20">
                            @if (item.children && item.children.length > 0) {
                                <button class="expand-btn" (click)="toggleExpand(item)">
                                    {{ item.expanded ? '▼' : '▶' }}
                                </button>
                            } @else {
                                <span class="indent-spacer"></span>
                            }
                            <span class="title-text">{{ resolveValue(item, col.field) }}</span>
                        </div>
                    } @else if (col.type === 'date') {
                      {{ resolveValue(item, col.field) | date:'dd/MM/yy' }}
                    } @else if (col.type === 'progress') {
                        <div class="mini-progress-bg">
                            <div class="mini-progress-fill" [style.width.%]="item.progress || 0"></div>
                        </div>
                    } @else {
                      {{ resolveValue(item, col.field) }}
                    }
                  </div>
                }
              </div>
            }
          </div>
        </div>

        <!-- Área do Gráfico (SVG) -->
        <div class="gantt-main-viewport">
          <svg [attr.width]="totalWidth()" [attr.height]="flattenedItems().length * rowHeight" class="gantt-svg">
            <!-- Linhas de Fundo -->
            @for (tick of timelineTicks(); track tick.date.getTime()) {
              <line 
                [attr.x1]="tick.x" 
                y1="0" 
                [attr.x2]="tick.x" 
                [attr.y2]="flattenedItems().length * rowHeight" 
                class="bg-grid-line" 
              />
            }

            <!-- Setas de Dependência -->
            @for (path of dependencyPaths(); track $index) {
                <path [attr.d]="path" class="dependency-line" />
            }

            <!-- Marcadores (Today, Start) -->
            @for (marker of markers(); track marker.id) {
                <g class="gantt-marker" [attr.transform]="'translate(' + getXFromDate(marker.date) + ', 0)'">
                    <line x1="0" y1="0" x2="0" [attr.y2]="flattenedItems().length * rowHeight" class="marker-line" [style.stroke]="marker.color" />
                    <rect x="-40" y="5" width="80" height="18" rx="4" class="marker-label-bg" [style.fill]="marker.color" />
                    <text x="0" y="18" class="marker-text">{{ marker.label }}</text>
                </g>
            }

            <!-- Barras de Tarefas -->
            @for (coord of itemCoordinates(); track coord.id; let i = $index) {
              <g class="gantt-bar-group" 
                 [class.is-project]="coord.item.type === 'project'"
                 [attr.transform]="'translate(' + coord.x + ',' + (i * rowHeight + (rowHeight - barHeight)/2) + ')'">
                <rect 
                  [attr.width]="coord.width" 
                  [attr.height]="barHeight" 
                  rx="6" 
                  class="gantt-bar-rect"
                  [style.fill]="coord.item.color || 'var(--color-primary-500)'"
                />
                <!-- Barra de Progresso Interna -->
                @if (coord.item.progress) {
                    <rect 
                        [attr.width]="coord.width * (coord.item.progress / 100)" 
                        [attr.height]="barHeight" 
                        rx="6" 
                        class="gantt-bar-progress"
                    />
                }
                <text 
                  [attr.x]="coord.width + 10" 
                  [attr.y]="barHeight/2 + 4" 
                  class="bar-label"
                >
                  {{ coord.item.title }}
                </text>
              </g>
            }
          </svg>
        </div>
      </div>
    </div>
  `,
    styles: [`
    :host {
      display: block;
      height: 100%;
      --gantt-bg: var(--color-surface, #1e1e1e);
      --gantt-header-bg: var(--color-surface-light, #2d2d2d);
      --gantt-border: var(--color-border, rgba(255, 255, 255, 0.08));
      --gantt-text: var(--color-text-primary, #f8fafc);
      --gantt-text-muted: var(--color-text-secondary, #94a3b8);
      --border-color: var(--gantt-border);
    }

    .insight-gantt-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: var(--gantt-bg);
      color: var(--gantt-text);
      font-family: var(--font-family, 'Inter', sans-serif);
      user-select: none;
    }

    .gantt-master-header {
      display: flex;
      background: var(--gantt-header-bg);
      border-bottom: 2px solid var(--border-color);
      height: 64px;
      flex-shrink: 0;
    }

    .side-header-container {
      display: flex;
      flex-shrink: 0;
      border-right: 2px solid var(--border-color);
      background: rgba(255, 255, 255, 0.02);
    }

    .side-col-header {
      height: 100%;
      display: flex;
      align-items: center;
      padding: 0 16px;
      color: var(--gantt-text);
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-right: 1px solid var(--border-color);
      &:last-child { border-right: none; }
    }

    .timeline-header-viewport {
      flex: 1;
      overflow: hidden;
    }

    .header-tier-bg {
        fill: rgba(255,255,255,0.03);
    }

    .header-tier-text {
        fill: var(--gantt-text);
        text-anchor: middle;
        font-size: 11px;
        font-weight: 800;
        text-transform: uppercase;
        pointer-events: none;
    }

    .header-tier-divider {
        stroke: var(--border-color);
        stroke-width: 1;
    }

    .header-tick-text {
      fill: var(--gantt-text-muted);
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      text-anchor: middle;
      opacity: 0.8;
    }

    .header-divider {
      stroke: var(--gantt-border);
      stroke-width: 1.5;
    }

    .gantt-body {
      display: flex;
      flex: 1;
      overflow: hidden;
    }

    .gantt-side-panel {
      border-right: 2px solid var(--border-color);
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      background: rgba(0,0,0,0.15);
      overflow-y: hidden;
    }

    .side-row {
      height: var(--gantt-row-height);
      display: flex;
      border-bottom: 1px solid var(--border-color);
      transition: background 0.2s;
      &:hover { background: rgba(255, 255, 255, 0.04); }
      &.is-project { 
        background: rgba(var(--color-primary-rgb, 59, 130, 246), 0.05); 
        .title-text { font-weight: 800; color: var(--color-primary-400); }
      }
    }

    .side-cell {
      height: 100%;
      display: flex;
      align-items: center;
      padding: 0 16px;
      font-size: 12px;
      color: var(--gantt-text);
      font-weight: 500;
      border-right: 1px solid var(--border-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      &:last-child { border-right: none; }
    }

    .cell-content {
        display: flex;
        align-items: center;
        gap: 8px;
        width: 100%;
    }

    .expand-btn {
        background: transparent;
        border: none;
        color: var(--gantt-text-muted);
        cursor: pointer;
        font-size: 10px;
        padding: 4px;
        width: 20px;
        transition: color 0.2s;
        &:hover { color: var(--gantt-text); }
    }

    .indent-spacer { width: 20px; }

    .mini-progress-bg {
        width: 100%;
        height: 6px;
        background: rgba(255,255,255,0.05);
        border-radius: 3px;
        overflow: hidden;
    }

    .mini-progress-fill {
        height: 100%;
        background: var(--color-primary-500);
        transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .gantt-main-viewport {
      flex: 1;
      overflow: auto;
      background-image: 
        radial-gradient(circle at 1px 1px, rgba(255,255,255,0.02) 1px, transparent 0);
      background-size: 32px 32px;
      &::-webkit-scrollbar { width: 8px; height: 8px; }
      &::-webkit-scrollbar-thumb { background: var(--color-primary-500); border-radius: 4px; }
      &::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); }
    }

    .bg-grid-line {
      stroke: var(--border-color);
      stroke-width: 1;
    }

    .gantt-bar-rect {
      filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3));
      stroke: rgba(255,255,255,0.15);
      stroke-width: 1.5;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .gantt-bar-progress {
        fill: rgba(255,255,255,0.2);
        pointer-events: none;
    }

    .gantt-bar-group.is-project .gantt-bar-rect {
        height: 6px;
        y: 10px;
        rx: 3;
    }

    .bar-label {
      fill: var(--gantt-text);
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.02em;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
    }

    .gantt-marker {
        pointer-events: none;
    }

    .marker-line {
        stroke-width: 2;
        stroke-dasharray: 4 4;
    }

    .marker-label-bg {
        filter: drop-shadow(0 2px 6px rgba(0,0,0,0.4));
    }

    .marker-text {
        fill: #fff;
        font-size: 9px;
        font-weight: 900;
        text-anchor: middle;
        text-transform: uppercase;
    }

    .dependency-line {
        fill: none;
        stroke: var(--color-primary-400);
        stroke-width: 1.5;
        stroke-linejoin: round;
        marker-end: url(#arrowhead);
        opacity: 0.6;
    }

    .gantt-bar-group:hover .gantt-bar-rect {
      filter: brightness(1.1) scaleY(1.05);
      cursor: pointer;
    }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InsightGanttComponent {
    items = input.required<InsightGanttItem[]>();
    viewScale = input<GanttViewScale>('month');
    columns = input<GanttColumn[]>([
        { name: 'Atividade', field: 'title', width: 220 }
    ]);
    markers = input<GanttMarker[]>([]);

    rowHeight = 44; // Reduzi levemente para maior densidade
    barHeight = 22;

    totalSideWidth = computed(() => {
        return this.columns().reduce((acc, col) => acc + (col.width || 100), 0);
    });

    /** Itens achatados respeitando o estado de expansão para renderização */
    flattenedItems = computed(() => {
        const result: InsightGanttItem[] = [];
        const process = (items: InsightGanttItem[]) => {
            items.forEach(item => {
                result.push(item);
                if (item.expanded && item.children) {
                    process(item.children);
                }
            });
        };
        process(this.items());
        return result;
    });

    toggleExpand(item: InsightGanttItem) {
        item.expanded = !item.expanded;
        // Trigger manual pois estamos editando objeto, mas o ideal seria imutável. 
        // Para este MVP o item.expanded resolve.
    }

    getLevel(item: InsightGanttItem): number {
        let level = 0;
        let currentId = item.parentId;
        while (currentId) {
            level++;
            const parent = this.findItemById(this.items(), currentId);
            currentId = parent?.parentId;
        }
        return level;
    }

    private findItemById(items: InsightGanttItem[], id: string): InsightGanttItem | null {
        for (const item of items) {
            if (item.id === id) return item;
            if (item.children) {
                const found = this.findItemById(item.children, id);
                if (found) return found;
            }
        }
        return null;
    }

    /** Cálculo da largura de um dia em pixels com base na escala */
    dayWidth = computed(() => {
        switch (this.viewScale()) {
            case 'day': return 100;
            case 'week': return 40;
            case 'month': return 15;
            default: return 15;
        }
    });

    /** Determina o intervalo total do Gantt */
    dateRange = computed(() => {
        const data = this.items();
        if (data.length === 0) {
            const start = new Date();
            const end = new Date();
            end.setMonth(end.getMonth() + 3);
            return { start, end };
        }

        const start = new Date(Math.min(...data.map(i => i.start.getTime())));
        const end = new Date(Math.max(...data.map(i => i.end.getTime())));

        // Padding de 15 dias nas pontas
        start.setDate(start.getDate() - 15);
        end.setDate(end.getDate() + 30);

        return { start, end };
    });

    totalWidth = computed(() => {
        const diff = this.dateRange().end.getTime() - this.dateRange().start.getTime();
        const days = diff / (1000 * 60 * 60 * 24);
        return days * this.dayWidth();
    });

    /** Gera os pontos da timeline para o SVG (Tier de baixo) */
    timelineTicks = computed(() => {
        const ticks = [];
        const current = new Date(this.dateRange().start);
        const end = this.dateRange().end;

        while (current <= end) {
            let label = '';
            let show = false;

            if (this.viewScale() === 'month') {
                label = current.getDate().toString();
                show = true;
            } else if (this.viewScale() === 'week' && current.getDay() === 1) {
                label = `${current.getDate()} ${current.toLocaleDateString('pt-BR', { month: 'short' })}`;
                show = true;
            } else if (this.viewScale() === 'day') {
                label = current.toLocaleDateString('pt-BR', { weekday: 'narrow' });
                show = true;
            }

            if (show) {
                ticks.push({
                    date: new Date(current),
                    label,
                    x: this.getXFromDate(current)
                });
            }
            current.setDate(current.getDate() + 1);
        }
        return ticks;
    });

    /** Cabeçalho Superior (Mês/Ano) */
    upperHeaderTicks = computed(() => {
        const ticks: any[] = [];
        const current = new Date(this.dateRange().start);
        const end = this.dateRange().end;

        // Reset para o início do mês para alinhar o primeiro tick
        current.setDate(1);

        while (current <= end) {
            const monthStart = new Date(current);
            const label = current.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

            // Pular para o próximo mês
            current.setMonth(current.getMonth() + 1);
            const monthEnd = new Date(current);

            const x = this.getXFromDate(monthStart);
            const width = this.getXFromDate(monthEnd) - x;

            ticks.push({ label, x, width });
        }
        return ticks;
    });

    resolveValue(item: InsightGanttItem, field: string): any {
        if (field === 'title') return item.title;
        if (field === 'start') return item.start;
        if (field === 'end') return item.end;
        return item.origin?.[field] || '';
    }

    /** Calcula as coordenadas de cada barra */
    itemCoordinates = computed((): GanttCoordinate[] => {
        return this.flattenedItems().map(item => {
            const x = this.getXFromDate(item.start);
            const width = this.getXFromDate(item.end) - x;

            return {
                id: item.id,
                x,
                y: 0,
                width: Math.max(width, 5),
                item
            };
        });
    });

    /** Calcula os paths SVG para as setas de dependência */
    dependencyPaths = computed(() => {
        const paths: string[] = [];
        const items = this.flattenedItems();
        const coords = this.itemCoordinates();

        items.forEach((item, toIndex) => {
            if (item.dependencies && item.dependencies.length > 0) {
                item.dependencies.forEach(fromId => {
                    const fromIndex = items.findIndex(i => i.id === fromId);
                    if (fromIndex !== -1) {
                        const fromCoord = coords[fromIndex];
                        const toCoord = coords[toIndex];

                        // Pontos de ancoragem
                        const startX = fromCoord.x + fromCoord.width;
                        const startY = fromIndex * this.rowHeight + this.rowHeight / 2;
                        const endX = toCoord.x;
                        const endY = toIndex * this.rowHeight + this.rowHeight / 2;

                        // Path estilo "cotovelo" (elbow)
                        const midX = startX + (endX - startX) / 2;

                        paths.push(`M ${startX} ${startY} L ${midX} ${startY} L ${midX} ${endY} L ${endX} ${endY}`);
                    }
                });
            }
        });
        return paths;
    });

    protected getXFromDate(date: Date): number {
        const diff = date.getTime() - this.dateRange().start.getTime();
        const days = diff / (1000 * 60 * 60 * 24);
        return days * this.dayWidth();
    }

    private getWeekNumber(d: Date): number {
        d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    }
}
