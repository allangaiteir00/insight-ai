# Padrões de Desenvolvimento — Referência Central

> Documento normativo do sistema de agentes. Todos os agentes devem referenciar e aplicar estas regras em seus outputs.

---

## 🧹 Clean Code

Regras obrigatórias de escrita de código limpo e expressivo.

### Nomenclatura
| Contexto | Regra |
|---|---|
| **Variáveis / Propriedades** | Nomes completos e semânticos. Proibido: `d`, `tmp`, `data`, `item`, `val` |
| **Funções / Métodos** | Verbos de ação expressivos: `loadUserDashboard()`, não `getData()` |
| **Componentes / Classes** | Substantivos que descrevem responsabilidade: `UserProfileCard`, não `Card2` |
| **Booleans** | Prefixo `is`, `has`, `can`, `should`: `isLoading`, `hasError`, `canSave` |
| **Observables / Signals** | Sufixo `$` para Observables: `user$`; sem sufixo para Signals: `userSignal` ou `user` |

### Funções
- Máximo de **20 linhas** por função. Acima disso: extrair em funções auxiliares nomeadas.
- **Uma função = uma ação**. Funções que fazem A e B devem ser duas funções.
- Parâmetros: máximo de **3 parâmetros**. Se mais, usar um objeto tipado.
- Proibido retornar `null` sem motivo explícito; preferir `undefined` ou tipos opcionais.
- Funções puras sempre que possível: sem efeitos colaterais implícitos.

### Comentários
- Código deve ser autoexplicativo. Comentários descrevem **o porquê**, nunca **o quê**.
- Proibido: `// loop para iterar os itens`, `// chama o serviço`.
- Permitido: `// Workaround: API retorna null quando usuário é guest (ticket #432)`.
- TODOs devem ter responsável e prazo: `// TODO(allan): remover após migração v2 - 2025-06`.

### Formatação
- Lógica de negócio **nunca** no template HTML — extrair para o componente `.ts`.
- Magic numbers são proibidos. Extrair para constantes nomeadas: `const MAX_WIDGETS = 12`.
- Arquivos de componente: máximo de **300 linhas** de TypeScript.
- Template HTML: máximo de **150 linhas**. Acima disso: extrair sub-componentes.

---

## 🏗️ SOLID

Princípios SOLID aplicados ao contexto Angular 19+ com Standalone e Signals.

### S — Princípio da Responsabilidade Única (SRP)
- **Componente**: responsável por uma única fatia de UI. Não misture lógica de formulário, chamada de API e exibição de dados no mesmo componente.
- **Service**: responsável por um único domínio de negócio: `UserService`, `DashboardService`. Proibido: `AppService` ou `UtilsService` genéricos.
- **Signal Store**: 1 store = 1 contexto de estado. Não misture estado de autenticação e estado de widget no mesmo store.
- **Interface**: 1 interface = 1 contrato. Proibido interfaces com métodos de domínios diferentes.

### O — Princípio Aberto/Fechado (OCP)
- Componentes devem ser extensíveis via `inputs()` e `outputs()`, sem precisar alterar o código interno.
- Lógica variável deve ser estrategizável via `InjectionToken` ou DI, não via `if/else` crescentes.
- Adicionar comportamento via composição de Signals/computed, não modificando stores existentes.

### L — Princípio da Substituição de Liskov (LSP)
- Sub-tipos devem ser substituíveis pelo tipo base. Componentes filho que recebem `input()` tipado não devem alterar a semântica do tipo recebido.
- `extends` só é válido se o comportamento base for 100% preservado.

### I — Princípio da Segregação de Interfaces (ISP)
- Interfaces de domínio devem ser granulares. Prefira:
  ```typescript
  interface Readable { get(): Observable<Entity> }
  interface Writable { save(entity: Entity): Observable<void> }
  ```
  a uma única interface `EntityRepository` com todos os métodos.
- `@Input()` de componentes: prefira múltiplos inputs específicos a um único objeto genérico.

