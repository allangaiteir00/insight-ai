import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideConstruction } from '@ng-icons/lucide';

@Component({
    selector: 'app-coming-soon',
    standalone: true,
    imports: [CommonModule, NgIconComponent],
    providers: [provideIcons({ lucideConstruction })],
    template: `
    <div class="placeholder-container">
      <div class="content-box">
        <div class="icon-pulse">
          <ng-icon name="lucideConstruction" />
        </div>
        <h1>Funcionalidade em Desenvolvimento</h1>
        <p>A seção <strong>{{ pageTitle }}</strong> está sendo construída com todo carinho pela nossa equipe de engenharia.</p>
        
        <div class="status-badge">
          <span class="dot"></span>
          Prioridade: Alta
        </div>
      </div>
    </div>
  `,
    styles: [`
    .placeholder-container {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--color-surface);
      padding: 40px;
    }

    .content-box {
      text-align: center;
      max-width: 450px;
      padding: 60px 40px;
      background: var(--color-surface-card);
      border: 1px solid var(--color-border);
      border-radius: 24px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.03);
    }

    .icon-pulse {
      width: 80px;
      height: 80px;
      background: var(--color-primary-50);
      color: var(--color-primary-600);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 40px;
      margin: 0 auto 32px;
      animation: pulse 2s infinite ease-in-out;
    }

    h1 {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--color-text-primary);
      margin-bottom: 16px;
      letter-spacing: -0.02em;
    }

    p {
      color: var(--color-text-secondary);
      line-height: 1.6;
      margin-bottom: 32px;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 16px;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: 100px;
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .dot {
      width: 6px;
      height: 6px;
      background: #fbbf24;
      border-radius: 50%;
      box-shadow: 0 0 8px #fbbf24;
    }

    @keyframes pulse {
      0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.2); }
      70% { transform: scale(1.05); box-shadow: 0 0 0 20px rgba(59, 130, 246, 0); }
      100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
    }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComingSoonComponent {
    private route = inject(ActivatedRoute);

    get pageTitle(): string {
        const path = this.route.snapshot.url[0]?.path || 'Funcionalidade';
        return path.charAt(0).toUpperCase() + path.slice(1);
    }
}
