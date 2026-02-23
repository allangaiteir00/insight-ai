import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DashboardVersion } from '../../../core/models/dashboard.model';
import { DashboardApiService } from '../../../core/services/dashboard-api.service';
import { WorkspaceStore } from './workspace-store.service';

describe('WorkspaceStore', () => {
    let store: WorkspaceStore;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [WorkspaceStore, DashboardApiService]
        });

        store = TestBed.inject(WorkspaceStore);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should start with viewer mode', () => {
        expect(store.isEditorMode()).toBe(false);
    });

    it('should change to editor mode', () => {
        store.setMode('editor');
        expect(store.isEditorMode()).toBe(true);
    });

    it('should update widget position', () => {
        const mockVersion: DashboardVersion = {
            id: 'v1',
            dashboardId: 'd1',
            versionNumber: 1,
            isActive: true,
            createdAt: '',
            filters: [],
            widgets: [
                { id: 'w1', type: 'chart-bar', config: { title: 'T1', dataUrl: '' }, position: { x: 0, y: 0, w: 2, h: 2 } }
            ]
        };

        (store as any)._activeVersion.set(mockVersion);

        store.updateWidgetPosition('w1', { x: 1, y: 1, w: 3, h: 3 });

        expect(store.widgets()[0].position).toEqual({ x: 1, y: 1, w: 3, h: 3 });
    });

    it('should initialize local version when API is unavailable', async () => {
        // Quando o backend não está disponível, o store inicia em modo local sem propagar erro
        const promise = store.loadDashboard('invalid-id');

        const request = httpMock.expectOne('/api/dashboards/invalid-id/versions');
        request.error(new ErrorEvent('Network error'));

        await promise;

        // Em modo local, o erro é suprimido intencionalmente para manter a UX funcional
        expect(store.errorMessage()).toBeNull();
        expect(store.isLoading()).toBe(false);
        expect(store.widgets()).toEqual([]);
    });

    it('should add a widget to the active version', () => {
        const mockVersion: DashboardVersion = {
            id: 'v1', dashboardId: 'd1', versionNumber: 1, isActive: true,
            createdAt: '', filters: [], widgets: []
        };
        (store as any)._activeVersion.set(mockVersion);

        store.addWidget({ id: 'w-new', type: 'chart-line', config: { title: 'Novo', dataUrl: '' }, position: { x: 0, y: 0, w: 4, h: 4 } });

        expect(store.widgets().length).toBe(1);
        expect(store.widgets()[0].id).toBe('w-new');
    });

    it('should remove a widget by id', () => {
        const mockVersion: DashboardVersion = {
            id: 'v1', dashboardId: 'd1', versionNumber: 1, isActive: true,
            createdAt: '', filters: [],
            widgets: [
                { id: 'w1', type: 'chart-bar', config: { title: 'T1', dataUrl: '' }, position: { x: 0, y: 0, w: 2, h: 2 } }
            ]
        };
        (store as any)._activeVersion.set(mockVersion);

        store.removeWidget('w1');

        expect(store.widgets().length).toBe(0);
    });
});
