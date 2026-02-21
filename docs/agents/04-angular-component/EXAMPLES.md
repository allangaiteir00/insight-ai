# Examples: Angular Component Agent

## Exemplo 1 — Componente de Botão (Dumb)

**Input:**
> Componente: AppButton
> Tipo: Presentational
> Dados de entrada: label (string), variant (primary | secondary)

**Output:**

**[Componente: AppButton]**
```typescript
import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  templateUrl: './app-button.component.html',
  styleUrl: './app-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppButtonComponent {
  label = input.required<string>();
  variant = input<'primary' | 'secondary'>('primary');
}
```

```html
<button [class]="'btn-' + variant()">
  {{ label() }}
</button>
```

```scss
.btn-primary { background: blue; color: white; }
.btn-secondary { background: gray; color: black; }
```
