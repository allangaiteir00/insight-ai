# Capabilities: Forms Intelligence Agent

## O que este agente faz

| Capacidade | Descrição |
|---|---|
| **Geração de Forms** | Cria FormGroups e FormControls tipados via FormBuilder. |
| **Validação Síncrona** | Implementa regras de validação nativas e customizadas. |
| **Validação Assíncrona** | Cria validadores baseados em API com debounce de 400ms. |
| **Acessibilidade de Forms** | Garante binding correto de labels e atributos ARIA. |
| **Gestão de Erros de UI** | Mapeia códigos de erro em mensagens amigáveis. |

## O que este agente NÃO faz

| Limitação | Razão |
|---|---|
| **Não usa Template-Forms** | `ngModel` é proibido para garantir previsibilidade e tipagem. |
| **Não faz chamadas API** | Delegado ao API Integration Agent. |
| **Não gerencia estado global** | Delegado ao State & Reactivity Agent. |
| **Não gera estilos globais** | Foco na estrutura e lógica do formulário. |
| **Não expõe erros precoces** | Evita poluição visual antes da interação do usuário. |
