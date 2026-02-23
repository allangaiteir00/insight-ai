import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Workspace, WorkspaceVersion } from '../models/workspace.model';

@Injectable({ providedIn: 'root' })
export class WorkspaceApiService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = '/api/workspaces';

    getWorkspaces(): Observable<Workspace[]> {
        return this.http.get<Workspace[]>(this.apiUrl);
    }

    getVersions(dashboardId: string): Observable<WorkspaceVersion[]> {
        return this.http.get<WorkspaceVersion[]>(`${this.apiUrl}/${dashboardId}/versions`);
    }

    createVersion(dashboardId: string, version: Partial<WorkspaceVersion>): Observable<WorkspaceVersion> {
        return this.http.post<WorkspaceVersion>(`${this.apiUrl}/${dashboardId}/versions`, version);
    }

    publishVersion(dashboardId: string, versionId: string): Observable<Workspace> {
        return this.http.put<Workspace>(`${this.apiUrl}/${dashboardId}/publish/${versionId}`, {});
    }

    getWidgetData(url: string, filters: any): Observable<any> {
        // Mock data for demo/validation
        if (url.includes('/v1/projects')) {
            return new Observable(subscriber => {
                subscriber.next([
                    { id: 'p1', name: 'Reforma Sede Alpha', start_date: '2026-02-01', end_date: '2026-03-15', lat: -23.5505, lng: -46.6333, status: 'active' },
                    { id: 'p2', name: 'Deploy Cloud Infra', start_date: '2026-02-15', end_date: '2026-04-20', lat: 40.7128, lng: -74.0060, status: 'planned' },
                    { id: 'p3', name: 'Migração Database', start_date: '2026-01-10', end_date: '2026-02-28', lat: 48.8566, lng: 2.3522, status: 'active' }
                ]);
                subscriber.complete();
            });
        }

        if (url.includes('/v1/tasks')) {
            return new Observable(subscriber => {
                subscriber.next([
                    { id: 't1', title: 'Fundação', status: 'done', dueDate: '2026-02-05', customerId: 'c1' },
                    { id: 't2', title: 'Paredes', status: 'doing', dueDate: '2026-02-15', customerId: 'c1' },
                    { id: 't3', title: 'Elétrica', status: 'todo', dueDate: '2026-03-01', customerId: 'c2' }
                ]);
                subscriber.complete();
            });
        }

        return this.http.get<any>(url, { params: filters });
    }
}
