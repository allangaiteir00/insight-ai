import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WorkspaceStore } from '../../../../features/workspace/services/workspace-store.service';
import { ThemeService } from '../../../services/theme.service';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-layout-main',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent],
  template: `
    <div class="layout-container" [attr.data-theme]="themeService.currentTheme().background === '#ffffff' ? 'light' : 'dark'">
      <app-sidebar></app-sidebar>
      <main class="content-area">
        <div class="content-container">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .layout-container {
      display: flex;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      background: color-mix(in srgb, var(--color-surface) calc((1 - var(--is-custom-bg)) * 100%), transparent);
    }

    .content-area {
      flex: 1;
      height: 100%;
      overflow-y: auto;
      position: relative;
      background: color-mix(in srgb, var(--color-surface) calc((1 - var(--is-custom-bg)) * 100%), transparent);
    }

    .content-container {
      padding: 30px;
      min-height: 100%;
      max-width: 1600px;
      margin: 0 auto;
    }

    /* Custom Scrollbar for the main content */
    .content-area::-webkit-scrollbar {
      width: 6px;
    }
    .content-area::-webkit-scrollbar-track {
      background: transparent;
    }
    .content-area::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 10px;
    }
    .content-area::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutMainComponent {
  protected readonly store = inject(WorkspaceStore);
  protected readonly themeService = inject(ThemeService);
}
