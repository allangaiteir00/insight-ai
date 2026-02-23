import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Widget } from '../../../core/models/workspace.model';
import { EntityDefinition } from '../../../core/page-engine/models/entity.model';
import { EntityDataService } from '../../../core/page-engine/services/entity-data.service';
import { PageInteractionService } from '../../../core/page-engine/services/page-interaction.service';

@Component({
  selector: 'app-form-widget',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="form-wrapper">
      <div class="form-header">
        <div class="title-group">
          <h3>{{ config().title }}</h3>
          <span class="badge" [class.new]="!currentRecordId()">
            {{ currentRecordId() ? 'Editando: ' + currentRecordId() : 'Novo Registro' }}
          </span>
        </div>
      </div>
      
      <form [formGroup]="form" (ngSubmit)="save()" class="form-body">
        @for (field of entity().fields; track field.key) {
          <div class="form-field">
            <label>{{ field.label }}</label>
            
            @if (field.type === 'select') {
              <select [formControlName]="field.key">
                <option value="">Selecione...</option>
                @for (opt of field.options; track opt.value) {
                  <option [value]="opt.value">{{ opt.label }}</option>
                }
              </select>
            } @else if (field.type === 'date') {
              <input type="date" [formControlName]="field.key">
            } @else {
              <input type="text" [formControlName]="field.key" [placeholder]="'Digite o ' + field.label">
            }
          </div>
        }

        <div class="form-actions">
           <button type="button" class="btn-clear" (click)="clear()">Limpar</button>
           <button type="submit" class="btn-save" [disabled]="form.invalid">Salvar</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    :host { display: block; height: 100%; }
    .form-wrapper { display: flex; flex-direction: column; height: 100%; background: var(--color-surface-card); border-radius: var(--radius); border: 1px solid var(--color-border); overflow: hidden; }
    .form-header { padding: 20px; background: var(--color-surface); border-bottom: 1px solid var(--color-border); }
    .title-group { display: flex; align-items: center; justify-content: space-between; }
    .title-group h3 { margin: 0; font-size: 1.1rem; font-weight: 700; color: var(--color-text-primary); }
    
    .badge { font-size: 0.65rem; padding: 4px 10px; background: var(--color-primary-100); color: var(--color-primary-700); border-radius: var(--radius); font-weight: 800; }
    .badge.new { background: #dcfce7; color: #166534; }

    .form-body { padding: 24px; flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 20px; }
    .form-field { display: flex; flex-direction: column; gap: 8px; }
    .form-field label { font-size: 0.8rem; font-weight: 700; color: var(--color-text-secondary); text-transform: uppercase; letter-spacing: 0.05em; }
    
    input, select { padding: 12px 16px; border: 2px solid var(--color-border); border-radius: calc(var(--radius) * 0.6); background: var(--color-surface); color: var(--color-text-primary); font-size: 0.9rem; transition: all 0.2s; }
    input:focus, select:focus { outline: none; border-color: var(--color-primary-400); box-shadow: 0 0 0 4px var(--color-primary-50); }

    .form-actions { margin-top: auto; padding-top: 20px; display: flex; gap: 12px; }
    .btn-save { flex: 2; padding: 14px; background: var(--color-primary-600); color: white; border: none; border-radius: calc(var(--radius) * 0.6); font-weight: 700; cursor: pointer; transition: all 0.2s; }
    .btn-save:hover:not(:disabled) { background: var(--color-primary-700); transform: translateY(-2px); }
    .btn-save:disabled { opacity: 0.5; cursor: not-allowed; }
    
    .btn-clear { flex: 1; padding: 14px; background: var(--color-surface); border: 1.5px solid var(--color-border); color: var(--color-text-secondary); border-radius: calc(var(--radius) * 0.6); font-weight: 700; cursor: pointer; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormWidgetComponent {
  config = input.required<Widget['config']>();
  entity = input.required<EntityDefinition>();
  selectedRecordIdFromInput = input<string | null>(null, { alias: 'selectedRecordId' });

  private readonly fb = inject(FormBuilder);
  private readonly dataService = inject(EntityDataService);
  private readonly interactionBus = inject(PageInteractionService);

  protected currentRecordId = signal<string | null>(null);
  protected form: FormGroup = this.fb.group({});

  constructor() {
    // Reagir a mudanças na entidade para reconstruir o formulário
    effect(() => {
      const fields = this.entity().fields;
      const group: any = {};
      fields.forEach(f => group[f.key] = ['']);
      this.form = this.fb.group(group);
    });

    // Reagir a seleções externas via Event Bus
    this.interactionBus.on('recordSelected').subscribe(event => {
      if (event.entityId === this.entity().id && typeof event.payload === 'string') {
        this.loadRecord(event.payload);
      }
    });
  }

  loadRecord(id: string) {
    const records = this.dataService.getRecords(this.entity().id)();
    const record = records.find(r => r.id === id);
    if (record) {
      this.currentRecordId.set(id);
      this.form.patchValue(record.data);
    }
  }

  save() {
    const id = this.currentRecordId();
    if (id) {
      this.dataService.updateRecord(this.entity().id, id, this.form.value);
    } else {
      const record = this.dataService.addRecord(this.entity().id, this.form.value);
      this.currentRecordId.set(record.id);
    }

    this.interactionBus.emit({
      sourceId: this.config().title,
      type: 'dataChanged',
      entityId: this.entity().id,
      payload: { recordId: this.currentRecordId() }
    });
  }

  clear() {
    this.currentRecordId.set(null);
    this.form.reset();
  }
}
