# Examples: Refactor Agent

## Exemplo 1 — Extração de Lógica de Cálculo

**Input:**
> Um método de 50 linhas calculando impostos e formatando a saída dentro de um componente.

**Output:**

**[Estratégia de Refatoração]**
Extração da lógica de cálculo para uma função pura utilitária para facilitar testes e reduzir o tamanho do componente.

**[Código Extraído]**
```typescript
export function calculateTax(value: number): number {
  return value * 0.15;
}
```

**[Arquivo Original Atualizado]**
```typescript
this.tax = calculateTax(this.amount());
```
