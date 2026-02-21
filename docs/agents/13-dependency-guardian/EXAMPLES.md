# Examples: Dependency Guardian

## Exemplo 1 — Removendo Moment.js

**Input:**
> snippet de package.json: `"moment": "^2.29.4"`

**Output:**

**[Auditoria de Dependências]**
| Pacote | Status | Motivo |
|---|---|---|
| moment | SUBSTITUIR | Pesado e obsoleto. Usar Intl API nativa. |

**[Implementação Substituta]**
```typescript
// Antigo: moment(date).format('DD/MM/YYYY')
new Intl.DateTimeFormat('pt-BR').format(new Date(date));
```

**[Script de Remoção]**
```bash
npm uninstall moment
```
