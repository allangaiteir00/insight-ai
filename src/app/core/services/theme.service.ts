import { effect, Injectable, signal } from '@angular/core';
import { ThemeConfig } from '../../models/theme.model';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private readonly STORAGE_KEY = 'theme-config';

    private defaultTheme: ThemeConfig = {
        primary: '#3b82f6',
        background: '#ffffff',
        surface: '#f3f4f6',
        surfaceCard: '#ffffff',
        text: '#111827',
        textSecondary: '#6b7280',
        radius: 8,
        fontFamily: "'Inter', sans-serif",
        backgroundType: 'solid',
        showParticles: false,
        particleStyle: 'none'
    };

    private theme = signal<ThemeConfig>(this.loadTheme());
    currentTheme = this.theme.asReadonly();

    constructor() {
        // Efeito para aplicar o tema sempre que o signal mudar
        effect(() => {
            this.applyTheme(this.theme());
        });
    }

    setTheme(config: ThemeConfig) {
        this.theme.set(config);
    }

    updateTheme(config: Partial<ThemeConfig>) {
        this.theme.update(current => ({ ...current, ...config }));
        this.saveTheme(this.theme());
    }

    private applyTheme(theme: ThemeConfig) {
        const root = document.documentElement;

        // Aplicar variáveis CSS fundamentais
        root.style.setProperty('--color-primary', theme.primary);
        root.style.setProperty('--color-background', theme.background);
        root.style.setProperty('--color-surface', theme.surface);
        root.style.setProperty('--color-surface-card', theme.surfaceCard || theme.surface);
        root.style.setProperty('--color-text-primary', theme.text);
        root.style.setProperty('--color-text-secondary', theme.textSecondary || 'rgba(0,0,0,0.6)');
        root.style.setProperty('--radius', `${theme.radius}px`);
        root.style.setProperty('--font-family', theme.fontFamily || "'Inter', sans-serif");

        // Borda dinâmica: sutil, baseada no contraste do texto
        const borderColor = `color-mix(in srgb, ${theme.text} 10%, transparent)`;
        root.style.setProperty('--color-border', borderColor);

        // Gerar Tons de Cor Primária (50-900) dinamicamente para compatibilidade
        this.generateColorShades(theme.primary, root);

        // Flag para layouts saberem se devem ficar transparentes
        const isSpecialBg = theme.backgroundType !== 'solid' || theme.showParticles;
        root.style.setProperty('--is-custom-bg', isSpecialBg ? '1' : '0');

        // Suporte a Partículas
        root.style.setProperty('--show-particles', theme.showParticles ? '1' : '0');
        root.style.setProperty('--particle-color', theme.particleColor || theme.primary);
        root.style.setProperty('--particle-style', theme.particleStyle || 'none');

        // Layered Rendering System (Base, Media, Pattern)
        // 1. Base (Cor ou Gradiente) - Ativo para solid, gradient e pattern (para permitir mesclagem)
        const isBaseActive = theme.backgroundType === 'solid' ||
            theme.backgroundType === 'gradient' ||
            theme.backgroundType === 'pattern';

        const bgBase = isBaseActive
            ? (theme.backgroundType === 'gradient'
                ? (theme.backgroundImageUrl?.includes('gradient')
                    ? theme.backgroundImageUrl
                    : `linear-gradient(135deg, ${theme.gradientFrom || theme.background}, ${theme.gradientTo || theme.primary})`)
                : theme.background)
            : 'none';
        root.style.setProperty('--bg-base', bgBase);

        // 2. Imagem (Media Layer) - Estritamente exclusivo
        const bgMedia = (theme.backgroundType === 'image' && theme.backgroundImageUrl)
            ? `url("${theme.backgroundImageUrl}")`
            : 'none';
        root.style.setProperty('--bg-media', bgMedia);

        // 3. Padrão (Pattern Layer) - Injeção Dinâmica usando Primary Color
        let bgPattern = 'none';
        if (theme.backgroundType === 'pattern' && theme.patternUrl) {
            if (theme.patternUrl.startsWith('data:image/svg+xml')) {
                // Injetar a Cor Primária no Pattern para criar o "Two-Color" look (BG + Primary)
                const pColor = theme.primary || '#ffffff';
                const encodedColor = encodeURIComponent(pColor);
                bgPattern = `url("${theme.patternUrl.replace(/fill='%23[0-9a-fA-F]+'/g, `fill='${encodedColor}'`).replace(/stroke='%23[0-9a-fA-F]+'/g, `stroke='${encodedColor}'`)}")`;
            } else {
                bgPattern = `url("${theme.patternUrl}")`;
            }
        }
        root.style.setProperty('--bg-pattern', bgPattern);

        // Compatibilidade e Fallback Dinâmico
        let bgDynamic = 'none';
        if (theme.backgroundType === 'image') bgDynamic = bgMedia;
        else if (theme.backgroundType === 'pattern') bgDynamic = bgPattern;
        else bgDynamic = bgBase;

        root.style.setProperty('--bg-dynamic', bgDynamic);

        // Injetar variáveis de Glassmorphism baseadas no estado
        const glassOpacity = isSpecialBg ? '0.7' : '1';
        const glassBlur = isSpecialBg ? '12px' : '0px';
        const glassBg = isSpecialBg
            ? `color-mix(in srgb, ${theme.surfaceCard || theme.surface} 70%, transparent)`
            : (theme.surfaceCard || theme.surface);

        root.style.setProperty('--glass-bg', glassBg);
        root.style.setProperty('--glass-blur', glassBlur);
        root.style.setProperty('--glass-opacity', glassOpacity);
    }

    private generateColorShades(primaryColor: string, root: HTMLElement) {
        // Mapeamento de tons usando color-mix (moderno, sem dependências)
        const shades = [
            { level: 50, mix: 95, base: 'white' },
            { level: 100, mix: 90, base: 'white' },
            { level: 200, mix: 75, base: 'white' },
            { level: 300, mix: 50, base: 'white' },
            { level: 400, mix: 25, base: 'white' },
            { level: 500, mix: 0, base: 'white' }, // 500 é a cor base
            { level: 600, mix: 10, base: 'black' },
            { level: 700, mix: 25, base: 'black' },
            { level: 800, mix: 50, base: 'black' },
            { level: 900, mix: 75, base: 'black' },
        ];

        shades.forEach(shade => {
            const value = shade.mix === 0
                ? primaryColor
                : `color-mix(in srgb, ${primaryColor}, ${shade.base} ${shade.mix}%)`;
            root.style.setProperty(`--color-primary-${shade.level}`, value);
        });

        // Garantir variável legacy para facilidade de transição
        root.style.setProperty('--palette-accent', primaryColor);
    }

    async saveTheme(theme: ThemeConfig) {
        // Simular um delay para o feedback visual de 'Salvando...' no componente
        return new Promise<void>(resolve => {
            setTimeout(() => {
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(theme));
                resolve();
            }, 800);
        });
    }

    private loadTheme(): ThemeConfig {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        if (!saved) return this.defaultTheme;

        try {
            const config = JSON.parse(saved);
            return config;
        } catch {
            return this.defaultTheme;
        }
    }
}
