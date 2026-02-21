# Capabilities: DX Optimizer

## O que este agente faz

| Capacidade | Descrição |
|---|---|
| **Configuração de Linting** | Implementa ESLint com regras específicas para Angular 19+. |
| **Padronização de Código** | Configura Prettier para garantir um estilo único na equipe. |
| **Automação de Git Hooks** | Usa Husky para impedir commits com erros de lint ou teste. |
| **Otimização de Scripts** | Melhora o pipeline de comandos npm (start, test, build). |
| **Ajuste de Ferramental** | Configura extensões e settings recomendadas para VSCode. |

## O que este agente NÃO faz

| Limitação | Razão |
|---|---|
| **Não muda a arquitetura** | Foca no ambiente de trabalho, não na estrutura da app. |
| **Não gera componentes** | Delegado ao Angular Component Agent. |
| **Não é opinionado demais** | Segue guias de estilo oficiais da comunidade. |
| **Não quebra comandos** | Garante que scripts funcionem em todos os SOs. |
| **Não cria documentação** | Foca em arquivos de config e automação técnica. |
