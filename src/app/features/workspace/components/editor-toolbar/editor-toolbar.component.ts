import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideLayoutDashboard, lucideMoon, lucideSun } from '@ng-icons/lucide';
import { ThemeService } from '../../../../core/services/theme.service';
import { WorkspaceStore } from '../../services/workspace-store.service';

@Component({
  selector: 'app-editor-toolbar',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  providers: [provideIcons({ lucideSun, lucideMoon, lucideLayoutDashboard })],
  template: `
    <div class="toolbar">
      <div class="dashboard-info">
        <div class="header-icon">
          <ng-icon name="lucideLayoutDashboard" />
        </div>
        <div class="header-text">
          <div class="title-row">
            <h2 class="dashboard-title">{{ store.workspace()?.name || 'Workspace' }}</h2>
            <span class="version-badge">v{{ store.activeVersion()?.versionNumber || 1 }}</span>
          </div>
          <p class="description">Gerencie seus widgets e visualize seus dados.</p>
        </div>
      </div>

      <div class="actions">

        @if (store.isEditorMode()) {
          <button class="btn btn-secondary" (click)="store.setMode('viewer')">Visualizar</button>
          <button class="btn btn-add-widget" (click)="addWidget.emit()">+ Widget</button>
          <button class="btn btn-primary" (click)="save()">Salvar Versão</button>
          <button class="btn btn-accent" (click)="publish()">Publicar</button>
        } @else {
          <button class="btn btn-primary" (click)="store.setMode('editor')">Editar</button>
        }
      </div>
    </div>
  `,
  styles: [`
    .toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      margin-bottom: 32px;
      background: var(--color-surface-card);
      border-radius: var(--radius);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      gap: 16px;
      border: 1px solid var(--color-border);
    }

    .dashboard-info {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-shrink: 0;
    }

    .header-icon {
      width: 40px;
      height: 40px;
      background: color-mix(in srgb, var(--color-primary) 15%, transparent);
      color: var(--color-primary);
      border-radius: calc(var(--radius) * 0.83);
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid color-mix(in srgb, var(--color-primary) 20%, transparent);
    }

    .header-text {
      display: flex;
      flex-direction: column;
    }

    .title-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .dashboard-title {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 800;
      color: var(--color-text-primary);
      letter-spacing: -0.02em;
    }

    .description { color: var(--color-text-secondary); font-size: 0.9rem; margin: 4px 0 0 0; }

    .version-badge {
      background: color-mix(in srgb, var(--color-primary) 10%, transparent);
      color: var(--color-primary);
      padding: 2px 8px;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 600;
      border: 1px solid color-mix(in srgb, var(--color-primary) 20%, transparent);
    }

    .palette-section {
      flex: 1;
      display: flex;
      justify-content: center;
      animation: fadeIn 0.2s ease;
    }

    .actions {
      display: flex;
      gap: 8px;
      flex-shrink: 0;
    }

    .btn {
      padding: 8px 16px;
      border-radius: var(--radius);
      font-weight: 600;
      font-size: 0.875rem;
      cursor: pointer;
      border: 1px solid transparent;
      transition: all 0.2s;
    }

    .btn-primary {
      background: var(--color-primary-600);
      color: #ffffff;
      box-shadow: 0 4px 12px color-mix(in srgb, var(--color-primary-600) 30%, transparent);
    }
    .btn-primary:hover { background: var(--color-primary-700); transform: translateY(-1px); }

    .btn-secondary { background: var(--color-surface-card); border-color: var(--color-border); color: var(--color-text-primary); }
    .btn-secondary:hover { background: var(--color-surface); }

    .btn-accent {
      background: #0f172a;
      color: #ffffff;
      border: 1px solid rgba(255,255,255,0.1);
    }
    .btn-accent:hover { background: color-mix(in srgb, var(--color-primary) 20%, #0f172a); }

    .btn-add-widget {
      background: var(--color-primary-50);
      color: var(--color-primary-600);
      border: 1px solid var(--color-primary-200);
    }
    .btn-add-widget:hover { background: var(--color-primary-100); }

    .btn-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 8px;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--color-surface);
      color: var(--color-text-secondary);
      border: 1px solid var(--color-border);
    }
    .btn-icon:hover {
      background: var(--color-primary-50);
      color: var(--color-primary);
      border-color: var(--color-primary-200);
    }

    @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorToolbarComponent {
  protected readonly store = inject(WorkspaceStore);
  protected readonly themeService = inject(ThemeService);

  /** Emite quando o usuário clica em \"+ Widget\"; o DashboardContainer orquestra o fluxo de criação */
  addWidget = output<void>();

  protected save(): void {
    this.store.saveCurrentVersion();
  }

  protected publish(): void {
    // TODO(dev): implementar publish via store após endpoint de publicação disponível — backlog
  }
}
