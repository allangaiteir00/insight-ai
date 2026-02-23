import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  lucideChevronLeft,
  lucideChevronRight,
  lucideDatabase,
  lucideLayoutDashboard,
  lucidePalette,
  lucideSettings,
  lucideUsers
} from '@ng-icons/lucide';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, NgIconComponent],
  providers: [provideIcons({
    lucideLayoutDashboard,
    lucideUsers,
    lucideDatabase,
    lucideSettings,
    lucideChevronLeft,
    lucideChevronRight,
    lucidePalette
  })],
  template: `
    <aside class="sidebar" [class.collapsed]="isCollapsed">
      <div class="logo-container">
        <div class="logo">
          <div class="logo-icon">IA</div>
          @if (!isCollapsed) { <span class="logo-text">Insight AI</span> }
        </div>
      </div>

      <nav class="nav-sections">
        <div class="nav-group">
          @if (!isCollapsed) { <label>Principal</label> }
          <a routerLink="/workspace" routerLinkActive="active" class="nav-item">
            <ng-icon name="lucideLayoutDashboard" />
            @if (!isCollapsed) { <span>Workspace</span> }
          </a>
          <a routerLink="/entities" routerLinkActive="active" class="nav-item">
            <ng-icon name="lucideDatabase" />
            @if (!isCollapsed) { <span>Entidades</span> }
          </a>
        </div>

        <div class="nav-group">
          @if (!isCollapsed) { <label>Sistema</label> }
          <a routerLink="/users" routerLinkActive="active" class="nav-item">
            <ng-icon name="lucideUsers" />
            @if (!isCollapsed) { <span>Usuários</span> }
          </a>
          <a routerLink="/settings/theme" routerLinkActive="active" class="nav-item">
            <ng-icon name="lucidePalette" />
            @if (!isCollapsed) { <span>Temas</span> }
          </a>
        </div>
      </nav>

      <button class="collapse-btn" (click)="isCollapsed = !isCollapsed">
        <ng-icon [name]="isCollapsed ? 'lucideChevronRight' : 'lucideChevronLeft'" />
      </button>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 260px;
      height: 100vh;
      background: var(--color-surface-card);
      border-right: 1px solid var(--color-border);
      display: flex;
      flex-direction: column;
      position: relative;
      transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 50;
    }

    .sidebar.collapsed {
      width: 80px;
    }

    .logo-container {
      padding: 24px;
      margin-bottom: 24px;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo-icon {
      width: 38px;
      height: 38px;
      background: var(--color-primary-600);
      color: white;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 1.1rem;
      flex-shrink: 0;
    }

    .logo-text {
      font-size: 1.2rem;
      font-weight: 800;
      color: var(--color-text-primary);
      letter-spacing: -0.02em;
    }

    .nav-sections {
      flex: 1;
      padding: 0 16px;
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    .nav-group {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .nav-group label {
      font-size: 0.65rem;
      font-weight: 800;
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      padding-left: 12px;
      margin-bottom: 8px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      color: var(--color-text-secondary);
      text-decoration: none;
      border-radius: 10px;
      font-size: 0.9rem;
      font-weight: 600;
      transition: all 0.2s;
    }

    .nav-item ng-icon {
      font-size: 20px;
      transition: transform 0.2s;
    }

    .nav-item:hover {
      background: var(--color-surface);
      color: var(--color-text-primary);
    }

    .nav-item:hover ng-icon {
      transform: translateX(2px);
    }

    .nav-item.active {
      background: var(--color-primary-50);
      color: var(--color-primary-700);
    }

    .nav-item.active ng-icon {
      color: var(--color-primary-600);
    }

    .collapse-btn {
      position: absolute;
      bottom: 24px;
      right: -16px;
      width: 32px;
      height: 32px;
      background: var(--color-surface-card);
      border: 1px solid var(--color-border);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: var(--color-text-secondary);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      transition: all 0.2s;
    }

    .collapse-btn:hover {
      background: var(--color-primary-600);
      color: white;
      border-color: var(--color-primary-600);
      transform: scale(1.1);
    }

    .collapsed .nav-item {
      justify-content: center;
      padding: 14px 0;
    }

    .collapsed .nav-item ng-icon {
      font-size: 22px;
    }

    .collapsed .nav-group label {
      display: none;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {
  isCollapsed = false;
}
