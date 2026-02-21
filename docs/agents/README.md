# AI Angular Software Factory — Sistema de Agentes

Ecossistema autônomo de 15 agentes especializados para desenvolvimento Angular 19+ com Standalone, Signals e Feature-Sliced Architecture.

---

## 🗂️ Índice de Agentes

### 🧠 Camada Estratégica
| # | Agente | Responsabilidade Principal | Documentação | Ativação |
|---|---|---|---|---|
| 01 | **Product Strategist** | Refina requisitos, backlog BDD | [AGENT.md](01-product-strategist/AGENT.md) | `/product_strategist` |
| 02 | **Domain Modeling** | Entidades e contratos de API | [AGENT.md](02-domain-modeling/AGENT.md) | `/domain_modeling` |
| 03 | **Architecture Guardian** | Estrutura de pastas e padrões | [AGENT.md](03-architecture-guardian/AGENT.md) | `/architecture_guardian` |

### ⚙️ Camada Técnica
| # | Agente | Responsabilidade Principal | Documentação | Ativação |
|---|---|---|---|---|
| 04 | **Angular Component** | Componentes Standalone e Signals | [AGENT.md](04-angular-component/AGENT.md) | `/angular_component` |
| 05 | **State & Reactivity** | Feature Stores com Signals | [AGENT.md](05-state-reactivity/AGENT.md) | `/state_reactivity` |
| 06 | **API Integration** | Services HTTP e Interceptors | [AGENT.md](06-api-integration/AGENT.md) | `/api_integration` |
| 07 | **Forms Intelligence** | Reactive Forms e Validações | [AGENT.md](07-forms-intelligence/AGENT.md) | `/forms_intelligence` |

### 🔍 Camada de Qualidade
| # | Agente | Responsabilidade Principal | Documentação | Ativação |
|---|---|---|---|---|
| 08 | **Code Review** | Anti-patterns e Veredito | [AGENT.md](08-code-review/AGENT.md) | `/code_review` |
| 09 | **Performance** | Otimização e Lazy Loading | [AGENT.md](09-performance/AGENT.md) | `/performance` |
| 10 | **Security** | Auditoria XSS e Sanitização | [AGENT.md](10-security/AGENT.md) | `/security` |
| 11 | **Testing**| Unit tests e Mocks | [AGENT.md](11-testing/AGENT.md) | `/testing` |

### 🚀 Camada de Evolução
| # | Agente | Responsabilidade Principal | Documentação | Ativação |
|---|---|---|---|---|
| 12 | **Refactor** | Redução de Complexidade | [AGENT.md](12-refactor/AGENT.md) | `/refactor` |
| 13 | **Dependency Guardian** | Auditoria de Bloat | [AGENT.md](13-dependency-guardian/AGENT.md) | `/dependency_guardian` |
| 14 | **DX Optimizer** | Ferramental e Scripts | [AGENT.md](14-dx-optimizer/AGENT.md) | `/dx_optimizer` |

### 🎯 Agente de Controle
| # | Agente | Responsabilidade Principal | Documentação | Ativação |
|---|---|---|---|---|
| 15 | **Orchestrator** | Coordena o fluxo de trabalho | [AGENT.md](15-orchestrator/AGENT.md) | `/orchestrator` |

---

## 🔄 Sequência de Ativação Obrigatória

```mermaid
graph TD
    User([Usuário]) --> Orchestrator{/orchestrator}
    Orchestrator --> Strat[Estratégia]
    Strat --> Prod[Product Strategist]
    Prod --> Dom[Domain Modeling]
    Dom --> Arch[Architecture Guardian]
    Arch --> Tech[Técnico/Execução]
    Tech --> Comp[Angular Component]
    Tech --> State[State & Reactivity]
    Tech --> API[API Integration]
    Tech --> Form[Forms Intelligence]
    Comp & State & API & Form --> Qual[Qualidade/Revisão]
    Qual --> Rev[Code Review]
    Rev --> Perf[Performance]
    Rev --> Sec[Security]
    Rev --> Test[Testing]
    Qual --> Evol[Evolução]
    Evol --> Reft[Refactor]
    Evol --> Dep[Dependency Guardian]
    Evol --> DX[DX Optimizer]
```

---

## 📐 Baseline Técnico

| Dimensão | Padrão |
|---|---|
| **Angular** | 19+ |
| **Arquitetura** | Standalone Components |
| **Reatividade** | Angular Signals |
| **Estilo** | SCSS + BEM |
| **Estrutura** | Feature-Sliced Design |
| **Idioma** | Português (Brasil) |

---

## 🚀 Como usar

1. Use o comando `/orchestrator` para iniciar o fluxo.
2. Siga as instruções de cada agente.
3. Use os comandos individuais (ex: `/code_review`) para ativação pontual.
