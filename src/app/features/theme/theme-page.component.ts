import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCheckCircle2,
  lucideChevronRight,
  lucideCircleDot,
  lucideImage as lucideImageIcon,
  lucideLanguages,
  lucideLayers,
  lucideLayout,
  lucideMonitor,
  lucideMoon,
  lucidePalette as lucidePaletteIcon,
  lucidePlus,
  lucideSave,
  lucideSmartphone,
  lucideSparkles,
  lucideSun
} from '@ng-icons/lucide';
import { ThemeService } from '../../core/services/theme.service';
import { THEME_PRESETS } from '../../models/theme-presets.const';
import { GRADIENT_RESOURCES, IMAGE_RESOURCES, PARTICLE_RESOURCES, PATTERN_RESOURCES } from '../../models/theme-resources.const';
import { ThemeConfig } from '../../models/theme.model';
import { GalleryItem, ThemeGalleryComponent } from './components/theme-gallery.component';

@Component({
  selector: 'app-theme-page',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIcon, ThemeGalleryComponent],
  providers: [provideIcons({
    lucidePalette: lucidePaletteIcon,
    lucideLayout,
    lucideLayers,
    lucideCircleDot,
    lucideSave,
    lucidePlus,
    lucideSparkles,
    lucideCheckCircle2,
    lucideImageIcon,
    lucideMonitor,
    lucideSmartphone,
    lucideChevronRight,
    lucideSun,
    lucideMoon,
    lucideType: lucideLanguages
  })],
  templateUrl: './theme-page.component.html',
  styleUrls: ['./theme-page.component.scss']
})
export class ThemePageComponent {
  private themeService = inject(ThemeService);

  theme = signal<ThemeConfig>(this.themeService.currentTheme());
  presets = THEME_PRESETS;
  saving = signal(false);
  saved = signal(false);

  imageGallery = IMAGE_RESOURCES;
  patternGallery = PATTERN_RESOURCES;
  private readonly baseGradients = GRADIENT_RESOURCES;

  get gradientGallery(): GalleryItem[] {
    const t = this.theme();
    const from = t.gradientFrom || t.primary || '#6366f1';
    const to = t.gradientTo || t.background || '#09090b';
    return [
      { id: 'custom', type: 'gradient', label: 'Custom', url: `linear-gradient(135deg, ${from}, ${to})` },
      ...this.baseGradients,
    ];
  }

  particleGallery = PARTICLE_RESOURCES;

  fontGallery: GalleryItem[] = [
    { id: "'Inter', sans-serif", type: 'font', label: 'Inter' },
    { id: "'Outfit', sans-serif", type: 'font', label: 'Outfit' },
    { id: "'JetBrains Mono', monospace", type: 'font', label: 'JetBrains Mono' },
    { id: "'Playfair Display', serif", type: 'font', label: 'Playfair Display' },
    { id: "'Plus Jakarta Sans', sans-serif", type: 'font', label: 'Plus Jakarta Sans' }
  ];

  onSelect(item: GalleryItem) {
    let baseUpdate: Partial<ThemeConfig> = {};

    // Smart Base Resolver - Nível 2
    // Agora mantemos as cores atuais do tema (Fundo/Superfície/Texto) ao selecionar mídias
    // a menos que o usuário explicitamente altere pelo seletor ou preset.

    if (item.type === 'image') {
      this.updateProps({
        ...baseUpdate,
        backgroundType: 'image',
        backgroundImageUrl: item.url,
        patternUrl: undefined,
        gradientFrom: undefined,
        gradientTo: undefined,
        name: undefined
      });
    } else if (item.type === 'pattern') {
      this.updateProps({
        ...baseUpdate,
        backgroundType: 'pattern',
        patternUrl: item.url,
        backgroundImageUrl: undefined,
        gradientFrom: undefined,
        gradientTo: undefined,
        name: undefined
      });
    } else if (item.type === 'gradient') {
      const gradientProps: Partial<ThemeConfig> = {
        backgroundType: 'gradient',
        backgroundImageUrl: item.id === 'custom' ? undefined : item.url, // Persistir URL complexa se não for custom
        patternUrl: undefined,
        name: undefined
      };

      if (item.id === 'custom') {
        const t = this.theme();
        gradientProps.gradientFrom = t.gradientFrom || t.primary || '#6366f1';
        gradientProps.gradientTo = t.gradientTo || t.background || '#09090b';
      } else {
        const hexes = item.url?.match(/#[0-9a-fA-F]+/g) || [];
        if (hexes.length >= 2) {
          gradientProps.gradientFrom = hexes[0];
          gradientProps.gradientTo = hexes[hexes.length - 1];
        }
      }
      this.updateProps({ ...baseUpdate, ...gradientProps });
    } else if (item.type === 'font') {
      this.update('fontFamily', item.id);
    }
  }


  update(key: keyof ThemeConfig, value: any) {
    const config = { ...this.theme(), [key]: value, name: undefined };
    this.theme.set(config);
    this.themeService.setTheme(config);
    this.saved.set(false);
  }

  updateProps(props: Partial<ThemeConfig>) {
    const config = { ...this.theme(), ...props };
    this.theme.set(config);
    this.themeService.setTheme(config);
    this.saved.set(false);
  }

  applyPreset(preset: any) {
    // Make sure we strip any temporary gallery selections when applying a preset completely
    const config = { ...preset.config, name: preset.name };
    this.theme.set(config);
    this.themeService.setTheme(config);
    this.saved.set(false);
  }

  currentId(type: string): string {
    const t = this.theme();
    if (t.backgroundType !== type) return '';

    // Helper to safely compare URLs ignoring query parameters (like w=800 vs w=2000)
    const matchUrl = (source: string | undefined, target: string | undefined) => {
      if (!source || !target) return false;
      return source.split('?')[0] === target.split('?')[0];
    };

    if (type === 'image') return this.imageGallery.find(i => matchUrl(i.url, t.backgroundImageUrl))?.id || '';
    if (type === 'pattern') return this.patternGallery.find(i => matchUrl(i.url, t.patternUrl))?.id || '';
    if (type === 'gradient') {
      const match = this.baseGradients.find(i => {
        const hexes = i.url?.match(/#[0-9a-fA-F]+/g) || [];
        return hexes[0] === t.gradientFrom && hexes[hexes.length - 1] === t.gradientTo;
      });
      return match?.id ?? (t.backgroundType === 'gradient' ? 'custom' : '');
    }
    return '';
  }

  getValidHex(color: string | undefined): string {
    if (!color) return '#000000';
    if (/^#[0-9A-F]{3}$/i.test(color)) {
      return '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
    }
    if (/^#[0-9A-F]{6}$/i.test(color)) {
      return color;
    }
    return '#000000'; // Fallback if invalid format or rgba is passed
  }

  async save() {
    this.saving.set(true);
    await this.themeService.saveTheme(this.theme());
    this.saving.set(false);
    this.saved.set(true);
    setTimeout(() => this.saved.set(false), 3000);
  }
}
