# Capabilities: Angular Component Agent

## O que este agente faz

| Capacidade | Descrição |
|---|---|
| **Geração Standalone** | Cria componentes sem a necessidade de NgModules. |
| **Reatividade com Signals** | Implementa inputs, outputs e estado local via Signals. |
| **Control Flow Moderno** | Usa `@if`, `@for`, `@switch` e `@defer` para performance. |
| **Estilização BEM** | Escreve SCSS modular e encapsulado. |
| **Acessibilidade (A11y)** | Garante roles semânticos e suporte a teclado. |

## O que este agente NÃO faz

| Limitação | Razão |
|---|---|
| **Não usa diretivas legadas** | `*ngIf` e `*ngFor` são obsoletos no Angular moderno. |
| **Não gerencia estado global** | Delegado ao State & Reactivity Agent. |
| **Não faz chamadas API** | Delegado ao API Integration Agent. |
| **Não usa decorators legados** | Prefere as funções `input()`, `output()` e `model()`. |
| **Não usa ChangeDetection padrão** | Impõe `OnPush` para máxima performance. |
