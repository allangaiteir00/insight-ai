import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  lucideChevronLeft,
  lucideChevronRight,
  lucideDatabase,
  lucideLayoutDashboard,
  lucidePalette,
  lucideProjector,
  lucideSettings
} from '@ng-icons/lucide';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, NgIconComponent],
  providers: [provideIcons({
    lucideLayoutDashboard,
    lucideDatabase,
    lucideSettings,
    lucideChevronLeft,
    lucideChevronRight,
    lucideProjector,
    lucidePalette
  })],
  template: `
    <aside class="sidebar" [class.mini]="isMini()">
      <div class="sidebar-header">
        <div class="logo-container">
          <div class="logo-icon">IA</div>
          @if (!isMini()) {
            <span class="logo-text">Insight<span>AI</span></span>
          }
        </div>
      </div>

      <nav class="sidebar-nav">
        <a routerLink="/workspace/demo" routerLinkActive="active" class="nav-item">
          <ng-icon name="lucideLayoutDashboard" size="20"></ng-icon>
          @if (!isMini()) {
            <span>Workspace</span>
          }
          @else {
            <div class="tooltip">Workspace</div>
          }
        </a>

        <a routerLink="/entities" routerLinkActive="active" class="nav-item">
          <ng-icon name="lucideDatabase" size="20"></ng-icon>
          @if (!isMini()) {
            <span>Entidades</span>
          }
          @else {
            <div class="tooltip">Entidades</div>
          }
        </a>

        <div class="nav-spacer"></div>

        <a routerLink="/settings" routerLinkActive="active" class="nav-item">
          <ng-icon name="lucideSettings" size="20"></ng-icon>
          @if (!isMini()) {
            <span>Configurações</span>
          }
          @else {
            <div class="tooltip">Configurações</div>
          }
        </a>

        <a routerLink="/settings/theme" routerLinkActive="active" class="nav-item sub-item">
          <ng-icon name="lucidePalette" size="18"></ng-icon>
          @if (!isMini()) {
            <span>Temas</span>
          }
          @else {
            <div class="tooltip">Temas</div>
          }
        </a>
      </nav>

      <div class="sidebar-footer">
        <button class="toggle-btn" (click)="toggleMini()">
          <ng-icon [name]="isMini() ? 'lucideChevronRight' : 'lucideChevronLeft'" size="18"></ng-icon>
        </button>
      </div>
    </aside>
  `,
  styles: [`
    :host { 
      display: block; 
      height: 100%;
      --sidebar-width: 260px;
      --sidebar-mini-width: 80px;
      --sidebar-bg: var(--color-surface-card);
      --sidebar-accent: var(--color-primary, #6366f1);
      --transition-speed: 0.3s;
    }

    .sidebar {
      width: var(--sidebar-width);
      height: 100vh;
      background: color-mix(in srgb, var(--sidebar-bg) 85%, transparent);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-right: 1px solid var(--color-border);
      display: flex;
      flex-direction: column;
      transition: width var(--transition-speed) cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      z-index: 100;
    }

    .sidebar.mini {
      width: var(--sidebar-mini-width);
    }

    .sidebar-header {
      padding: 30px 20px;
      display: flex;
      align-items: center;
    }

    .logo-container {
      display: flex;
      align-items: center;
      gap: 12px;
      overflow: hidden;
    }

    .logo-icon {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, var(--sidebar-accent), var(--color-primary-400));
      border-radius: calc(var(--radius) * 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      font-weight: 900;
      font-size: 1.2rem;
      flex-shrink: 0;
      box-shadow: 0 8px 16px color-mix(in srgb, var(--sidebar-accent) 30%, transparent);
    }

    .logo-text {
      font-size: 1.2rem;
      font-weight: 800;
      color: var(--color-text-primary);
      letter-spacing: -0.02em;
      white-space: nowrap;
    }

    .logo-text span { color: var(--sidebar-accent); }

    .sidebar-nav {
      flex: 1;
      padding: 10px 14px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 12px;
      border-radius: var(--radius);
      color: var(--color-text-secondary);
      text-decoration: none;
      transition: all 0.2s;
      white-space: nowrap;
      position: relative;
      border: 1px solid transparent;
    }

    .nav-item:hover {
      background: var(--color-surface);
      color: var(--color-text-primary);
    }

    .nav-item.active {
      background: color-mix(in srgb, var(--sidebar-accent) 10%, transparent);
      color: var(--color-text-primary);
      border-color: color-mix(in srgb, var(--sidebar-accent) 20%, transparent);
    }

    .nav-item.active ng-icon {
      color: var(--sidebar-accent);
      filter: drop-shadow(0 0 8px color-mix(in srgb, var(--sidebar-accent) 50%, transparent));
    }

    .sub-item {
      margin-left: 12px;
      opacity: 0.8;
      font-size: 0.85rem;
    }

    .sidebar.mini .sub-item {
      margin-left: 0;
    }

    .nav-item span {
      font-size: 0.95rem;
      font-weight: 600;
      letter-spacing: 0.01em;
    }

    .nav-spacer { flex: 1; }

    .sidebar-footer {
      padding: 20px;
      border-top: 1px solid var(--color-border);
      display: flex;
      justify-content: center;
    }

    .toggle-btn {
      width: 36px;
      height: 36px;
      border-radius: calc(var(--radius) * 0.8);
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      color: var(--color-text-secondary);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .toggle-btn:hover {
      background: var(--color-border);
      color: var(--color-text-primary);
      transform: scale(1.05);
    }

    /* Tooltip logic for mini mode */
    .tooltip {
      position: absolute;
      left: calc(100% + 15px);
      background: var(--color-surface-card);
      color: var(--color-text-primary);
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 700;
      opacity: 0;
      visibility: hidden;
      transition: all 0.2s;
      white-space: nowrap;
      pointer-events: none;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      border: 1px solid var(--color-border);
    }

    .nav-item:hover .tooltip {
      opacity: 1;
      visibility: visible;
      left: calc(100% + 10px);
    }

    @media (max-width: 768px) {
      :host {
        --sidebar-mini-width: 0px; /* Hide sidebar on mobile by default */
      }
      .sidebar {
        position: fixed;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {
  protected readonly isMini = signal(false);

  protected toggleMini(): void {
    this.isMini.update(v => !v);
  }
}
