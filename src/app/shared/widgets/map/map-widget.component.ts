import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, ViewChild, effect, input } from '@angular/core';
import * as L from 'leaflet';
import { WidgetConfig } from '../../../core/models/dashboard.model';
import { EntityDefinition } from '../../../core/page-engine/models/entity.model';

@Component({
    selector: 'app-map-widget',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="map-wrapper">
      <div #mapContainer class="map-container"></div>
    </div>
  `,
    styles: [`
    :host { display: block; height: 100%; }
    .map-wrapper { height: 100%; border-radius: var(--radius); overflow: hidden; }
    .map-container { height: 100%; width: 100%; background: var(--color-surface); }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapWidgetComponent implements AfterViewInit, OnDestroy {
    config = input.required<WidgetConfig>();
    entity = input<EntityDefinition>();
    data = input<any[] | null>();

    @ViewChild('mapContainer') mapContainer!: ElementRef;

    private map?: L.Map;
    private markers: L.Marker[] = [];

    constructor() {
        // Fix for Leaflet default icon issues in some environments
        const iconRetinaUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png';
        const iconUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png';
        const shadowUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png';
        const iconDefault = L.icon({
            iconRetinaUrl,
            iconUrl,
            shadowUrl,
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            tooltipAnchor: [16, -28],
            shadowSize: [41, 41]
        });
        L.Marker.prototype.options.icon = iconDefault;

        // Reage a mudanças nos dados para atualizar marcadores
        effect(() => {
            const currentData = this.data();
            if (this.map && currentData) {
                this.updateMarkers(currentData);
            }
        });
    }

    ngAfterViewInit() {
        this.initMap();
    }

    ngOnDestroy() {
        if (this.map) {
            this.map.remove();
        }
    }

    private initMap() {
        this.map = L.map(this.mapContainer.nativeElement).setView([0, 0], 2);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);

        // Se já houver dados, desenha os marcadores imediatamente
        const currentData = this.data();
        if (currentData) {
            this.updateMarkers(currentData);
        }

        // Forçar redimensionamento após renderização para evitar cinza no container
        setTimeout(() => {
            if (this.map) {
                this.map.invalidateSize();
            }
        }, 300);
    }

    private updateMarkers(data: any[]) {
        // Limpa marcadores anteriores
        this.markers.forEach(m => m.remove());
        this.markers = [];

        const mappings = this.config().mappings || {};
        const latKey = mappings['lat'] || 'lat';
        const lngKey = mappings['lng'] || 'lng';
        const labelKey = mappings['label'] || 'name';

        const coords: L.LatLngExpression[] = [];

        data.forEach(record => {
            const lat = parseFloat(record[latKey]);
            const lng = parseFloat(record[lngKey]);

            if (!isNaN(lat) && !isNaN(lng)) {
                const marker = L.marker([lat, lng])
                    .bindPopup(`<b>${record[labelKey] || 'Registro'}</b>`)
                    .addTo(this.map!);

                this.markers.push(marker);
                coords.push([lat, lng]);
            }
        });

        // Ajusta o zoom para enquadrar todos os marcadores
        if (coords.length > 0 && this.map) {
            this.map.fitBounds(L.latLngBounds(coords), { padding: [50, 50] });
        }
    }
}