### D — Princípio da Inversão de Dependência (DIP)
- Componentes e services **nunca** dependem de implementações concretas — sempre de abstrações (interfaces ou `InjectionToken`).
- `HttpClient` não deve ser injetado diretamente em componentes. Encapsule em services.
- Services que dependem uns dos outros: use `InjectionToken` para inverter a dependência.

```typescript
// ✅ CORRETO — DIP aplicado
const USER_REPOSITORY = new InjectionToken<UserRepository>('UserRepository');

// ❌ ERRADO — dependência concreta
class DashboardComponent {
  private userService = inject(UserServiceImpl); // implementação exposta
}
```

---

## 🧩 Componentização

Regras de decomposição de UI em componentes coesos e reutilizáveis.

### Smart vs Dumb (Container vs Presentational)

| Tipo | Responsabilidade | Pode injetar services? | Comunica via |
|---|---|---|---|
| **Smart (Container)** | Orquestra estado e dados | ✅ Sim | `outputs()` de filhos |
| **Dumb (Presentational)** | Renderiza UI, sem lógica de negócio | ❌ Não | `inputs()` e `outputs()` |

### Regras de Extração de Componentes
Criar um novo componente quando:
1. Um bloco de template é reutilizado em **2 ou mais** lugares.
2. O template do componente pai ultrapassa **150 linhas**.
3. Uma seção do template tem lógica condicional complexa (`@if` aninhado com `@for`).
4. A seção tem estado interno isolado (loading, erro, paginação).

### Regras de Comunicação
- **Props drilling máximo**: 2 níveis. Se o dado precisa passar por 3+ componentes, usar um Signal Store ou `input()` de roteamento.
- Outputs: usar `output()` com eventos semânticos: `widgetSelected`, `formSubmitted`, `filterChanged`.
- Proibido `EventEmitter` com payload genérico (`any`, `Object`). Sempre tipar.

### Estrutura de Arquivo de Componente
```
feature/
  components/
    smart/            ← Containers (orquestram estado)
    presentational/   ← UI pura (Dumb)
  models/             ← Interfaces e tipos do domínio da feature
  services/           ← Lógica de negócio isolada
  store/              ← Signal stores da feature
```

---

## ✅ Checklist de Conformidade

Use este checklist ao criar ou revisar qualquer artefato:

| # | Critério | Clean Code | SOLID | Componentização |
|---|---|:---:|:---:|:---:|
| 1 | Nomes de funções e variáveis são expressivos | ✅ | | |
| 2 | Funções têm ≤20 linhas e 1 responsabilidade | ✅ | S | |
| 3 | Sem magic numbers — constantes nomeadas | ✅ | | |
| 4 | Sem lógica de negócio no template HTML | ✅ | | ✅ |
| 5 | Componente tem 1 responsabilidade clara | | S | ✅ |
| 6 | Component Dumb não injeta services | | | ✅ |
| 7 | Service depende de abstração, não concreção | | D | |
| 8 | Interface só expõe métodos do seu contrato | | I | |
| 9 | Props drilling máximo de 2 níveis | | | ✅ |
| 10 | Componente > 150 linhas de template foi extraído | ✅ | | ✅ |

---

## 📚 Padrão de Documentação de Feature

Toda feature em `src/app/features/` deve ser auto-documentada para garantir a manutenibilidade por humanos e IAs.

### Estrutura da Pasta `docs/`
Cada feature deve conter obrigatoriamente uma pasta `docs/` com um arquivo principal (ex: `FEATURE.md`).

### Conteúdo Requerido
1. **Conceito/Propósito**: O que a feature resolve.
2. **Catálogo de Recursos**: Mapeamento de Services, Components e Models.
3. **Guia de Uso**: Como interagir ou consumir a feature.
4. **Diagramas Mermaid**:
   - **Uso**: Fluxo de interação (Sequence Diagram).
   - **Conceitual**: Estrutura lógica ou fluxo de dados (Graph/Class).

### Ciclo de Vida
- **Criação**: Feature só é "Done" com `docs/` completo.
- **Manutenção**: Alterações de lógica exigem atualização imediata da documentação.
