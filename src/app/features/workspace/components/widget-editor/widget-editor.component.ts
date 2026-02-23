import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Widget, WidgetType } from '../../../../core/models/workspace.model';
import { EntityRegistryService } from '../../../../core/page-engine/services/entity-registry.service';
import { ThemeService } from '../../../../core/services/theme.service';
import { ChartDisplayComponent } from '../../../../shared/widgets/charts/chart-display.component';
import { WorkspaceStore } from '../../services/workspace-store.service';
import { WIDGET_META_MAP } from '../../widget-metadata.constants';
import { EntityWidgetComponent } from '../smart/entity-widget/entity-widget.component';

interface WidgetFormValue {
  title: string | null;
  subtitle: string | null;
  type: WidgetType | null;
  dataUrl: string | null;
  entityId: string | null;
  statusFieldKey?: string | null;
  titleFieldKey?: string | null;
  subtitleFieldKey?: string | null;
  displayFields?: string[] | null;
  mappings?: Record<string, string> | null;
  hideCard?: boolean | null;
}

@Component({
  selector: 'app-widget-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ChartDisplayComponent, EntityWidgetComponent],
  template: `
    <div class="modal-overlay" (click)="close()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>{{ widget() ? 'Editar Widget' : 'Novo Widget' }}</h3>
          <button class="btn-close" (click)="close()">×</button>
        </div>

        <div class="editor-layout">
          <form [formGroup]="form" (ngSubmit)="save()" class="editor-form">
            <div class="form-group">
              <label>Título</label>
              <input type="text" formControlName="title" placeholder="Ex: Faturamento Mensal">
            </div>

            <div class="form-group">
              <label>Subtítulo</label>
              <input type="text" formControlName="subtitle" placeholder="Ex: Comparativo mensal">
              <small>Descrição breve exibida abaixo do título no widget.</small>
            </div>

            @if (!widget()) {
              <div class="form-group">
                <label>Tipo de Widget</label>
                <select formControlName="type">
                  <optgroup label="Gráficos de Tendência">
                    <option value="chart-line">Linha (Smooth)</option>
                    <option value="chart-area">Área</option>
                  </optgroup>
                  <optgroup label="Comparação">
                    <option value="chart-bar">Barra Vertical</option>
                    <option value="chart-bar-horizontal">Barra Horizontal</option>
                  </optgroup>
                  <optgroup label="Distribuição">
                    <option value="chart-pie">Pizza (Donut)</option>
                  </optgroup>
                  <optgroup label="Avançado">
                    <option value="chart-heatmap">Heatmap</option>
                    <option value="chart-boxplot">Boxplot</option>
                    <option value="chart-mixed">Misto (Linha + Barra)</option>
                  </optgroup>
                  <optgroup label="Outros">
                    <option value="metric">KPI Card</option>
                    <option value="table">Tabela</option>
                    <option value="text">Texto</option>
                    <option value="filter">Filtro Global</option>
                    <option value="gantt">Gráfico Gantt</option>
                    <option value="map">Mapa Geográfico</option>
                    <option value="calendar">Agenda / Calendário</option>
                  </optgroup>
                </select>
              </div>
            }

            @if (isEntityWidget()) {
              <div class="form-group">
                <label>Entidade Alvo</label>
                <select formControlName="entityId">
                  <option value="">Selecione uma entidade...</option>
                  @for (entity of entityRegistry.entities(); track entity.id) {
                    <option [value]="entity.id">{{ entity.label }}</option>
                  }
                </select>
                <small>Define qual fonte de dados este widget irá exibir/gerenciar.</small>
              </div>

              @if ((form.get('type')?.value === 'entity-card' || form.get('type')?.value === 'table' || form.get('type')?.value === 'metric') && form.get('entityId')?.value) {
                <div class="card-config-group">
                  <label>Campos para Exibição</label>
                  <div class="checkbox-grid">
                    @for (field of selectedEntityFields(); track field.key) {
                      <label class="checkbox-item">
                        <input 
                          type="checkbox" 
                          [checked]="isFieldSelected(field.key)"
                          (change)="toggleField(field.key)"
                        >
                        {{ field.label }}
                      </label>
                    }
                  </div>
                </div>
              }

              @if (form.get('type')?.value === 'kanban' && form.get('entityId')?.value) {
                <div class="kanban-config-group">
                  <div class="form-group">
                    <label>Campo de Status (Colunas)</label>
                    <select formControlName="statusFieldKey">
                      <option value="">Selecione o campo de status...</option>
                      @for (field of selectedEntityFields(); track field.key) {
                        @if (field.type === 'select') {
                          <option [value]="field.key">{{ field.label }}</option>
                        }
                      }
                    </select>
                  </div>

                  <div class="form-group">
                    <label>Campo do Título do Card</label>
                    <select formControlName="titleFieldKey">
                      <option value="">Selecione o campo de título...</option>
                      @for (field of selectedEntityFields(); track field.key) {
                        <option [value]="field.key">{{ field.label }}</option>
                      }
                    </select>
                  </div>

                  <div class="form-group">
                    <label>Campo de Subtítulo (Opcional)</label>
                    <select formControlName="subtitleFieldKey">
                      <option value="">Nenhum</option>
                      @for (field of selectedEntityFields(); track field.key) {
                        <option [value]="field.key">{{ field.label }}</option>
                      }
                    </select>
                  </div>
                </div>
              }
            }

            @if (!hasEntityWithUrl()) {
              <div class="form-group">
                <label>Data URL (Opcional)</label>
                <input type="text" formControlName="dataUrl" placeholder="https://api.exemplo.com/dados">
                <small>Deixe vazio para usar dados MOCK.</small>
              </div>
            }

            <div class="form-group">
              <label class="checkbox-item" style="text-transform: none; font-size: 0.9rem; margin-top: 8px;">
                <input type="checkbox" formControlName="hideCard">
                <span>Modo Minimalista (Esconder card externo)</span>
              </label>
              <small>Quando ativado, o título e a borda do widget desaparecem fora do editor.</small>
            </div>

            @if ((form.get('type')?.value?.startsWith('chart') || ['metric', 'gantt', 'map', 'calendar'].includes(form.get('type')?.value || '')) && form.get('entityId')?.value) {
               <div class="mappings-group">
                  <label>Mapeamento de Dados</label>
                  <div class="mapping-fields">
                    @if (form.get('type')?.value?.startsWith('chart')) {
                      <div class="form-group">
                        <label class="sub-label">Rótulo (Eixo X / Categoria)</label>
                        <select (change)="updateMapping('label', $any($event.target).value)">
                          <option value="">Selecione um campo...</option>
                          @for (field of selectedEntityFields(); track field.key) {
                            <option [value]="field.key" [selected]="form.value.mappings?.['label'] === field.key">
                              {{ field.label }}
                            </option>
                          }
                        </select>
                      </div>
                    }

                    @if (form.get('type')?.value?.startsWith('chart') || form.get('type')?.value === 'metric') {
                      <div class="form-group">
                        <label class="sub-label">Valor ({{ form.get('type')?.value === 'metric' ? 'Número KPI' : 'Eixo Y / Série' }})</label>
                        <select (change)="updateMapping('value', $any($event.target).value)">
                          <option value="">Selecione um campo...</option>
                          @for (field of selectedEntityFields(); track field.key) {
                            @if (field.type === 'number') {
                              <option [value]="field.key" [selected]="form.value.mappings?.['value'] === field.key">
                                {{ field.label }}
                              </option>
                            }
                          }
                        </select>
                      </div>
                    }

                    @if (form.get('type')?.value === 'gantt') {
                      <div class="form-group">
                        <label class="sub-label">Data de Início</label>
                        <select (change)="updateMapping('startDate', $any($event.target).value)">
                          <option value="">Selecione um campo...</option>
                          @for (field of selectedEntityFields(); track field.key) {
                            @if (field.type === 'date') {
                              <option [value]="field.key" [selected]="form.value.mappings?.['startDate'] === field.key">
                                {{ field.label }}
                              </option>
                            }
                          }
                        </select>
                      </div>
                      <div class="form-group">
                        <label class="sub-label">Data de Término</label>
                        <select (change)="updateMapping('endDate', $any($event.target).value)">
                          <option value="">Selecione um campo...</option>
                          @for (field of selectedEntityFields(); track field.key) {
                            @if (field.type === 'date') {
                              <option [value]="field.key" [selected]="form.value.mappings?.['endDate'] === field.key">
                                {{ field.label }}
                              </option>
                            }
                          }
                        </select>
                      </div>
                      <div class="form-group">
                        <label class="sub-label">Título do Item</label>
                        <select (change)="updateMapping('title', $any($event.target).value)">
                          <option value="">Selecione um campo...</option>
                          @for (field of selectedEntityFields(); track field.key) {
                            <option [value]="field.key" [selected]="form.value.mappings?.['title'] === field.key">
                              {{ field.label }}
                            </option>
                          }
                        </select>
                      </div>
                    }

                    @if (form.get('type')?.value === 'map') {
                      <div class="form-group">
                        <label class="sub-label">Latitude</label>
                        <select (change)="updateMapping('lat', $any($event.target).value)">
                          <option value="">Selecione um campo...</option>
                          @for (field of selectedEntityFields(); track field.key) {
                            <option [value]="field.key" [selected]="form.value.mappings?.['lat'] === field.key">
                              {{ field.label }}
                            </option>
                          }
                        </select>
                      </div>
                      <div class="form-group">
                        <label class="sub-label">Longitude</label>
                        <select (change)="updateMapping('lng', $any($event.target).value)">
                          <option value="">Selecione um campo...</option>
                          @for (field of selectedEntityFields(); track field.key) {
                            <option [value]="field.key" [selected]="form.value.mappings?.['lng'] === field.key">
                              {{ field.label }}
                            </option>
                          }
                        </select>
                      </div>
                      <div class="form-group">
                        <label class="sub-label">Rótulo do Marcador</label>
                        <select (change)="updateMapping('label', $any($event.target).value)">
                          <option value="">Selecione um campo...</option>
                          @for (field of selectedEntityFields(); track field.key) {
                            <option [value]="field.key" [selected]="form.value.mappings?.['label'] === field.key">
                              {{ field.label }}
                            </option>
                          }
                        </select>
                      </div>
                    }

                    @if (form.get('type')?.value === 'calendar') {
                      <div class="form-group">
                        <label class="sub-label">Data de Início</label>
                        <select (change)="updateMapping('eventDate', $any($event.target).value)">
                          <option value="">Selecione um campo...</option>
                          @for (field of selectedEntityFields(); track field.key) {
                            @if (field.type === 'date') {
                              <option [value]="field.key" [selected]="form.value.mappings?.['eventDate'] === field.key">
                                {{ field.label }}
                              </option>
                            }
                          }
                        </select>
                      </div>
                      <div class="form-group">
                        <label class="sub-label">Data de Término (Opcional)</label>
                        <select (change)="updateMapping('eventEndDate', $any($event.target).value)">
                          <option value="">Nenhum</option>
                          @for (field of selectedEntityFields(); track field.key) {
                            @if (field.type === 'date') {
                              <option [value]="field.key" [selected]="form.value.mappings?.['eventEndDate'] === field.key">
                                {{ field.label }}
                              </option>
                            }
                          }
                        </select>
                      </div>
                      <div class="form-group">
                        <label class="sub-label">Título do Evento</label>
                        <select (change)="updateMapping('eventTitle', $any($event.target).value)">
                          <option value="">Selecione um campo...</option>
                          @for (field of selectedEntityFields(); track field.key) {
                            <option [value]="field.key" [selected]="form.value.mappings?.['eventTitle'] === field.key">
                              {{ field.label }}
                            </option>
                          }
                        </select>
                      </div>
                    }
                  </div>
               </div>
            }

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="close()">Cancelar</button>
              <button type="submit" class="btn btn-primary" [disabled]="form.invalid">Salvar</button>
            </div>
          </form>

          <div class="editor-preview">
            <div class="preview-header">
              <span>PRÉVIA EM TEMPO REAL</span>
            </div>
            <div class="preview-container">
              @if (form.get('type')?.value?.startsWith('chart')) {
                  <app-chart-display
                    [type]="form.value.type || 'chart-line'"
                    [data]="null"
                    [theme]="themeService.currentTheme().background === '#ffffff' ? 'light' : 'dark'"
                  />
              } @else {
                  <app-entity-widget
                     [widget]="previewWidget"
                  />
              }
            </div>
          </div>
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
      background: var(--color-surface-card);
      border-radius: var(--radius);
      width: 95%;
      max-width: 900px;
      padding: 32px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      border: 1px solid var(--color-border);
    }

    .editor-layout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 32px;
    }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .modal-header h3 {
      margin: 0;
      color: var(--color-text-primary);
      font-size: 1.5rem;
      font-weight: 800;
      letter-spacing: -0.02em;
    }

    .btn-close {
      background: var(--color-surface-card);
      border: 1px solid var(--color-border);
      width: 36px;
      height: 36px;
      border-radius: 50%;
      font-size: 20px;
      cursor: pointer;
      color: var(--color-text-secondary);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .btn-close:hover { background: #fee2e2; color: #dc2626; transform: rotate(90deg); }

    .form-group {
      margin-bottom: 24px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    label { font-weight: 700; font-size: 0.8rem; color: var(--color-text-secondary); text-transform: uppercase; letter-spacing: 0.05em; }

    input, select {
      padding: 14px 18px;
      border: 2px solid var(--color-border);
      border-radius: calc(var(--radius) * 0.6);
      font-size: 1rem;
      transition: all 0.2s;
      background: var(--color-surface-card);
      color: var(--color-text-primary);
    }

    input:focus, select:focus {
      outline: none;
      border-color: var(--color-primary);
      background: var(--color-surface-card);
      box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.05);
    }

    small { color: var(--color-text-muted); font-size: 0.75rem; margin-top: 4px; }

    .editor-preview {
      background: var(--color-surface);
      border-radius: calc(var(--radius) * 0.85);
      padding: 24px;
      border: 1px dashed var(--color-border);
      display: flex;
      flex-direction: column;
    }

    .preview-header {
      font-size: 0.7rem;
      font-weight: 800;
      color: var(--color-text-muted);
      letter-spacing: 0.1em;
      margin-bottom: 16px;
      text-align: center;
    }

    .preview-container {
      flex: 1;
      background: var(--color-surface-card);
      border-radius: calc(var(--radius) * 0.5);
      overflow: hidden;
      min-height: 250px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 32px;
    }

    .btn {
      padding: 14px 28px;
      border-radius: calc(var(--radius) * 0.6);
      font-weight: 700;
      cursor: pointer;
      border: none;
      transition: all 0.2s;
    }

    .btn-primary {
      background: var(--color-primary-600);
      color: white;
      box-shadow: 0 4px 12px color-mix(in srgb, var(--color-primary-600) 30%, transparent);
    }
    .btn-primary:hover { background: var(--color-primary-700); transform: translateY(-2px); box-shadow: 0 6px 16px color-mix(in srgb, var(--color-primary-600) 30%, transparent); }
    .btn-primary:disabled { background: var(--color-border); color: var(--color-text-muted); cursor: not-allowed; box-shadow: none; transform: none; }

    .checkbox-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-top: 8px; padding: 12px; background: var(--color-surface); border-radius: calc(var(--radius) * 0.8); }
    .checkbox-item { display: flex; align-items: center; gap: 8px; font-size: 0.8rem; text-transform: none; font-weight: 500; cursor: pointer; color: var(--color-text-primary); }
    .checkbox-item input { width: 18px; height: 18px; cursor: pointer; }

    .btn-secondary:hover { background: var(--color-surface); }

    .mappings-group {
      background: var(--color-surface);
      padding: 16px;
      border-radius: var(--radius);
      margin-bottom: 24px;
      border: 1px solid var(--color-border);
    }
    .mapping-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .sub-label { font-size: 0.7rem; color: var(--color-text-muted); margin-bottom: 4px; }

    @media (max-width: 768px) {
      .editor-layout { grid-template-columns: 1fr; }
      .editor-preview { display: none; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WidgetEditorComponent {
  widget = input<Widget | null>(null);
  initialType = input<WidgetType | null>(null);
  onClose = output<void>();

  private readonly fb = inject(FormBuilder);
  protected readonly store = inject(WorkspaceStore);
  protected readonly themeService = inject(ThemeService);
  protected readonly entityRegistry = inject(EntityRegistryService);

  protected isEntityWidget = computed(() => {
    const type = this.form.get('type')?.value;
    if (!type) return false;
    return ['form', 'kanban', 'list', 'action-button', 'entity-card', 'table', 'metric', 'filter', 'gantt', 'map', 'calendar'].includes(type) || type.startsWith('chart-');
  });

  protected selectedEntityFields = computed(() => {
    const entityId = this.form.get('entityId')?.value;
    if (!entityId) return [];
    return this.entityRegistry.getEntity(entityId)?.fields || [];
  });

  protected hasEntityWithUrl = computed(() => {
    const entityId = this.form.get('entityId')?.value;
    if (!entityId) return false;
    return !!this.entityRegistry.getEntity(entityId)?.url;
  });

  protected get previewWidget(): Widget {
    const formType = this.form.value.type || 'list';
    return {
      id: 'preview',
      type: formType as WidgetType,
      config: {
        title: this.form.value.title || '',
        subtitle: this.form.value.subtitle || '',
        hideCard: this.form.value.hideCard ?? false,
        customSettings: {
          entityId: this.form.value.entityId,
          displayFields: this.form.value.displayFields
        }
      },
      position: { x: 0, y: 0, w: 12, h: 4 }
    };
  }

  protected form = this.fb.group({
    title: ['', Validators.required],
    subtitle: [''],
    type: ['chart-line' as WidgetType, Validators.required],
    dataUrl: [''],
    entityId: [''],
    statusFieldKey: [''],
    titleFieldKey: [''],
    subtitleFieldKey: [''],
    displayFields: [[] as string[]],
    mappings: [{} as Record<string, string>],
    hideCard: [false]
  });

  constructor() {
    effect(() => {
      const existingWidget = this.widget();
      const selectedType = this.initialType();

      if (existingWidget) {
        this.form.patchValue({
          title: existingWidget.config.title,
          subtitle: existingWidget.config.subtitle ?? '',
          type: existingWidget.type,
          dataUrl: existingWidget.config.dataUrl,
          entityId: existingWidget.config.customSettings?.['entityId'] || '',
          statusFieldKey: existingWidget.config.customSettings?.['statusFieldKey'] || '',
          titleFieldKey: existingWidget.config.customSettings?.['titleFieldKey'] || '',
          subtitleFieldKey: existingWidget.config.customSettings?.['subtitleFieldKey'] || '',
          displayFields: existingWidget.config.customSettings?.['displayFields'] || [],
          mappings: (existingWidget.mappings || {}) as any,
          hideCard: existingWidget.config.hideCard || false
        });
      } else if (selectedType) {
        const meta = WIDGET_META_MAP.get(selectedType);
        this.form.patchValue({
          type: selectedType,
          title: meta?.label ?? '',
          subtitle: meta?.subtitle ?? ''
        });
      }
    });
  }

  protected save(): void {
    const formValue = this.form.value as any;
    const existingWidget = this.widget();

    if (existingWidget) {
      this.store.updateWidgetConfig(existingWidget.id, {
        title: formValue.title ?? existingWidget.config.title,
        subtitle: formValue.subtitle ?? existingWidget.config.subtitle,
        dataUrl: formValue.dataUrl ?? existingWidget.config.dataUrl,
        customSettings: {
          ...existingWidget.config.customSettings,
          entityId: formValue.entityId,
          statusFieldKey: formValue.statusFieldKey,
          titleFieldKey: formValue.titleFieldKey,
          subtitleFieldKey: formValue.subtitleFieldKey,
          displayFields: formValue.displayFields
        },
        mappings: formValue.mappings || {},
        hideCard: formValue.hideCard ?? false
      });
    } else {
      const newWidget: Widget = {
        id: crypto.randomUUID(),
        type: (formValue.type as WidgetType) ?? 'chart-line',
        config: {
          title: formValue.title ?? 'Novo Widget',
          subtitle: formValue.subtitle ?? '',
          dataUrl: formValue.dataUrl ?? '',
          hideCard: formValue.hideCard ?? false,
          mappings: (formValue.mappings || {}) as any,
          customSettings: {
            entityId: formValue.entityId,
            statusFieldKey: formValue.statusFieldKey,
            titleFieldKey: formValue.titleFieldKey,
            subtitleFieldKey: formValue.subtitleFieldKey,
            displayFields: formValue.displayFields
          }
        },
        position: { x: 0, y: 0, w: 4, h: 4 }
      };
      this.store.addWidget(newWidget);
    }
    this.close();
  }

  protected close(): void {
    this.store.setEditingWidget(null);
    this.onClose.emit();
  }

  protected toggleField(key: string): void {
    const current = this.form.get('displayFields')?.value || [];
    const index = current.indexOf(key);
    if (index > -1) {
      this.form.patchValue({ displayFields: current.filter((k: string) => k !== key) });
    } else {
      this.form.patchValue({ displayFields: [...current, key] });
    }
  }

  protected isFieldSelected(key: string): boolean {
    const current = this.form.get('displayFields')?.value || [];
    return current.includes(key);
  }

  protected updateMapping(key: string, value: string): void {
    const current = (this.form.get('mappings')?.value || {}) as Record<string, string>;
    this.form.patchValue({
      mappings: { ...current, [key]: value } as any
    });
  }
}
