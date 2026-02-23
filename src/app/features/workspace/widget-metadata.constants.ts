import {
    lucideAlignLeft,
    lucideAreaChart,
    lucideBarChart2,
    lucideBarChartHorizontal,
    lucideBox,
    lucideCalendar,
    lucideCreditCard,
    lucideFileText,
    lucideFilter,
    lucideGanttChart,
    lucideGrid3x3,
    lucideKanban,
    lucideLayers,
    lucideList,
    lucideMap,
    lucideMousePointer2,
    lucidePieChart,
    lucideTable,
    lucideTrendingUp,
    lucideUserSquare2
} from '@ng-icons/lucide';
import { WidgetType } from '../../core/models/dashboard.model';

export interface WidgetMeta {
    type: WidgetType;
    label: string;
    subtitle: string;
    iconName: string;
    iconRef: string;
    category: 'Tendência' | 'Comparação' | 'Distribuição' | 'Avançado' | 'Interação' | 'Dados' | 'Outros';
}

export const WIDGET_METADATA: WidgetMeta[] = [
    { type: 'chart-line', label: 'Linha', subtitle: 'Séries temporais e tendências fluidas.', iconName: 'lucideTrendingUp', iconRef: lucideTrendingUp as unknown as string, category: 'Tendência' },
    { type: 'chart-area', label: 'Área', subtitle: 'Volume acumulado no longo do tempo.', iconName: 'lucideAreaChart', iconRef: lucideAreaChart as unknown as string, category: 'Tendência' },
    { type: 'chart-bar', label: 'Barras Verticais', subtitle: 'Comparação quantitativa categórica.', iconName: 'lucideBarChart2', iconRef: lucideBarChart2 as unknown as string, category: 'Comparação' },
    { type: 'chart-bar-horizontal', label: 'Barras Horizontais', subtitle: 'Classificações e rótulos muito longos.', iconName: 'lucideBarChartHorizontal', iconRef: lucideBarChartHorizontal as unknown as string, category: 'Comparação' },
    { type: 'chart-pie', label: 'Pizza / Donut', subtitle: 'Exibe fatias proporcionais de um total.', iconName: 'lucidePieChart', iconRef: lucidePieChart as unknown as string, category: 'Distribuição' },
    { type: 'chart-heatmap', label: 'Heatmap', subtitle: 'Densidade térmica em duas dimensões.', iconName: 'lucideGrid3x3', iconRef: lucideGrid3x3 as unknown as string, category: 'Avançado' },
    { type: 'chart-boxplot', label: 'Boxplot', subtitle: 'Distribuição estatística e anomalias.', iconName: 'lucideBox', iconRef: lucideBox as unknown as string, category: 'Avançado' },
    { type: 'chart-mixed', label: 'Gráfico Misto', subtitle: 'Combine Barras e Linhas em conjunto.', iconName: 'lucideLayers', iconRef: lucideLayers as unknown as string, category: 'Avançado' },
    { type: 'metric', label: 'Indicador (KPI)', subtitle: 'Número chave, resumo em destaque.', iconName: 'lucideCreditCard', iconRef: lucideCreditCard as unknown as string, category: 'Outros' },
    { type: 'table', label: 'Tabela Dados', subtitle: 'Apresentação em grade pura.', iconName: 'lucideTable', iconRef: lucideTable as unknown as string, category: 'Outros' },
    { type: 'text', label: 'Bloco de Texto', subtitle: 'Anotações flexíveis, ricas.', iconName: 'lucideAlignLeft', iconRef: lucideAlignLeft as unknown as string, category: 'Outros' },
    { type: 'form', label: 'Formulário', subtitle: 'Captura e edição de dados.', iconName: 'lucideFileText', iconRef: lucideFileText as unknown as string, category: 'Dados' },
    { type: 'kanban', label: 'Kanban', subtitle: 'Gestão visual de fluxo e estados.', iconName: 'lucideKanban', iconRef: lucideKanban as unknown as string, category: 'Dados' },
    { type: 'list', label: 'Listagem Recurso', subtitle: 'Lista interativa compacta.', iconName: 'lucideList', iconRef: lucideList as unknown as string, category: 'Dados' },
    { type: 'action-button', label: 'Botão de Ação', subtitle: 'Trigger para processos manuais.', iconName: 'lucideMousePointer2', iconRef: lucideMousePointer2 as unknown as string, category: 'Interação' },
    { type: 'entity-card', label: 'Card Entidade', subtitle: 'Visão 360 de um único registro.', iconName: 'lucideUserSquare2', iconRef: lucideUserSquare2 as unknown as string, category: 'Interação' },
    { type: 'filter', label: 'Filtro Global', subtitle: 'Sincronize o dashboard refletivo.', iconName: 'lucideFilter', iconRef: lucideFilter as unknown as string, category: 'Interação' },
    { type: 'gantt', label: 'Gráfico Gantt', subtitle: 'Cronograma e fluxo temporal.', iconName: 'lucideGanttChart', iconRef: lucideGanttChart as unknown as string, category: 'Avançado' },
    { type: 'map', label: 'Mapa Geográfico', subtitle: 'Plotagem de pontos espaciais.', iconName: 'lucideMap', iconRef: lucideMap as unknown as string, category: 'Avançado' },
    { type: 'calendar', label: 'Agenda / Calendário', subtitle: 'Gestão de eventos e prazos.', iconName: 'lucideCalendar', iconRef: lucideCalendar as unknown as string, category: 'Avançado' },
];

/** Lookup rápido de metadados por WidgetType */
export const WIDGET_META_MAP = new Map<WidgetType, WidgetMeta>(
    WIDGET_METADATA.map(meta => [meta.type, meta])
);

/** Ícones registráveis via provideIcons() — os ícones @ng-icons/lucide são strings SVG em runtime */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const WIDGET_ICON_REGISTRY: Record<string, string> = Object.fromEntries(
    WIDGET_METADATA.map(meta => [meta.iconName, meta.iconRef])
) as any;

