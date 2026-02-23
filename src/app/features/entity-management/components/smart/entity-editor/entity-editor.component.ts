import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, EventEmitter, inject, input, Output, untracked } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EntityDefinition, EntityFieldType } from '../../../../../core/page-engine/models/entity.model';
import { EntityRegistryService } from '../../../../../core/page-engine/services/entity-registry.service';

@Component({
  selector: 'app-entity-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="editor-container">
      <div class="editor-header">
        <div class="header-titles">
          <h2>{{ entityId() ? 'Editar Entidade' : 'Nova Entidade' }}</h2>
          <p>{{ entityId() ? 'Configure os metadados e campos da sua entidade existente.' : 'Defina os metadados e os campos da sua nova entidade de negócio.' }}</p>
        </div>
        <div class="header-actions">
          <button class="btn-secondary" (click)="cancel()">Cancelar</button>
          <button class="btn-primary" [disabled]="form.invalid" (click)="save()">Salvar Entidade</button>
        </div>
      </div>

      <form [formGroup]="form" class="editor-form">
        <div class="form-section">
          <h3>Informações Básicas</h3>
          
          <div class="form-row">
            <div class="form-group flex-2">
              <label>Nome do Sistema (ID)</label>
              <input type="text" formControlName="id" placeholder="ex: leads_vendas" class="form-control" [readOnly]="!!entityId()">
              <span class="hint">Usado internamente. Sem espaços ou caracteres especiais.</span>
            </div>
            
            <div class="form-group flex-3">
              <label>Nome de Exibição (Label)</label>
              <input type="text" formControlName="label" placeholder="ex: Gestão de Leads" class="form-control">
            </div>

            <div class="form-group flex-3">
              <label>Nome no Plural</label>
              <input type="text" formControlName="name" placeholder="ex: Leads" class="form-control">
            </div>

            <div class="form-group flex-4">
              <label>Data URL (Fonte de Dados)</label>
              <input type="text" formControlName="url" placeholder="https://api.exemplo.com/v1/leads" class="form-control">
              <span class="hint">URL base para busca de registros desta entidade.</span>
            </div>
          </div>
        </div>

        <div class="form-section">
          <div class="section-header">
            <h3>Campos de Dados</h3>
            <button type="button" class="btn-add-field" (click)="addField()">+ Adicionar Campo</button>
          </div>

          <div formArrayName="fields" class="fields-list">
            @for (field of fields.controls; track $index; let i = $index) {
              <div [formGroupName]="i" class="field-item">
                <div class="field-drag-handle">⋮⋮</div>
                
                <div class="field-inputs">
                  <div class="form-group flex-2">
                    <label>Chave do Campo</label>
                    <input type="text" formControlName="key" placeholder="ex: vl_venda" class="form-control form-control-sm">
                  </div>
                  
                  <div class="form-group flex-3">
                    <label>Rótulo</label>
                    <input type="text" formControlName="label" placeholder="ex: Valor da Venda" class="form-control form-control-sm">
                  </div>

                  <div class="form-group flex-2">
                    <label>Tipo de Dado</label>
                    <select formControlName="type" class="form-control form-control-sm">
                      <option value="string">Texto (String)</option>
                      <option value="number">Número</option>
                      <option value="date">Data & Hora</option>
                      <option value="select">Lista de Seleção</option>
                      <option value="boolean">Verdadeiro/Falso</option>
                      <option value="relation">Relacionamento</option>
                    </select>
                  </div>

                  <div class="form-group checkbox-group">
                    <label class="checkbox-label">
                      <input type="checkbox" formControlName="required">
                      Obrigatório
                    </label>
                  </div>
                </div>

                <button type="button" class="btn-remove-field" (click)="removeField(i)">✕</button>
              </div>
            }
          </div>
        </div>

        <div class="form-section">
          <div class="section-header">
            <h3>Relacionamentos (Hierarquia)</h3>
            <button type="button" class="btn-add-field" (click)="addRelation()">+ Adicionar Relação</button>
          </div>

          <div formArrayName="relations" class="fields-list">
            @for (rel of relations.controls; track $index; let i = $index) {
              <div [formGroupName]="i" class="field-item">
                <div class="field-inputs">
                  <div class="form-group flex-3">
                    <label>Entidade Pai (Destino)</label>
                    <select formControlName="toEntityId" class="form-control form-control-sm">
                      <option value="">Selecione...</option>
                      @for (entity of registry.entities(); track entity.id) {
                        <option [value]="entity.id">{{ entity.label }}</option>
                      }
                    </select>
                  </div>
                  
                  <div class="form-group flex-3">
                    <label>Chave Estrangeira (FK)</label>
                    <input type="text" formControlName="foreignKey" placeholder="ex: customerId" class="form-control form-control-sm">
                  </div>

                  <div class="form-group flex-2">
                    <label>Tipo</label>
                    <select formControlName="type" class="form-control form-control-sm">
                      <option value="one-to-many">1 : N (Um para Muitos)</option>
                      <option value="many-to-many">N : N (Muitos para Muitos)</option>
                    </select>
                  </div>
                </div>

                <button type="button" class="btn-remove-field" (click)="removeRelation(i)">✕</button>
              </div>
            }
          </div>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .editor-container {
      background: color-mix(in srgb, var(--color-surface) 95%, transparent);
      border: 1px solid var(--color-border);
      border-radius: 24px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      height: 100%;
      backdrop-filter: blur(12px);
    }

    .editor-header {
      padding: 24px 32px;
      border-bottom: 1px solid var(--color-border);
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--color-surface-card);
    }

    .header-titles h2 { margin: 0; font-size: 1.5rem; color: var(--color-text-primary); font-weight: 800; }
    .header-titles p { margin: 4px 0 0 0; color: var(--color-text-secondary); font-size: 0.9rem; }

    .header-actions { display: flex; gap: 12px; }
    
    .btn-secondary, .btn-primary {
      padding: 10px 20px;
      border-radius: 10px;
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-secondary {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      color: var(--color-text-primary);
    }
    .btn-secondary:hover { background: var(--color-surface-card); }
    
    .btn-primary {
      background: var(--palette-accent, var(--palette-600));
      border: none;
      color: white;
      box-shadow: 0 4px 12px color-mix(in srgb, var(--palette-accent) 30%, transparent);
    }
    .btn-primary:hover:not(:disabled) { transform: translateY(-1px); background: color-mix(in srgb, var(--palette-accent) 80%, black); }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; box-shadow: none; }

    .no-fields {
      padding: 40px;
      text-align: center;
      background: var(--color-surface);
      border-radius: calc(var(--radius) * 0.8);
      color: var(--color-text-secondary);
      border: 1px dashed var(--color-border);
    }

    .editor-form {
      padding: 32px;
      display: flex;
      flex-direction: column;
      gap: 40px;
      overflow-y: auto;
    }

    .form-section { display: flex; flex-direction: column; gap: 20px; }
    .form-section h3 { margin: 0; font-size: 1.1rem; color: var(--color-text-primary); font-weight: 700; border-bottom: 1px solid var(--color-border); padding-bottom: 12px; }
    
    .section-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--color-border); padding-bottom: 12px; }
    .section-header h3 { border: none; padding: 0; }

    .form-row { display: flex; gap: 24px; }
    
    .form-group { display: flex; flex-direction: column; gap: 8px; }
    .flex-2 { flex: 2; }
    .flex-3 { flex: 3; }
    .flex-4 { flex: 4; }
    
    .form-group label { font-size: 0.8rem; font-weight: 600; color: var(--color-text-secondary); text-transform: uppercase; letter-spacing: 0.05em; }
    .hint { font-size: 0.75rem; color: var(--color-text-muted); }

    .form-control {
      background: var(--color-surface-card);
      border: 1px solid var(--color-border);
      border-radius: 10px;
      padding: 12px 16px;
      color: var(--color-text-primary);
      font-family: inherit;
      font-size: 0.95rem;
      transition: border-color 0.2s;
    }
    .form-control:focus { outline: none; border-color: var(--palette-accent, var(--palette-500)); }
    .form-control.ng-invalid.ng-touched { border-color: #ef4444; }
    
    .form-control-sm { padding: 8px 12px; font-size: 0.85rem; border-radius: 8px; }

    .btn-add-field {
      background: color-mix(in srgb, #10b981 10%, transparent);
      color: #10b981;
      border: 1px solid color-mix(in srgb, #10b981 20%, transparent);
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 0.8rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-add-field:hover { background: color-mix(in srgb, #10b981 20%, transparent); }

    .fields-list { display: flex; flex-direction: column; gap: 12px; }
    
    .field-item {
      display: flex;
      align-items: center;
      gap: 16px;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      padding: 16px;
      border-radius: 12px;
    }

    .field-drag-handle { color: var(--color-text-muted); cursor: grab; font-size: 1.2rem; user-select: none; }
    
    .field-inputs { flex: 1; display: flex; gap: 16px; align-items: flex-end; }
    
    .checkbox-group { justify-content: center; height: 36px; }
    .checkbox-label { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; font-weight: 600; color: var(--color-text-secondary); cursor: pointer; text-transform: none; }
    
    .btn-remove-field {
      width: 36px;
      height: 36px;
      border-radius: var(--radius);
      background: color-mix(in srgb, #ef4444 10%, transparent);
      color: #ef4444;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      flex-shrink: 0;
    }
    .btn-remove-field:hover { background: color-mix(in srgb, #ef4444 20%, transparent); }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntityEditorComponent {
  @Output() onCancel = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<EntityDefinition>();

  entityId = input<string | null>(null);

  private readonly fb = inject(FormBuilder);
  protected readonly registry = inject(EntityRegistryService);

  readonly form = this.fb.group({
    id: ['', [Validators.required, Validators.pattern(/^[a-z0-9_]+$/)]],
    name: ['', Validators.required],
    label: ['', Validators.required],
    url: [''],
    fields: this.fb.array([]),
    relations: this.fb.array([])
  });

  get fields() {
    return this.form.get('fields') as FormArray;
  }

  get relations() {
    return this.form.get('relations') as FormArray;
  }

  constructor() {
    effect(() => {
      const id = this.entityId();
      untracked(() => {
        if (id) {
          this.loadEntity(id);
        } else {
          // Reset form for "New Entity" mode
          this.form.reset({ id: '', name: '', label: '', url: '' });
          this.fields.clear();
          this.relations.clear();
          this.addField();
        }
      });
    });
  }

  private loadEntity(id: string) {
    const entity = this.registry.getEntity(id);
    if (!entity) return;

    this.form.patchValue({
      id: entity.id,
      name: entity.name,
      label: entity.label,
      url: entity.url || ''
    });

    this.fields.clear();
    entity.fields.forEach(f => {
      const group = this.fb.group({
        key: [f.key, [Validators.required, Validators.pattern(/^[a-zA-Z0-9_]+$/)]],
        label: [f.label, Validators.required],
        type: [f.type, Validators.required],
        required: [f.required || false]
      });
      this.fields.push(group);
    });

    this.relations.clear();
    entity.relations?.forEach(r => {
      const group = this.fb.group({
        fromEntityId: [r.fromEntityId],
        toEntityId: [r.toEntityId, Validators.required],
        type: [r.type, Validators.required],
        foreignKey: [r.foreignKey, Validators.required]
      });
      this.relations.push(group);
    });
  }

  addField() {
    const fieldGroup = this.fb.group({
      key: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9_]+$/)]],
      label: ['', Validators.required],
      type: ['string' as EntityFieldType, Validators.required],
      required: [false]
    });
    this.fields.push(fieldGroup);
  }

  removeField(index: number) {
    this.fields.removeAt(index);
  }

  addRelation() {
    const relGroup = this.fb.group({
      fromEntityId: [this.form.get('id')?.value],
      toEntityId: ['', Validators.required],
      type: ['one-to-many', Validators.required],
      foreignKey: ['', Validators.required]
    });
    this.relations.push(relGroup);
  }

  removeRelation(index: number) {
    this.relations.removeAt(index);
  }

  cancel() {
    this.onCancel.emit();
  }

  save() {
    if (this.form.invalid) return;
    const value = this.form.value;
    const newEntity: EntityDefinition = {
      id: value.id as string,
      name: value.name as string,
      label: value.label as string,
      url: value.url as string,
      fields: (value.fields as any[]) || [],
      relations: (value.relations as any[]) || [],
      actions: [
        { id: 'add', label: 'Novo Registro', type: 'create', icon: 'plus' },
        { id: 'edit', label: 'Editar', type: 'update' },
        { id: 'delete', label: 'Excluir', type: 'delete' }
      ]
    };
    this.registry.registerEntity(newEntity);
    this.onSave.emit(newEntity);
  }
}
