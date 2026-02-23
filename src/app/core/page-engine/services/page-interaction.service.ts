import { Injectable } from '@angular/core';
import { Subject, filter } from 'rxjs';
import { InteractionEvent, InteractionType } from '../models/interaction.model';

@Injectable({ providedIn: 'root' })
export class PageInteractionService {
    private readonly _events$ = new Subject<InteractionEvent>();

    // Global stream of interaction events
    readonly events$ = this._events$.asObservable();

    /**
     * Emits a new interaction event to the page bus.
     */
    emit(event: Omit<InteractionEvent, 'timestamp'>): void {
        this._events$.next({
            ...event,
            timestamp: Date.now()
        });
    }

    /**
     * Returns an observable filtered by event type.
     */
    on(type: InteractionType) {
        return this.events$.pipe(
            filter(event => event.type === type)
        );
    }

    /**
     * Specialized listener for record selection.
     */
    onRecordSelected(entityId?: string) {
        return this.events$.pipe(
            filter(event => event.type === 'recordSelected'),
            filter(event => !entityId || event.entityId === entityId)
        );
    }

    /**
     * Specialized listener for global filters.
     */
    onFilterApplied() {
        return this.events$.pipe(
            filter(event => event.type === 'filterApplied')
        );
    }

    /**
     * Emits a filter applied event.
     */
    applyFilter(sourceId: string, payload: Record<string, any>, entityId?: string): void {
        this.emit({
            sourceId,
            type: 'filterApplied',
            entityId,
            payload
        });
    }
}
