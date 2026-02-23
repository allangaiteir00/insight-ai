import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCopy, lucidePencil, lucideTrash2 } from '@ng-icons/lucide';
import { firstValueFrom, Subscription } from 'rxjs';
import { Widget, WidgetState } from '../../../../core/models/dashboard.model';
import { InteractionEvent } from '../../../../core/page-engine/models/interaction.model';
import { EntityDataService } from '../../../../core/page-engine/services/entity-data.service';
import { EntityRegistryService } from '../../../../core/page-engine/services/entity-registry.service';
import { PageInteractionService } from '../../../../core/page-engine/services/page-interaction.service';
import { DashboardApiService } from '../../../../core/services/dashboard-api.service';
import { ThemeService } from '../../../../core/services/theme.service';
import { ChartDisplayComponent } from '../../../../shared/widgets/charts/chart-display.component';
import { WorkspaceStore } from '../../services/workspace-store.service';
import { WIDGET_ICON_REGISTRY, WIDGET_META_MAP } from '../../widget-metadata.constants';
import { EntityWidgetComponent } from '../smart/entity-widget/entity-widget.component';

@Component({
  selector: 'app-widget-display',
  standalone: true,
  imports: [CommonModule, ChartDisplayComponent, EntityWidgetComponent, NgIcon],
  providers: [provideIcons({ ...WIDGET_ICON_REGISTRY, lucidePencil, lucideCopy, lucideTrash2 })],
  template: `
    <div
      class="widget-card"
      [class.editor-mode]="isEditor()"
      [class.minimal-mode]="widget().config.hideCard && !isEditor()"
    >
      <div class="widget-header" *ngIf="!widget().config.hideCard || isEditor()">
        <div class="title-group">
          <div class="widget-icon">
            <ng-icon [name]="widgetMeta().iconName" size="20" [style.color]="'var(--color-primary-600)'" />
          </div>
          <div class="title-info">
            <span class="widget-title">{{ widget().config.title }}</span>
            @if (widgetSubtitle()) {
              <span class="widget-subtitle">{{ widgetSubtitle() }}</span>
            }
          </div>
        </div>

        <div class="header-actions">
          @if (computedState() === 'mock' && isChart()) {
            <span class="badge badge-mock">DEMO</span>
          }

          @if (isEditor()) {
            <div class="widget-actions">
              <button (click)="widgetAction.emit('edit')" title="Editar">
                <ng-icon name="lucidePencil" size="16" />
              </button>
              <button (click)="widgetAction.emit('clone')" title="Duplicar">
                <ng-icon name="lucideCopy" size="16" />
              </button>
              <button (click)="widgetAction.emit('remove')" class="btn-remove" title="Excluir">
                <ng-icon name="lucideTrash2" size="16" />
              </button>
            </div>
          }
        </div>
      </div>

      <div class="widget-content">
        @if (isChart()) {
            @switch (computedState()) {
              @case ('normal') {
                <div class="data-view">
                  <app-chart-display 
                    [data]="$any(widgetData())" 
                    [type]="widget().type" 
                    [theme]="themeService.currentTheme().background === '#ffffff' ? 'light' : 'dark'" 
                  />
                </div>
              }
              @case ('mock') {
                <div class="mock-view">
                  <app-chart-display
                    [type]="widget().type"
                    [data]="null"
                    [theme]="themeService.currentTheme().background === '#ffffff' ? 'light' : 'dark'"
                  />
                  <div class="mock-overlay">
                    <p>Dados de exemplo para <strong>{{ widget().config.title }}</strong></p>
                  </div>
                </div>
              }
              @case ('error') {
                <div class="error-view">
                  <span class="error-icon">🚧</span>
                  <p>Erro na conexão de dados</p>
                  <button class="btn-retry" (click)="fetchData()">Tentar Recarregar</button>
                </div>
              }
            }
        } @else {
            <app-entity-widget [widget]="widget()" [data]="widgetData()" />
        }

        @if (isLoading()) {
          <div class="widget-loading">
            <div class="spinner"></div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .widget-card {
      background: var(--glass-bg, var(--color-surface-card));
      backdrop-filter: blur(var(--glass-blur, 0px));
      -webkit-backdrop-filter: blur(var(--glass-blur, 0px));
      border-radius: var(--radius);
      box-shadow: var(--glass-shadow, 0 4px 15px rgba(0, 0, 0, 0.03));
      display: flex;
      flex-direction: column;
      overflow: hidden;
      position: absolute;
      inset: 0;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid var(--color-border);
    }

    .widget-card.minimal-mode {
      background: transparent !important;
      backdrop-filter: none !important;
      -webkit-backdrop-filter: none !important;
      border: none !important;
      box-shadow: none !important;
    }

    .widget-card.minimal-mode .widget-content {
      padding: 0;
    }

    .widget-card.editor-mode:hover {
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
      border-color: var(--color-primary-400);
      transform: translateY(-2px);
    }

    .widget-header {
      padding: 18px 24px 12px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: transparent;
      gap: 12px;
    }

    .title-group {
      display: flex;
      align-items: center;
      gap: 14px;
      min-width: 0;
    }

    .widget-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-primary-600);
      background: color-mix(in srgb, var(--color-primary) 10%, transparent);
      border-radius: 12px;
      width: 42px;
      height: 42px;
      flex-shrink: 0;
      transition: all 0.3s ease;
      line-height: 0;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
    }

    .widget-icon ng-icon {
      color: var(--color-primary-600);
      display: flex;
    }

    .widget-card.editor-mode:hover .widget-icon {
      background: var(--color-primary-100);
      color: var(--color-primary-700);
      transform: scale(1.05);
    }

    .title-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }

    .widget-title {
      font-weight: 800;
      color: var(--color-text-primary);
      font-size: 1rem;
      letter-spacing: -0.02em;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .widget-subtitle {
      font-size: 0.75rem;
      color: var(--color-text-secondary);
      font-weight: 500;
      opacity: 0.8;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;
    }

    .badge {
      font-size: 10px;
      padding: 4px 10px;
      border-radius: 999px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .badge-mock { background: var(--color-primary-100); color: var(--color-primary-700); }

    .widget-content {
      flex: 1;
      padding: 4px 24px 24px 24px;
      position: relative;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      min-height: 0;
    }

    .data-view {
      flex: 1;
      width: 100%;
      height: 100%;
      min-height: 0;
      position: relative;
    }

    .mock-view {
      position: relative;
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .mock-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(transparent, var(--color-surface-card));
      padding: 20px;
      text-align: center;
      font-size: 0.8rem;
      color: var(--color-text-secondary);
    }

    .error-view {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      flex: 1;
      text-align: center;
      color: #ef4444;
    }

    .btn-retry {
      margin-top: 12px;
      padding: 6px 16px;
      border-radius: 8px;
      background: var(--color-primary-50);
      border: 1px solid var(--color-primary-200);
      color: var(--color-primary-700);
      font-weight: 700;
      cursor: pointer;
      font-size: 0.8rem;
    }

    .widget-loading {
      position: absolute;
      inset: 0;
      background: rgba(var(--color-surface-rgb, 255, 255, 255), 0.7);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
    }

    .spinner {
      width: 24px;
      height: 24px;
      border: 3px solid var(--color-border);
      border-top-color: var(--color-primary-600);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin { to { transform: rotate(360deg); } }

    .widget-actions {
      display: flex;
      gap: 4px;
    }

    .widget-actions button {
      background: transparent;
      border: 1px solid transparent;
      color: var(--color-text-muted);
      cursor: pointer;
      padding: 6px;
      border-radius: 8px;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.95rem;
    }

    .widget-actions button:hover {
      background: var(--color-primary-50);
      color: var(--color-primary-600);
    }

    .btn-remove:hover { color: #ef4444 !important; background: #fee2e2 !important; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WidgetDisplayComponent {
  widget = input.required<Widget>();
  isEditor = input<boolean>(false);
  widgetAction = output<'edit' | 'clone' | 'remove'>();
  private readonly interactionService = inject(PageInteractionService);
  private filterSub?: Subscription;

  private readonly api = inject(DashboardApiService);
  private readonly entityRegistry = inject(EntityRegistryService);
  private readonly dataService = inject(EntityDataService);
  protected readonly store = inject(WorkspaceStore);
  protected readonly themeService = inject(ThemeService);

  /** Fonte de dados via API externa */
  private readonly apiSource = signal<any[] | null>(null);

  /** Fonte de dados via Entidade do Sistema */
  private readonly entitySource = computed(() => {
    const entityId = this.widget().config.customSettings?.['entityId'];
    if (!entityId) return null;
    return this.dataService.getRecords(entityId)();
  });

  /** Dado final unificado e estabilizado para os widgets */
  protected readonly widgetData = computed(() => {
    const entityData = this.entitySource();
    if (entityData) {
      return entityData.map(r => ({ id: r.id, ...r.data }));
    }
    return this.apiSource();
  }, {
    equal: (a, b) => JSON.stringify(a) === JSON.stringify(b)
  });

  protected activeFilters = signal<Record<string, any>>({});
  protected isLoading = signal<boolean>(false);
  protected hasError = signal<boolean>(false);

  /** Metadados do tipo do widget: ícone específico, label e subtitle padrão */
  protected widgetMeta = computed(() =>
    WIDGET_META_MAP.get(this.widget().type) ?? WIDGET_META_MAP.get('chart-line')!
  );

  /** Usa subtitle salvo na config se existir, caso contrário usa o padrão do tipo */
  protected widgetSubtitle = computed(() =>
    this.widget().config.subtitle ?? this.widgetMeta().subtitle
  );

  protected isChart = computed(() => this.widget().type.startsWith('chart'));

  protected computedState = computed<WidgetState>(() => {
    if (this.hasError()) return 'error';
    if (!this.widget().config.dataUrl) return 'mock';
    return 'normal';
  });

  constructor() {
    // Re-busca dados quando as configurações mudam
    // Re-busca dados quando as configurações mudam (apenas se não for entidade reativa)
    effect(() => {
      const config = this.widget().config;
      const entityId = config.customSettings?.['entityId'];

      if (!entityId && config.dataUrl) {
        import('@angular/core').then(m => m.untracked(() => this.fetchData()));
      }
    });

    // Escuta filtros globais
    this.interactionService.on('filterApplied').pipe(
      takeUntilDestroyed()
    ).subscribe((event: InteractionEvent) => {
      const entityId = this.widget().config.customSettings?.['entityId'];
      if (!event.entityId || event.entityId === entityId) {
        this.activeFilters.set(event.payload || {});
      }
    });

    // Escuta seleção de registros para hierarquia (Pai -> Filho)
    this.interactionService.onRecordSelected().pipe(
      takeUntilDestroyed()
    ).subscribe((event: InteractionEvent) => {
      const myEntityId = this.widget().config.customSettings?.['entityId'];
      if (!myEntityId || !event.entityId) return;

      const myEntity = this.entityRegistry.getEntity(myEntityId);
      // Verifica se existe uma relação onde este widget é o "Filho" da entidade selecionada
      const relation = myEntity?.relations?.find(r => r.toEntityId === event.entityId);

      if (relation) {
        this.activeFilters.update(filters => ({
          ...filters,
          [relation.foreignKey]: event.payload // Payload é o ID do registro pai
        }));
      }
    });
  }

  ngOnDestroy() {
    this.filterSub?.unsubscribe();
  }

  async fetchData(): Promise<void> {
    const customSettings = this.widget().config.customSettings;
    const entityId = customSettings?.['entityId'];

    // Prioritiza URL da entidade se existir
    let dataUrl = this.widget().config.dataUrl;
    if (entityId) {
      const entity = this.entityRegistry.getEntity(entityId);
      if (entity?.url) {
        dataUrl = entity.url;
      }
    }

    if (!dataUrl) return;

    this.isLoading.set(true);
    this.hasError.set(false);

    try {
      const currentFilters = this.activeFilters();
      let data = await firstValueFrom(this.api.getWidgetData(dataUrl, currentFilters));

      // Aplica mapeamento se for um gráfico e houver definições
      const mappings = this.widget().config.mappings;
      if (this.isChart() && mappings && Array.isArray(data)) {
        data = data.map((item: any) => ({
          label: item[mappings['label']] || item.id,
          value: Number(item[mappings['value']] || 0)
        }));
      }

      this.apiSource.set(data);
    } catch {
      this.hasError.set(true);
    } finally {
      this.isLoading.set(false);
    }
  }
}
