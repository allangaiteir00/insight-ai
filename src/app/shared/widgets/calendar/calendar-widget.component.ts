import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { WidgetConfig } from '../../../core/models/dashboard.model';
import { EntityDefinition } from '../../../core/page-engine/models/entity.model';

@Component({
  selector: 'app-calendar-widget',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
  template: `
    <div class="calendar-wrapper">
      <full-calendar [options]="calendarOptions()"></full-calendar>
    </div>
  `,
  styles: [`
    :host { display: block; height: 100%; }
    .calendar-wrapper {
      height: 100%;
      padding: 10px;
      overflow: auto;
    }
    :host ::ng-deep .fc {
      --fc-border-color: var(--color-border);
      --fc-today-bg-color: rgba(var(--color-primary-rgb), 0.05);
      font-size: 0.85rem;
    }
    :host ::ng-deep .fc-toolbar-title {
      font-size: 1rem !important;
      font-weight: 700;
      color: var(--color-text-primary);
    }
    :host ::ng-deep .fc-button {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      color: var(--color-text-primary);
      font-weight: 600;
      text-transform: capitalize;
    }
    :host ::ng-deep .fc-button-active {
      background: var(--color-primary-600) !important;
      border-color: var(--color-primary-600) !important;
      color: white !important;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarWidgetComponent {
  config = input.required<WidgetConfig>();
  entity = input<EntityDefinition>();
  data = input<any[] | null>();

  protected calendarOptions = computed((): CalendarOptions => {
    const rawData = this.data() || [];
    const mappings = this.config().mappings || {};
    const titleKey = mappings['eventTitle'] || 'name';
    const dateKey = mappings['eventDate'] || 'created_at';
    const endDateKey = mappings['eventEndDate'];

    const events = rawData.map(record => ({
      title: record[titleKey] || 'Evento',
      start: record[dateKey],
      end: endDateKey ? record[endDateKey] : undefined,
      allDay: true
    }));

    return {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,dayGridWeek'
      },
      locale: 'pt-br',
      events: events,
      height: 'auto',
      aspectRatio: 1.35,
      themeSystem: 'standard'
    };
  });
}
