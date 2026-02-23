import { ThemeConfig } from './theme.model';

export const THEME_PRESETS: { name: string, config: ThemeConfig, preview: string }[] = [
    {
        name: 'Modern Indigo',
        preview: 'bg-[#6366f1]',
        config: {
            primary: '#6366f1',
            background: '#f8fafc',
            surface: '#ffffff',
            surfaceCard: '#ffffff',
            text: '#0f172a',
            textSecondary: '#64748b',
            radius: 12,
            fontFamily: "'Inter', sans-serif",
            backgroundType: 'solid',
            showParticles: false,
            particleStyle: 'none'
        }
    },
    {
        name: 'Cyberpunk Drive',
        preview: 'bg-[url("https://images.unsplash.com/photo-1605142859862-978be7eba909?auto=format&fit=crop&q=80&w=200")]',
        config: {
            primary: '#f0abfc',
            background: '#0a0a0c',
            surface: 'rgba(20, 20, 25, 0.7)',
            surfaceCard: 'rgba(30, 30, 35, 0.8)',
            text: '#fdf4ff',
            textSecondary: '#d8b4fe',
            radius: 10,
            fontFamily: "'Outfit', sans-serif",
            backgroundType: 'image',
            backgroundImageUrl: 'https://images.unsplash.com/photo-1605142859862-978be7eba909?auto=format&fit=crop&q=80&w=2000',
            showParticles: true,
            particleStyle: 'network',
            particleColor: '#f0abfc'
        }
    },
    {
        name: 'Midnight Glass',
        preview: 'bg-[#0f172a]',
        config: {
            primary: '#38bdf8',
            background: '#0f172a',
            surface: '#1e293b',
            surfaceCard: '#1e293b',
            text: '#f8fafc',
            textSecondary: '#94a3b8',
            radius: 8,
            fontFamily: "'Inter', sans-serif",
            backgroundType: 'gradient',
            gradientFrom: '#0f172a',
            gradientTo: '#1e293b',
            showParticles: false,
            particleStyle: 'none'
        }
    },
    {
        name: 'Frosty Nature',
        preview: 'bg-[url("https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=200")]',
        config: {
            primary: '#2dd4bf',
            background: '#f0fdfa',
            surface: 'rgba(255, 255, 255, 0.6)',
            surfaceCard: 'rgba(255, 255, 255, 0.8)',
            text: '#134e4a',
            textSecondary: '#5eead4',
            radius: 20,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            backgroundType: 'image',
            backgroundImageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000',
            showParticles: true,
            particleStyle: 'dots'
        }
    },
    {
        name: 'Cosmic Tech',
        preview: 'bg-[#000000]',
        config: {
            primary: '#f43f5e',
            background: '#000000',
            surface: '#111111',
            surfaceCard: '#111111',
            text: '#ffffff',
            textSecondary: '#fda4af',
            radius: 20,
            fontFamily: "'JetBrains Mono', monospace",
            backgroundType: 'solid',
            showParticles: true,
            particleStyle: 'tech',
            particleColor: '#f43f5e'
        }
    },
    {
        name: 'Emerald Elegance',
        preview: 'bg-gradient-to-br from-[#064e3b] to-[#022c22]',
        config: {
            primary: '#10b981',
            background: '#022c22',
            surface: 'rgba(6, 78, 59, 0.4)',
            surfaceCard: 'rgba(6, 78, 59, 0.5)',
            text: '#ecfdf5',
            textSecondary: '#6ee7b7',
            radius: 16,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            backgroundType: 'gradient',
            gradientFrom: '#064e3b',
            gradientTo: '#022c22',
            showParticles: false,
            particleStyle: 'none'
        }
    },
    {
        name: 'Minimal Slate',
        preview: 'bg-[#f1f5f9]',
        config: {
            primary: '#475569',
            background: '#f1f5f9',
            surface: '#ffffff',
            surfaceCard: '#ffffff',
            text: '#0f172a',
            textSecondary: '#64748b',
            radius: 4,
            fontFamily: "'Inter', sans-serif",
            backgroundType: 'pattern',
            patternUrl: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cpath d='M0 0h40v40H0V0zm1 1h38v38H1V1z' fill='%23ffffff' fill-opacity='0.4'/%3E%3C/svg%3E`,
            showParticles: false,
            particleStyle: 'none'
        }
    },
    {
        name: 'Royal Nebula',
        preview: 'bg-[url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=200")]',
        config: {
            primary: '#818cf8',
            background: '#0f0c29',
            surface: 'rgba(30, 41, 59, 0.6)',
            surfaceCard: 'rgba(30, 41, 59, 0.7)',
            text: '#f8fafc',
            textSecondary: '#c7d2fe',
            radius: 12,
            fontFamily: "'Outfit', sans-serif",
            backgroundType: 'image',
            backgroundImageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000',
            showParticles: true,
            particleStyle: 'network',
            particleColor: '#818cf8'
        }
    },
    {
        name: 'Crimson Flow',
        preview: 'bg-gradient-to-br from-[#450a0a] to-[#7f1d1d]',
        config: {
            primary: '#f87171',
            background: '#450a0a',
            surface: 'rgba(127, 29, 29, 0.3)',
            surfaceCard: 'rgba(127, 29, 29, 0.4)',
            text: '#fef2f2',
            textSecondary: '#fca5a5',
            radius: 24,
            fontFamily: "'Inter', sans-serif",
            backgroundType: 'gradient',
            gradientFrom: '#7f1d1d',
            gradientTo: '#450a0a',
            showParticles: true,
            particleStyle: 'minimal'
        }
    },
    {
        name: 'Zen Porcelain',
        preview: 'bg-[#ffffff]',
        config: {
            primary: '#14b8a6',
            background: '#ffffff',
            surface: '#f9fafb',
            surfaceCard: '#ffffff',
            text: '#111827',
            textSecondary: '#6b7280',
            radius: 0,
            fontFamily: "'Inter', sans-serif",
            backgroundType: 'solid',
            showParticles: false,
            particleStyle: 'none'
        }
    }
];
