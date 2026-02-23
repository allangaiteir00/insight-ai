import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Widget, WidgetConfig, Workspace, WorkspaceVersion } from '../../../core/models/workspace.model';
import { WorkspaceApiService } from '../../../core/services/workspace-api.service';

@Injectable({ providedIn: 'root' })
export class WorkspaceStore {
    private readonly api = inject(WorkspaceApiService);

    // Private State
    private readonly _workspace = signal<Workspace | null>(null);
    private readonly _activeVersion = signal<WorkspaceVersion | null>(null);
    private readonly _mode = signal<'viewer' | 'editor'>('viewer');
    private readonly _editingWidget = signal<Widget | null>(null);
    private readonly _loading = signal<boolean>(false);
    private readonly _error = signal<string | null>(null);

    // Public Computed State
    readonly workspace = computed(() => this._workspace());
    readonly activeVersion = computed(() => this._activeVersion());
    readonly widgets = computed(() => this._activeVersion()?.widgets ?? []);
    readonly filters = computed(() => this._activeVersion()?.filters ?? []);
    readonly isEditorMode = computed(() => this._mode() === 'editor');
    readonly editingWidget = computed(() => this._editingWidget());
    readonly isLoading = computed(() => this._loading());
    readonly errorMessage = computed(() => this._error());

    // Actions
    async loadWorkspace(workspaceId: string): Promise<void> {
        this._loading.set(true);
        this._error.set(null);
        try {
            const versions = await firstValueFrom(this.api.getVersions(workspaceId));
            const activeVersion = versions.find(v => v.isActive) ?? versions[0];
            this._activeVersion.set(activeVersion);
            this._workspace.set({ id: workspaceId, name: `Workspace ${workspaceId}`, tenantId: 'local' });
        } catch {
            // Backend indisponível: inicializa modo local sem propagar erro ao usuário final
            this._error.set(null);
            this._activeVersion.set(this.buildLocalVersion(workspaceId));
            this._workspace.set({ id: workspaceId, name: 'Workspace Local', tenantId: 'local' });
        } finally {
            this._loading.set(false);
        }
    }

    setMode(mode: 'viewer' | 'editor'): void {
        this._mode.set(mode);
    }

    updateWidgetPosition(widgetId: string, position: { x: number; y: number; w: number; h: number }): void {
        const version = this._activeVersion();
        if (!version) return;

        const updatedWidgets = version.widgets.map((widget: Widget) =>
            widget.id === widgetId ? { ...widget, position: { ...widget.position, ...position } } : widget
        );

        this._activeVersion.set({ ...version, widgets: updatedWidgets });
    }

    setEditingWidget(widget: Widget | null): void {
        this._editingWidget.set(widget);
    }

    updateWidgetConfig(widgetId: string, config: Partial<WidgetConfig>): void {
        const version = this._activeVersion();
        if (!version) return;

        const updatedWidgets = version.widgets.map((widget: Widget) =>
            widget.id === widgetId ? { ...widget, config: { ...widget.config, ...config } } : widget
        );

        this._activeVersion.set({ ...version, widgets: updatedWidgets });
        this._editingWidget.set(null);
    }

    addWidget(widget: Widget): void {
        const version = this._activeVersion() ?? this.buildLocalVersion(this._workspace()?.id ?? 'local');
        this._activeVersion.set({ ...version, widgets: [...version.widgets, widget] });
    }

    removeWidget(widgetId: string): void {
        const version = this._activeVersion();
        if (!version) return;
        this._activeVersion.set({
            ...version,
            widgets: version.widgets.filter((widget: Widget) => widget.id !== widgetId)
        });
    }

    async saveCurrentVersion(): Promise<void> {
        const workspace = this._workspace();
        const version = this._activeVersion();
        if (!workspace || !version) return;

        this._loading.set(true);
        try {
            await firstValueFrom(this.api.createVersion(workspace.id, version));
        } catch {
            this._error.set('Falha ao salvar versão. Tente novamente.');
        } finally {
            this._loading.set(false);
        }
    }

    private buildLocalVersion(workspaceId: string): WorkspaceVersion {
        return {
            id: 'v-local',
            dashboardId: workspaceId,
            versionNumber: 1,
            isActive: true,
            widgets: [],
            filters: [],
            createdAt: new Date().toISOString()
        };
    }
}
