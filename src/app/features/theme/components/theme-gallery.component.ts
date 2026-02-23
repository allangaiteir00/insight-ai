import { CommonModule, NgOptimizedImage, provideImgixLoader } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, inject } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
    lucideCheckCircle2,
    lucideChevronLeft,
    lucideChevronRight,
    lucideCircleDot,
    lucideImage,
    lucideLayers,
    lucideLayout,
    lucidePlus,
    lucideSparkles
} from '@ng-icons/lucide';

export interface GalleryItem {
    id: string;
    type: 'image' | 'gradient' | 'pattern' | 'color' | 'particle' | 'font';
    label: string;
    url?: string;
    value?: any;
    icon?: string;
}

@Component({
    selector: 'app-theme-gallery',
    standalone: true,
    imports: [CommonModule, NgIcon, NgOptimizedImage],
    providers: [
        provideImgixLoader('https://images.unsplash.com/'),
        provideIcons({
            lucideChevronLeft,
            lucideChevronRight,
            lucideCheckCircle2,
            lucideCircleDot,
            lucidePlus,
            lucideSparkles,
            lucideLayout,
            lucideLayers,
            lucideImage
        })],
    templateUrl: './theme-gallery.component.html',
    styleUrls: ['./theme-gallery.component.scss']
})
export class ThemeGalleryComponent {
    @Input() items: GalleryItem[] = [];
    @Input() activeId: string = '';
    @Input() showNavigation: boolean = true;
    @Output() onSelect = new EventEmitter<GalleryItem>();

    @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;

    private sanitizer = inject(DomSanitizer);

    scroll(direction: 'left' | 'right') {
        if (this.scrollContainer) {
            const scrollAmount = direction === 'left' ? -300 : 300;
            this.scrollContainer.nativeElement.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    }

    getBackgroundImage(item: GalleryItem): SafeStyle {
        if (!item.url || item.type === 'image') return 'none';

        let styleStr = 'none';
        if (item.type === 'gradient') {
            // Gradients não devem ser envolvidos em url()
            styleStr = item.url;
        } else if (item.type === 'pattern') {
            // Patterns data: URIs precisam de url(), mas URLs normais podem já ter
            styleStr = item.url.startsWith('data:') ? `url('${item.url}')` :
                (item.url.startsWith('url') ? item.url : `url('${item.url}')`);
        }

        return this.sanitizer.bypassSecurityTrustStyle(styleStr);
    }

    getSafeStyle(url: string | undefined): SafeStyle {
        if (!url) return '';
        return this.sanitizer.bypassSecurityTrustStyle(url);
    }

    getRelativeUrl(url: string | undefined): string {
        if (!url) return '';

        try {
            // Se for uma URL completa do Unsplash, extrair apenas o path (o ID da imagem)
            if (url.includes('images.unsplash.com')) {
                const urlObj = new URL(url);
                // Retorna apenas o path sem a leading slash e sem query params
                return urlObj.pathname.startsWith('/') ? urlObj.pathname.substring(1) : urlObj.pathname;
            }

            // Fallback: remover domínio conhecido e query params manualmente
            let clean = url.replace('https://images.unsplash.com/', '');
            return clean.split('?')[0];
        } catch (e) {
            // Se falhar o parse (ex: data URI), retornar vazio ou o que sobrar
            return url.split('?')[0];
        }
    }
}
