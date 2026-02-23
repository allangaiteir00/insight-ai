import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideDatabase, lucideMoon, lucideSun } from '@ng-icons/lucide';
import { EntityRegistryService } from '../../core/page-engine/services/entity-registry.service';
import { WorkspaceStore } from '../workspace/services/workspace-store.service';
import { EntityEditorComponent } from './components/smart/entity-editor/entity-editor.component';

@Component({
  selector: 'app-entity-management',
  standalone: true,
  imports: [CommonModule, EntityEditorComponent, NgIconComponent],
  providers: [provideIcons({ lucideDatabase, lucideSun, lucideMoon })],
  template: `
    @if (isEditing()) {
      <app-entity-editor 
        (onCancel)="isEditing.set(false)" 
        (onSave)="onEntitySaved()"
      />
    } @else {
      <div class="toolbar">
        <div class="dashboard-info">
          <div class="header-icon">
            <ng-icon name="lucideDatabase" />
          </div>
          <div class="header-text">
            <h2 class="dashboard-title">Gestão de Entidades</h2>
            <p class="description">Defina a estrutura de dados e campos do seu sistema.</p>
          </div>
        </div>

        <div class="actions">
          <button class="btn-create" (click)="isEditing.set(true)">
            <span>+ Nova Entidade</span>
          </button>
        </div>
      </div>

      <div class="entity-grid">
        @for (entity of entityRegistry.entities(); track entity.id) {
          <div class="entity-card">
            <div class="card-header">
              <div class="entity-icon">
                <span class="icon-orb"></span>
                <span class="letter">{{ entity.name.charAt(0) }}</span>
              </div>
              <div class="entity-info">
                <h3>{{ entity.label }}</h3>
                <span class="entity-id">{{ entity.id }}</span>
              </div>
            </div>
            
            <div class="fields-list">
              <div class="fields-header">
                <span>Campos ({{ entity.fields.length }})</span>
              </div>
              <div class="fields-scroll">
                @for (field of entity.fields; track field.key) {
                  <div class="field-tag">
                    <span class="dot" [class]="field.type"></span>
                    {{ field.label }}
                  </div>
                }
              </div>
            </div>

            <div class="card-footer">
              <button class="btn-action">Configurar Engine</button>
              <button class="btn-action icon-only">⚙️</button>
            </div>
          </div>
        }
      </div>
    }
  `,
  styles: [`
    /* ... existing styles untouched ... */
    .toolbar { display: flex; justify-content: space-between; align-items: center; padding: 12px 18px; background: var(--color-surface-card); border-radius: var(--radius); border: 1px solid var(--color-border); margin-bottom: 24px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); gap: 16px; }

    .dashboard-info {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-shrink: 0;
    }

    .header-icon {
      width: 48px;
      height: 48px;
      background: color-mix(in srgb, var(--color-primary) 15%, transparent);
      color: var(--color-primary);
      border-radius: calc(var(--radius) * 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
    }

    .header-text {
      display: flex;
      flex-direction: column;
    }

    .dashboard-title {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 800;
      color: var(--color-text-primary);
      letter-spacing: -0.02em;
    }

    .description { color: var(--color-text-secondary); font-size: 0.9rem; margin: 4px 0 0 0; }

    .actions {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-shrink: 0;
    }

    .btn-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 8px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--color-surface);
      color: var(--color-text-secondary);
      border: 1px solid var(--color-border);
      cursor: pointer;
      transition: all 0.2s;
      font-size: 1.1rem;
    }
    .btn-icon:hover {
      background: var(--palette-50);
      color: var(--palette-accent);
      border-color: var(--palette-accent);
    }

    .btn-create {
      background: var(--color-primary);
      color: white;
      border: none;
      padding: 14px 28px;
      border-radius: calc(var(--radius) * 0.8);
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 10px 20px color-mix(in srgb, var(--color-primary) 20%, transparent);
      transition: all 0.2s;
    }
    .btn-create:hover { transform: translateY(-2px); box-shadow: 0 15px 30px color-mix(in srgb, var(--color-primary) 30%, transparent); }

    .entity-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 24px;
    }

    .entity-card {
      background: var(--color-surface-card);
      border: 1px solid var(--color-border);
      border-radius: var(--radius);
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      transition: all 0.3s;
    }
    .entity-card:hover { 
      background: var(--color-surface); 
      border-color: color-mix(in srgb, var(--palette-accent) 30%, transparent);
      transform: translateY(-5px);
    }

    .card-header { display: flex; align-items: center; gap: 16px; }
    
    .entity-icon {
      width: 50px;
      height: 50px;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: calc(var(--radius) * 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }
    .icon-orb { position: absolute; width: 30px; height: 30px; background: color-mix(in srgb, var(--palette-accent) 20%, transparent); filter: blur(10px); }
    .letter { color: var(--color-text-primary); font-weight: 800; font-size: 1.2rem; position: relative; }

    .entity-info h3 { margin: 0; font-size: 1.1rem; font-weight: 750; color: var(--color-text-primary); }
    .entity-id { font-size: 0.75rem; color: var(--color-text-muted); font-family: monospace; }

    .fields-list {
      background: var(--color-surface);
      border-radius: calc(var(--radius) * 0.8);
      padding: 16px;
    }
    .fields-header { font-size: 0.7rem; font-weight: 800; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px; display: block; }
    
    .fields-scroll { display: flex; flex-wrap: wrap; gap: 8px; }
    .field-tag { 
      background: var(--color-surface-card); 
      border: 1px solid var(--color-border);
      padding: 6px 12px; 
      border-radius: calc(var(--radius) * 0.4); 
      font-size: 0.8rem; 
      color: var(--color-text-secondary); 
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .dot { width: 6px; height: 6px; border-radius: 50%; opacity: 0.7; }
    .dot.string { background: var(--color-primary); }
    .dot.select { background: #f59e0b; }
    .dot.date { background: #10b981; }

    .card-footer { display: flex; gap: 10px; margin-top: auto; }
    .btn-action { 
      flex: 1; 
      background: var(--color-surface); 
      border: 1px solid var(--color-border); 
      color: var(--color-text-primary); 
      padding: 10px; 
      border-radius: calc(var(--radius) * 0.5); 
      font-size: 0.85rem; 
      font-weight: 700; 
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-action:hover { background: var(--color-surface-card); border-color: var(--color-text-muted); }
    .btn-action.icon-only { flex: 0 0 42px; width: 42px; display: flex; align-items: center; justify-content: center; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntityManagementComponent {
  protected readonly entityRegistry = inject(EntityRegistryService);
  protected readonly store = inject(WorkspaceStore);
  protected readonly isEditing = signal(false);

  protected onEntitySaved() {
    this.isEditing.set(false);
  }
}
