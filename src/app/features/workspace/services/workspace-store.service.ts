import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Dashboard, DashboardVersion, Widget, WidgetConfig } from '../../../core/models/dashboard.model';
import { DashboardApiService } from '../../../core/services/dashboard-api.service';

@Injectable({ providedIn: 'root' })
export class WorkspaceStore {
    private readonly api = inject(DashboardApiService);

    // Private State
    private readonly _dashboard = signal<Dashboard | null>(null);
    private readonly _activeVersion = signal<DashboardVersion | null>(null);
    private readonly _mode = signal<'viewer' | 'editor'>('viewer');
    private readonly _editingWidget = signal<Widget | null>(null);
    private readonly _loading = signal<boolean>(false);
    private readonly _error = signal<string | null>(null);

    // Public Computed State
    readonly dashboard = computed(() => this._dashboard());
    readonly activeVersion = computed(() => this._activeVersion());
    readonly widgets = computed(() => this._activeVersion()?.widgets ?? []);
    readonly filters = computed(() => this._activeVersion()?.filters ?? []);
    readonly isEditorMode = computed(() => this._mode() === 'editor');
    readonly editingWidget = computed(() => this._editingWidget());
    readonly isLoading = computed(() => this._loading());
    readonly errorMessage = computed(() => this._error());

    // Actions
    async loadDashboard(dashboardId: string): Promise<void> {
        this._loading.set(true);
        this._error.set(null);
        try {
            const versions = await firstValueFrom(this.api.getVersions(dashboardId));
            const activeVersion = versions.find(v => v.isActive) ?? versions[0];
            this._activeVersion.set(activeVersion);
            this._dashboard.set({ id: dashboardId, name: `Workspace ${dashboardId}`, tenantId: 'local' });
        } catch {
            // Backend indisponível: inicializa modo local sem propagar erro ao usuário final
            this._error.set(null);
            this._activeVersion.set(this.buildLocalVersion(dashboardId));
            this._dashboard.set({ id: dashboardId, name: 'Workspace Local', tenantId: 'local' });
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
        const version = this._activeVersion() ?? this.buildLocalVersion(this._dashboard()?.id ?? 'local');
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
        const dashboard = this._dashboard();
        const version = this._activeVersion();
        if (!dashboard || !version) return;

        this._loading.set(true);
        try {
            await firstValueFrom(this.api.createVersion(dashboard.id, version));
        } catch {
            this._error.set('Falha ao salvar versão. Tente novamente.');
        } finally {
            this._loading.set(false);
        }
    }

    private buildLocalVersion(dashboardId: string): DashboardVersion {
        return {
            id: 'v-local',
            dashboardId,
            versionNumber: 1,
            isActive: true,
            widgets: [],
            filters: [],
            createdAt: new Date().toISOString()
        };
    }
}
