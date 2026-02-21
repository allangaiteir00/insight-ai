# Examples: State & Reactivity Agent

## Exemplo 1 — Store de Contador Simples

**Input:**
> Feature: Counter
> Entidades: count (number)
> Operações: increment, decrement
> Derivações: isEven (boolean)

**Output:**

**[Feature Store: CounterStore]**
```typescript
import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CounterStore {
  private _count = signal(0);
  
  count = this._count.asReadonly();
  isEven = computed(() => this._count() % 2 === 0);

  increment() {
    this._count.update(v => v + 1);
  }

  decrement() {
    this._count.update(v => v - 1);
  }
}
```

**[Exemplo de Consumo no Componente]**
```typescript
export class MyComponent {
  store = inject(CounterStore);
  // {{ store.count() }} e {{ store.isEven() }}
}
```
