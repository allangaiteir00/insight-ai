# Examples: Architecture Guardian

## Exemplo 1 — Nova Feature de Dashboard

**Input:**
> Feature: Dashboard de Vendas.
> Descrição: Exibição de gráficos e indicadores.

**Output:**

**[Estrutura de Pastas]**
```text
src/
  features/
    dashboard/
      components/
        chart-card/ (Dumb)
        summary-header/ (Dumb)
      dashboard.component.ts (Smart)
      store/
        dashboard.store.ts
```

**[Regras de Dependência]**
- Dashboard → importa de: shared/ui/charts
- Dashboard → NÃO pode importar de: orders-feature

**[Veredito Arquitetural]**
✅ APROVADO — Estrutura segue FSD e isolamento de estado.
