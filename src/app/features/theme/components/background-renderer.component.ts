import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, input, signal } from '@angular/core';
import { NgxParticlesModule } from '@tsparticles/angular';
import { Engine, IOptions, RecursivePartial } from '@tsparticles/engine';
import { loadSlim } from '@tsparticles/slim';
import { ThemeConfig } from '../../../models/theme.model';

@Component({
  selector: 'app-background-renderer',
  standalone: true,
  imports: [CommonModule, NgxParticlesModule],
  template: `
    <div class="bg-wrapper transition-all duration-1000" 
         [class.fixed]="!embedded()" 
         [class.absolute]="embedded()">

      <!-- Camada 1: Base (Cor ou Gradiente) -->
      <div class="layer layer-base"></div>

      <!-- Camada 2: Media (Imagem) -->
      @if (theme().backgroundType === 'image' && theme().backgroundImageUrl) {
        <div class="layer layer-media"></div>
      }

      <!-- Camada 3: Padrão (Texture Overlay) -->
      @if (theme().backgroundType === 'pattern' && theme().patternUrl) {
        <div class="layer layer-pattern"></div>
      }

      <!-- Camada 4: Efeitos (Partículas Profissionais) -->
      @if (theme().showParticles && refreshing()) {
        <div class="layer layer-effects">
          <ngx-particles
            id="tsparticles"
            [options]="particleOptions()"
            [particlesInit]="particlesInit">
          </ngx-particles>
        </div>
      }
    </div>
  `,
  styles: [`
    .bg-wrapper {
      inset: 0;
      z-index: -10;
      pointer-events: none;
      overflow: hidden;
    }
    .bg-wrapper.fixed { position: fixed; }
    .bg-wrapper.absolute { position: absolute; z-index: 0; }

    .layer {
      position: absolute;
      inset: 0;
      transition: all 0.5s ease-in-out;
    }

    .layer-base {
      z-index: 1;
      background: var(--bg-base);
    }

    .layer-media {
      z-index: 2;
      background-image: var(--bg-media);
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    }

    .layer-pattern {
      z-index: 3;
      background-image: var(--bg-pattern);
      background-size: 200px;
      background-repeat: repeat;
      opacity: 0.5;
    }

    .layer-effects {
      z-index: 4;
      inset: 0;
      opacity: 0.8;
    }

    ngx-particles {
      width: 100%;
      height: 100%;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BackgroundRendererComponent {
  theme = input.required<ThemeConfig>();
  embedded = input<boolean>(false);
  refreshing = signal(true);

  async particlesInit(engine: Engine): Promise<void> {
    await loadSlim(engine);
  }

  particleOptions = computed(() => {
    const color = this.theme().particleColor || this.theme().primary;
    const style = this.theme().particleStyle;

    const baseConfig: RecursivePartial<IOptions> = {
      fullScreen: { enable: false },
      particles: {
        color: { value: color },
        move: { enable: true, speed: 1 },
        number: { value: 50 },
        opacity: { value: 0.5 },
        shape: { type: 'circle' },
        size: { value: { min: 1, max: 3 } }
      },
      interactivity: {
        events: {
          onHover: { enable: true, mode: 'repulse' },
          onClick: { enable: true, mode: 'push' }
        },
        modes: {
          repulse: { distance: 100, duration: 0.4 },
          push: { quantity: 4 }
        }
      },
      background: { color: { value: 'transparent' } }
    };

    if (style === 'network') {
      return {
        ...baseConfig,
        particles: {
          ...baseConfig.particles,
          links: { enable: true, color: color, distance: 150, opacity: 0.4 },
          number: { value: 60 }
        },
        interactivity: {
          ...baseConfig.interactivity,
          events: { ...baseConfig.interactivity?.events, onHover: { enable: true, mode: 'grab' } }
        }
      } as RecursivePartial<IOptions>;
    }

    if (style === 'minimal') {
      return {
        ...baseConfig,
        particles: {
          ...baseConfig.particles,
          shape: { type: 'char', options: { char: { value: ['+', 'x', 'o'], font: 'Verdana' } } },
          number: { value: 40 },
          move: { speed: 0.5 }
        }
      } as RecursivePartial<IOptions>;
    }

    if (style === 'tech') {
      return {
        ...baseConfig,
        particles: {
          ...baseConfig.particles,
          shape: { type: 'square' },
          number: { value: 40 },
          move: { speed: 3, direction: 'bottom' },
          size: { value: 2 }
        }
      } as RecursivePartial<IOptions>;
    }

    if (style === 'tech2') {
      return {
        ...baseConfig,
        particles: {
          ...baseConfig.particles,
          shape: { type: 'char', options: { char: { value: ['0', '1'], font: 'monospace' } } },
          number: { value: 40 },
          move: { speed: 4, direction: 'bottom', straight: true },
          size: { value: 12 }
        }
      } as RecursivePartial<IOptions>;
    }

    if (style === 'bubbles') {
      return {
        ...baseConfig,
        particles: {
          ...baseConfig.particles,
          opacity: { value: { min: 0.1, max: 0.3 } },
          size: { value: { min: 5, max: 15 } },
          move: { speed: 1, direction: 'top' },
          number: { value: 30 }
        }
      } as RecursivePartial<IOptions>;
    }

    if (style === 'snow') {
      return {
        ...baseConfig,
        particles: {
          ...baseConfig.particles,
          opacity: { value: 0.5 },
          size: { value: { min: 1, max: 5 } },
          move: { speed: 1, direction: 'bottom', wobble: { enable: true, distance: 10 } },
          number: { value: 80 }
        }
      } as RecursivePartial<IOptions>;
    }

    if (style === 'fireworks') {
      return {
        ...baseConfig,
        particles: {
          ...baseConfig.particles,
          number: { value: 0 },
          destroy: { mode: 'split', split: { count: 1, factor: { value: 1 / 3 }, rate: { value: { min: 4, max: 9 } } } }
        },
        emitters: {
          direction: 'top',
          life: { count: 0, duration: 0.1, delay: 0.1 },
          rate: { delay: 0.1, quantity: 1 },
          size: { width: 100, height: 0 },
          position: { y: 100, x: 50 }
        }
      } as RecursivePartial<IOptions>;
    }

    if (style === 'quantum') {
      return {
        ...baseConfig,
        particles: {
          ...baseConfig.particles,
          number: { value: 30 },
          move: { speed: 2, direction: 'right', straight: false },
          size: { value: 4 }
        }
      } as RecursivePartial<IOptions>;
    }

    if (style === 'scanner') {
      return {
        ...baseConfig,
        particles: {
          ...baseConfig.particles,
          shape: { type: 'square' },
          number: { value: 10 },
          move: { speed: 5, direction: 'right', straight: true },
          size: { value: { min: 5, max: 50 } }
        }
      } as RecursivePartial<IOptions>;
    }

    return { ...baseConfig };
  });

  constructor() {
    effect(() => {
      // Reagir explicitamente a mudanças de estilo para forçar re-renderização
      const style = this.theme().particleStyle;
      const color = this.theme().particleColor || this.theme().primary;

      this.refreshing.set(false);
      setTimeout(() => this.refreshing.set(true), 10);
    });
  }
}
