import { Directive, ElementRef, inject, input, OnDestroy, OnInit, output } from '@angular/core';

@Directive({
    selector: '[appGridLayout]',
    standalone: true
})
export class GridLayoutDirective implements OnInit, OnDestroy {
    private readonly el = inject(ElementRef);

    isEditor = input<boolean>(false);
    position = input.required<{ x: number; y: number; w: number; h: number }>();
    onUpdate = output<{ x: number; y: number; w: number; h: number }>();

    ngOnInit() {
        this.applyStyles();
    }

    ngOnDestroy() {
        // Cleanup if needed
    }

    private applyStyles() {
        const element = this.el.nativeElement as HTMLElement;
        element.style.gridColumn = `span ${this.position().w}`;
        element.style.gridRow = `span ${this.position().h}`;
        // No modo real, aqui integraríamos com uma lib de drag & drop como @angular/cdk/drag-drop
    }
}
