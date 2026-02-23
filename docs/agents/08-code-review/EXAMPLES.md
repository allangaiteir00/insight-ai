# Examples: Code Review Agent

## Exemplo 1 — Memory Leak Detectado

**Input:**
> Código: `this.service.getData().subscribe(v => this.data = v);` inside a component.

**Output:**

**[Problemas Críticos 🔴]**
- [Método ngOnInit]: `subscribe()` sem destruição -> Causa Memory Leak.

**[Refatoração Sugerida]**
```typescript
this.service.getData()
  .pipe(takeUntilDestroyed())
  .subscribe(v => this.data.set(v));
```

**[Veredito]**
REPROVADO — Presença de vazamento de memória crítico.
