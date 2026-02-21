# Examples: Forms Intelligence Agent

## Exemplo 1 — Formulário de Cadastro Simples

**Input:**
> Formulário: RegisterForm
> Campos: email (required, email), password (required, min 8)

**Output:**

**[Form Logic: RegisterForm]**
```typescript
class MyComponent {
  fb = inject(FormBuilder);
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });
}
```

**[Form Template: RegisterForm]**
```html
<form [formGroup]="form">
  <label for="email">Email</label>
  <input id="email" formControlName="email">
  @if (form.controls.email.invalid && form.controls.email.touched) {
    <span>Formato de email inválido</span>
  }
</form>
```
