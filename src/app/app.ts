import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './core/services/theme.service';
import { BackgroundRendererComponent } from './features/theme/components/background-renderer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BackgroundRendererComponent],
  template: `
    <app-background-renderer [theme]="themeService.currentTheme()" />
    <router-outlet />
  `,
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('insight-ai');
  protected readonly themeService = inject(ThemeService);
}
