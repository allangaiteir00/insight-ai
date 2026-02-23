import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Widget } from '../../../../../core/models/workspace.model';
import { EntityRegistryService } from '../../../../../core/page-engine/services/entity-registry.service';
import { PageInteractionService } from '../../../../../core/page-engine/services/page-interaction.service';
import { CalendarWidgetComponent } from '../../../../../shared/widgets/calendar/calendar-widget.component';
import { EntityCardWidgetComponent } from '../../../../../shared/widgets/entity-card/entity-card-widget.component';
import { FilterWidgetComponent } from '../../../../../shared/widgets/filter/filter-widget.component';
import { FormWidgetComponent } from '../../../../../shared/widgets/forms/form-widget.component';
import { GanttWidgetComponent } from '../../../../../shared/widgets/gantt/gantt-widget.component';
import { KanbanWidgetComponent } from '../../../../../shared/widgets/kanban/kanban-widget.component';
import { ListWidgetComponent } from '../../../../../shared/widgets/list/list-widget.component';
import { MapWidgetComponent } from '../../../../../shared/widgets/map/map-widget.component';
import { MetricWidgetComponent } from '../../../../../shared/widgets/metric/metric-widget.component';
import { TableWidgetComponent } from '../../../../../shared/widgets/table/table-widget.component';

@Component({
  selector: 'app-entity-widget',
  standalone: true,
  imports: [CommonModule, FormWidgetComponent, KanbanWidgetComponent, ListWidgetComponent, EntityCardWidgetComponent, TableWidgetComponent, MetricWidgetComponent, FilterWidgetComponent, GanttWidgetComponent, MapWidgetComponent, CalendarWidgetComponent],
  template: `
    <div class="entity-widget-container">
      @if (entityDefinition(); as entity) {
        @switch (widget().type) {
          @case ('form') {
            <app-form-widget 
              [config]="widget().config" 
              [entity]="entity" 
              [selectedRecordId]="selectedRecordId()" 
            />
          }
          @case ('kanban') {
            <app-kanban-widget 
              [config]="widget().config" 
              [entity]="entity" 
            />
          }
          @case ('list') {
            <app-list-widget 
              [config]="widget().config" 
              [entity]="entity" 
            />
          }
          @case ('table') {
            <app-table-widget
              [config]="widget().config"
              [entity]="entity"
            />
          }
          @case ('metric') {
            <app-metric-widget
              [config]="widget().config"
              [entity]="entity"
              [data]="data()"
            />
          }
          @case ('filter') {
            <app-filter-widget
              [config]="widget().config"
              [entity]="entity"
            />
          }
          @case ('action-button') {
            <div class="action-stub">
              <button class="btn-action" (click)="onActionTriggered()">
                {{ widget().config.title }}
              </button>
            </div>
          }
          @case ('entity-card') {
            <app-entity-card-widget
              [config]="widget().config"
              [entity]="entity"
              [selectedRecordId]="selectedRecordId()"
            />
          }
          @case ('gantt') {
            <app-gantt-widget
              [config]="widget().config"
              [entity]="entity"
              [data]="data()"
            />
          }
          @case ('map') {
            <app-map-widget
              [config]="widget().config"
              [entity]="entity"
              [data]="data()"
            />
          }
          @case ('calendar') {
            <app-calendar-widget
              [config]="widget().config"
              [entity]="entity"
              [data]="data()"
            />
          }
        }
      } @else {
        <div class="no-entity">
          <p>Selecione uma entidade nas configurações para este widget.</p>
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; height: 100%; }
    .entity-widget-container { height: 100%; display: flex; flex-direction: column; }
    .action-stub { display: flex; align-items: center; justify-content: center; height: 100%; }
    .btn-action { padding: 12px 24px; background: var(--color-primary-600); color: white; border: none; border-radius: calc(var(--radius) * 0.8); font-weight: 700; cursor: pointer; box-shadow: 0 4px 10px color-mix(in srgb, var(--color-primary-600) 30%, transparent); transition: transform 0.2s; }
    .btn-action:active { transform: scale(0.95); }
    .card-stub { height: 100%; background: var(--color-primary-50); border-radius: calc(var(--radius) * 0.8); border: 1px solid var(--color-primary-100); display: flex; flex-direction: column; }
    .card-header { height: 40px; background: var(--color-primary-100); border-radius: calc(var(--radius) * 0.8) calc(var(--radius) * 0.8) 0 0; padding: 0 15px; display: flex; align-items: center; }
    .card-header h3 { margin: 0; font-size: 0.85rem; color: var(--color-primary-700); font-weight: 600; }
    .card-body { flex: 1; padding: 15px; position: relative; }
    .selection-ctx { position: absolute; bottom: 10px; right: 10px; font-size: 0.65rem; color: var(--color-primary-400); font-style: italic; }
    .no-entity { display: flex; align-items: center; justify-content: center; height: 100%; color: var(--color-text-muted); text-align: center; padding: 20px; border: 1px dashed var(--color-border); border-radius: calc(var(--radius) * 0.8); }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntityWidgetComponent {
  widget = input.required<Widget>();
  data = input<any>(null);
  private readonly entityRegistry = inject(EntityRegistryService);
  private readonly interactionBus = inject(PageInteractionService);

  protected selectedRecordId = signal<string | null>(null);

  protected entityDefinition = computed(() => {
    const entityId = this.widget().config.customSettings?.['entityId'];
    return entityId ? this.entityRegistry.getEntity(entityId) : undefined;
  });

  constructor() {
    this.interactionBus.onRecordSelected().pipe(
      takeUntilDestroyed()
    ).subscribe(event => {
      const myEntityId = this.widget().config.customSettings?.['entityId'];
      if (event.entityId === myEntityId) {
        this.selectedRecordId.set(event.payload);
      }
    });
  }

  protected onActionTriggered(): void {
    this.interactionBus.emit({
      sourceId: this.widget().id,
      type: 'actionTriggered',
      entityId: this.widget().config.customSettings?.['entityId'],
      payload: { actionId: 'custom', title: this.widget().config.title }
    });
  }
}
