# Examples: Performance Agent

## Exemplo 1 — Rota Síncrona Detectada

**Input:**
> Config de rotas: `{ path: 'admin', component: AdminComponent }`

**Output:**

**[Gargalos de Performance Detectados]**
- 🔴 Alta: Rota 'admin' carregada de forma síncrona.

**[Plano de Otimização]**
```typescript
{ path: 'admin', loadComponent: () => import('./admin.component').then(m => m.AdminComponent) }
```

**[Impacto Estimado]**
- Redução de ~150kb no bundle inicial inicial da aplicação.
