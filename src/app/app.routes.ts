import { Routes } from '@angular/router';
import { LayoutMainComponent } from './core/layout/components/layout-main/layout-main.component';

export const routes: Routes = [
    {
        path: '',
        component: LayoutMainComponent,
        children: [
            { path: '', redirectTo: 'workspace/demo', pathMatch: 'full' },
            {
                path: 'workspace/:workspaceId',
                loadComponent: () => import('./features/workspace/workspace-container.component').then(m => m.WorkspaceContainerComponent)
            },
            {
                path: 'entities',
                loadComponent: () => import('./features/entity-management/entity-management.component').then(m => m.EntityManagementComponent)
            },
            {
                path: 'settings/theme',
                loadComponent: () => import('./features/theme/theme-page.component').then(m => m.ThemePageComponent)
            }
        ]
    }
];
