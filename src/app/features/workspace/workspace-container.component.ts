import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  HostListener,
  inject,
  input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { GridStack } from 'gridstack';
import 'gridstack/dist/gridstack.min.css';
import { Widget, WidgetType } from '../../core/models/workspace.model';
import { ThemeService } from '../../core/services/theme.service';
import { EditorToolbarComponent } from './components/editor-toolbar/editor-toolbar.component';
import { WidgetDisplayComponent } from './components/widget-display/widget-display.component';
import { WidgetEditorComponent } from './components/widget-editor/widget-editor.component';
import { WidgetPickerComponent } from './components/widget-picker/widget-picker.component';
import { WorkspaceStore } from './services/workspace-store.service';

const GRID_COLUMNS = 12;
const CHART_RESIZE_DELAY_MS = 100;

@Component({
  selector: 'app-workspace-container',
  standalone: true,
  imports: [CommonModule, WidgetDisplayComponent, EditorToolbarComponent, WidgetEditorComponent, WidgetPickerComponent],
  template: `
    <div class="dashboard-wrapper">
      <app-editor-toolbar (addWidget)="openWidgetPicker()" />

      @if (store.isLoading()) {
        <div class="loading-overlay">
          <span>Loading Dashboard...</span>
        </div>
      }

      @if (store.errorMessage(); as error) {
        <div class="error-banner">
          {{ error }}
        </div>
      }

      <div
        #gridContainer
        class="grid-stack dashboard-grid"
        [class.editor-mode]="store.isEditorMode()"
      >
        @for (widget of store.widgets(); track widget.id) {
          <div
            class="grid-stack-item"
            [attr.gs-id]="widget.id"
            [attr.gs-x]="widget.position.x"
            [attr.gs-y]="widget.position.y"
            [attr.gs-w]="widget.position.w"
            [attr.gs-h]="widget.position.h"
          >
            <div class="grid-stack-item-content">
              <app-widget-display
                [widget]="widget"
                [isEditor]="store.isEditorMode()"
                (widgetAction)="onWidgetAction(widget, $event)"
              />
            </div>
          </div>
        } @empty {
          <div class="empty-state">
            <p>Nenhum widget encontrado.</p>
            @if (store.isEditorMode()) {
              <button class="btn-add" (click)="openWidgetPicker()">Adicionar Widget</button>
            }
          </div>
        }
      </div>

      @if (isPickingType) {
        <app-widget-picker
          (select)="onTypeSelected($event)"
          (close)="isPickingType = false"
        />
      }

      @if (store.editingWidget() || (isAddingNew && currentSelectedType)) {
        <app-widget-editor
          [widget]="store.editingWidget()"
          [initialType]="currentSelectedType"
          (onClose)="resetCreationState()"
        />
      }
    </div>
  `,
  styles: [`
    .dashboard-wrapper {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      background: transparent;
      padding: 8px;
    }

    .dashboard-grid {
      background: transparent;
      transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .dashboard-grid.editor-mode {
      outline: 2px dashed rgba(var(--color-primary-rgb, 59, 130, 246), 0.2);
      background: rgba(var(--color-primary-rgb, 59, 130, 246), 0.02);
      min-height: 600px;
      border-radius: var(--radius);
      padding: 10px;
    }

    .grid-stack-item-content {
      background: transparent !important;
      display: flex;
      transition: transform 0.3s ease;
    }

    app-widget-display {
      display: block;
      width: 100%;
      height: 100%;
    }

    .empty-state {
      grid-column: span 12;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 6rem 4rem;
      color: var(--color-text-secondary);
      background: var(--glass-bg);
      backdrop-filter: blur(var(--glass-blur));
      border-radius: var(--radius);
      border: 1px dashed var(--color-border);
    }

    .btn-add {
      background: var(--color-primary-600);
      color: white;
      border: none;
      padding: 12px 28px;
      border-radius: 12px;
      cursor: pointer;
      font-weight: 700;
      margin-top: 1.5rem;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 12px rgba(var(--color-primary-rgb, 59, 130, 246), 0.3);
    }
    .btn-add:hover { 
      background: var(--color-primary-700); 
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(var(--color-primary-rgb, 59, 130, 246), 0.4);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkspaceContainerComponent implements OnInit, AfterViewInit, OnDestroy {
  workspaceId = input.required<string>();
  protected readonly store = inject(WorkspaceStore);
  protected readonly themeService = inject(ThemeService);

  @ViewChild('gridContainer') gridContainer!: ElementRef;
  private grid?: GridStack;

  protected isAddingNew = false;
  protected isPickingType = false;
  protected currentSelectedType: WidgetType | null = null;

  constructor() {
    effect(() => {
      const isEditor = this.store.isEditorMode();
      this.toggleGridEditMode(isEditor);
    });

    // Sincroniza widgets com GridStack quando a lista muda via Signals
    effect(() => {
      const _widgets = this.store.widgets();
      setTimeout(() => this.syncWidgetsWithGrid(), 0);
    });
  }

  private syncWidgetsWithGrid(): void {
    if (!this.grid || !this.gridContainer) return;

    const elements = this.gridContainer.nativeElement.querySelectorAll('.grid-stack-item');
    elements.forEach((el: Element) => {
      if (!(el as any).gridstackNode) {
        this.grid!.makeWidget(el as any);
      }
    });
  }

  // Escuta evento global disparado pela EditorToolbar via output → container
  @HostListener('window:dashboard:add-widget')
  protected onAddWidgetEvent(): void {
    this.openWidgetPicker();
  }

  ngOnInit(): void {
    this.store.loadWorkspace(this.workspaceId());
  }

  ngAfterViewInit(): void {
    this.initGridStack();
  }

  ngOnDestroy(): void {
    this.grid?.destroy(false);
  }

  private initGridStack(): void {
    if (!this.gridContainer) return;

    this.grid = GridStack.init({
      column: GRID_COLUMNS,
      cellHeight: '100px',
      margin: 16,
      animate: true,
      staticGrid: !this.store.isEditorMode(),
      draggable: {
        handle: '.widget-header',
        cancel: '.widget-actions'
      },
      resizable: {
        handles: 'e, se, s, sw, w'
      }
    }, this.gridContainer.nativeElement);

    this.grid.on('change', (_event: Event, items: any) => {
      if (!items) return;

      items.forEach((item: any) => {
        if (!item.id) return;
        this.store.updateWidgetPosition(item.id, {
          x: item.x ?? 0,
          y: item.y ?? 0,
          w: item.w ?? 1,
          h: item.h ?? 1
        });
      });

      // Força ECharts a recalcular dimensões após drag/resize
      setTimeout(() => window.dispatchEvent(new Event('resize')), CHART_RESIZE_DELAY_MS);
    });
  }

  private toggleGridEditMode(isEditor: boolean): void {
    this.grid?.setStatic(!isEditor);
  }

  protected openWidgetPicker(): void {
    this.store.setEditingWidget(null);
    this.isAddingNew = true;
    this.isPickingType = true;
  }

  protected onTypeSelected(type: WidgetType): void {
    this.currentSelectedType = type;
    this.isPickingType = false;
  }

  protected resetCreationState(): void {
    this.isAddingNew = false;
    this.isPickingType = false;
    this.currentSelectedType = null;
    this.store.setEditingWidget(null);
  }

  /** Wrapper para receber o $event do template Angular e delegar tipado para handleWidgetAction */
  protected onWidgetAction(widget: Widget, action: unknown): void {
    this.handleWidgetAction(widget, action as 'edit' | 'clone' | 'remove');
  }

  protected handleWidgetAction(widget: Widget, action: 'edit' | 'clone' | 'remove'): void {
    if (action === 'edit') {
      this.store.setEditingWidget(widget);
    } else if (action === 'remove') {
      this.store.removeWidget(widget.id);
    } else if (action === 'clone') {
      const clonedWidget: Widget = {
        ...widget,
        id: crypto.randomUUID(),
        position: { ...widget.position, x: (widget.position.x + 1) % GRID_COLUMNS }
      };
      this.store.addWidget(clonedWidget);
    }
  }
}
