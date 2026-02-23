export type BackgroundType = 'solid' | 'gradient' | 'pattern' | 'image';
export type ParticleStyle = 'none' | 'minimal' | 'dots' | 'network' | 'tech' | 'tech2' | 'quantum' | 'scanner' | 'bubbles' | 'snow' | 'fireworks';

export interface ThemeConfig {
    primary: string;
    background: string;
    surface: string;
    surfaceCard: string;
    text: string;
    textSecondary: string;
    radius: number;
    fontFamily?: string;
    backgroundType: BackgroundType;
    name?: string;
    gradientFrom?: string;
    gradientTo?: string;
    patternUrl?: string;
    backgroundImageUrl?: string;

    showParticles: boolean;
    particleStyle: ParticleStyle;
    particleColor?: string;
}
