import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, inject, input, OnChanges, signal, SimpleChanges } from '@angular/core';
import { EChartsOption } from 'echarts';
import { NgxEchartsModule } from 'ngx-echarts';

interface MockChartData {
    categories: string[];
    values: number[];
}

const MOCK_CATEGORIES = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'];

@Component({
    selector: 'app-chart-display',
    standalone: true,
    imports: [CommonModule, NgxEchartsModule],
    template: `
    <div echarts [options]="chartOptions()" [autoResize]="true" class="chart-container"></div>
  `,
    styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      position: relative;
    }
    .chart-container {
      width: 100% !important;
      height: 100% !important;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartDisplayComponent implements OnChanges {
    data = input<unknown>(null);
    type = input<string>('bar');
    theme = input<'light' | 'dark'>('light');

    private readonly el = inject(ElementRef);
    protected chartOptions = signal<EChartsOption>({});

    /** Lê as CSS custom properties da paleta ativa e tokens de design diretamente do DOM */
    private readTokens() {
        const style = getComputedStyle(this.el.nativeElement);
        const palette = [
            style.getPropertyValue('--color-primary-500').trim() || style.getPropertyValue('--color-primary').trim() || '#6366f1',
            style.getPropertyValue('--color-primary-400').trim() || '#818cf8',
            style.getPropertyValue('--color-primary-600').trim() || '#4f46e5',
            style.getPropertyValue('--color-primary-300').trim() || '#a5b4fc',
            style.getPropertyValue('--color-primary-700').trim() || '#4338ca'
        ];
        const textPrimary = style.getPropertyValue('--color-text-primary').trim() || '#0f172a';
        const textSecondary = style.getPropertyValue('--color-text-secondary').trim() || '#64748b';
        const surfaceCard = style.getPropertyValue('--color-surface-card').trim() || '#ffffff';

        return { palette, textPrimary, textSecondary, surfaceCard };
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['data'] || changes['type'] || changes['theme']) {
            this.updateChartOptions();
        }
    }

    private updateChartOptions(): void {
        const resolvedData = (this.data() as MockChartData) ?? this.generateMockData();
        const chartType = this.type();
        const tokens = this.readTokens();

        const optionBuilders: Record<string, () => EChartsOption> = {
            'metric': () => this.buildMetricOptions(resolvedData, tokens),
            'chart-pie': () => this.buildPieOptions(resolvedData, tokens),
            'chart-heatmap': () => this.buildHeatmapOptions(tokens),
            'chart-boxplot': () => this.buildBoxplotOptions(resolvedData, tokens),
            'chart-mixed': () => this.buildMixedOptions(resolvedData, tokens),
        };

        const builder = optionBuilders[chartType];
        this.chartOptions.set(builder ? builder() : this.buildDefaultOptions(resolvedData, chartType, tokens));
    }

    private buildBaseOptions(tokens: any): EChartsOption {
        return {
            tooltip: {
                trigger: 'axis',
                backgroundColor: tokens.surfaceCard || 'rgba(255, 255, 255, 0.95)',
                borderRadius: 12,
                shadowBlur: 20,
                shadowColor: 'rgba(0,0,0,0.1)',
                borderWidth: 0,
                textStyle: { color: tokens.textPrimary || '#1e293b' }
            },
            grid: { top: 10, left: '3%', right: '4%', bottom: '3%', containLabel: true },
            textStyle: { fontFamily: 'Inter, sans-serif' }
        };
    }

    private generateMockData(): MockChartData {
        return {
            categories: MOCK_CATEGORIES,
            values: MOCK_CATEGORIES.map(() => Math.floor(Math.random() * 1000) + 200)
        };
    }

    private buildMetricOptions(chartData: MockChartData, tokens: any): EChartsOption {
        const colors = tokens.palette;
        const currentValue = chartData.values[chartData.values.length - 1];
        const previousValue = chartData.values[chartData.values.length - 2] ?? currentValue;
        const diff = currentValue - previousValue;
        const percentChange = ((diff / previousValue) * 100).toFixed(1);
        const isPositive = diff >= 0;
        const trendColor = isPositive ? '#10b981' : '#ef4444';
        const trendSign = isPositive ? '+' : '';

        return {
            ...this.buildBaseOptions(tokens),
            grid: { top: 10, left: 0, right: 0, bottom: 0, containLabel: false },
            tooltip: { show: false },
            xAxis: { type: 'category', data: chartData.categories, show: false },
            yAxis: { type: 'value', show: false, min: 'dataMin' },
            title: {
                text: `{value|${currentValue.toLocaleString()}}\n{trend|${trendSign}${percentChange}%}`,
                left: '10%',
                top: 'center',
                textStyle: {
                    rich: {
                        value: { fontSize: 36, fontWeight: 800, color: tokens.textPrimary || '#0f172a', lineHeight: 40 },
                        trend: { fontSize: 13, fontWeight: 700, color: trendColor, padding: [4, 8, 4, 8], backgroundColor: isPositive ? '#d1fae5' : '#fee2e2', borderRadius: 12 }
                    }
                }
            },
            series: [{
                data: chartData.values,
                type: 'line',
                smooth: true,
                showSymbol: false,
                lineStyle: { width: 3, color: colors[0] },
                areaStyle: {
                    color: {
                        type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [{ offset: 0, color: colors[0] + '33' }, { offset: 1, color: colors[0] + '00' }]
                    }
                }
            }]
        };
    }

    private buildPieOptions(chartData: MockChartData, tokens: any): EChartsOption {
        const colors = tokens.palette;
        return {
            ...this.buildBaseOptions(tokens),
            tooltip: { trigger: 'item' },
            series: [{
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: { borderRadius: 10, borderColor: tokens.surfaceCard || '#fff', borderWidth: 2 },
                label: { show: false },
                emphasis: { label: { show: true, fontSize: 14, fontWeight: 'bold' } },
                data: chartData.categories.map((cat: string, index: number) => ({
                    name: cat,
                    value: chartData.values[index],
                    itemStyle: { color: colors[index % colors.length] }
                }))
            }]
        };
    }

    private buildHeatmapOptions(tokens: any): EChartsOption {
        const colors = tokens.palette;
        const hours = ['12a', '1a', '2a', '3a', '4a', '5a', '6a', '7a', '8a', '9a', '10a', '11a', '12p', '1p', '2p', '3p', '4p', '5p', '6p', '7p', '8p', '9p', '10p', '11p'];
        const days = ['Sab', 'Sex', 'Qui', 'Qua', 'Ter', 'Seg', 'Dom'];
        const heatmapData: [number, number, number][] = [];

        for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
            for (let hourIndex = 0; hourIndex < 24; hourIndex++) {
                heatmapData.push([hourIndex, dayIndex, Math.floor(Math.random() * 10)]);
            }
        }

        return {
            ...this.buildBaseOptions(tokens),
            tooltip: { position: 'top' },
            grid: { height: '50%', top: '10%' },
            xAxis: { type: 'category', data: hours, splitArea: { show: true } },
            yAxis: { type: 'category', data: days, splitArea: { show: true } },
            visualMap: { min: 0, max: 10, calculable: true, orient: 'horizontal', left: 'center', bottom: '15%', inRange: { color: [colors[3] + '44', colors[0], colors[2]] } },
            series: [{ name: 'Intensidade', type: 'heatmap', data: heatmapData, label: { show: false }, emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0, 0, 0, 0.5)' } } }]
        };
    }

    private buildBoxplotOptions(chartData: MockChartData, tokens: any): EChartsOption {
        const colors = tokens.palette;
        return {
            ...this.buildBaseOptions(tokens),
            xAxis: { type: 'category', data: chartData.categories, boundaryGap: true, splitArea: { show: false }, splitLine: { show: false } },
            yAxis: { type: 'value', splitArea: { show: true } },
            series: [{
                name: 'Dados',
                type: 'boxplot',
                data: chartData.categories.map(() => [
                    Math.floor(Math.random() * 200) + 100,
                    Math.floor(Math.random() * 300) + 400,
                    Math.floor(Math.random() * 200) + 700,
                    Math.floor(Math.random() * 300) + 900,
                    Math.floor(Math.random() * 200) + 1200
                ]),
                itemStyle: { color: colors[3], borderColor: colors[0] }
            }]
        };
    }

    private buildMixedOptions(chartData: MockChartData, tokens: any): EChartsOption {
        const colors = tokens.palette;
        return {
            ...this.buildBaseOptions(tokens),
            xAxis: { type: 'category', data: chartData.categories },
            yAxis: [
                { type: 'value', name: 'Volume' },
                { type: 'value', name: 'Tendência', max: 100 }
            ],
            series: [
                {
                    name: 'Volume',
                    type: 'bar',
                    data: chartData.values.map((value: number) => value * 0.8),
                    itemStyle: { color: colors[0], borderRadius: [4, 4, 0, 0] }
                },
                {
                    name: 'Tendência',
                    type: 'line',
                    yAxisIndex: 1,
                    data: chartData.values.map(() => Math.floor(Math.random() * 100)),
                    lineStyle: { width: 3, color: colors[1] },
                    itemStyle: { color: colors[1] },
                    smooth: true
                }
            ]
        };
    }

    private buildDefaultOptions(chartData: MockChartData, chartType: string, tokens: any): EChartsOption {
        const colors = tokens.palette;
        const isHorizontal = chartType === 'chart-bar-horizontal';
        const isLineOrArea = chartType === 'chart-line' || chartType === 'chart-area';
        const isBar = chartType.includes('bar');

        return {
            ...this.buildBaseOptions(tokens),
            xAxis: isHorizontal
                ? { type: 'value' }
                : { type: 'category', data: chartData.categories },
            yAxis: isHorizontal
                ? { type: 'category', data: chartData.categories }
                : { type: 'value' },
            series: [{
                data: chartData.values,
                type: isLineOrArea ? 'line' : 'bar',
                areaStyle: chartType === 'chart-area' ? { opacity: 0.3, color: colors[0] } : undefined,
                smooth: true,
                itemStyle: {
                    color: colors[0],
                    borderRadius: isBar ? (isHorizontal ? [0, 4, 4, 0] : [4, 4, 0, 0]) : 0
                },
                lineStyle: { width: 3, color: colors[0] }
            }]
        };
    }
}
