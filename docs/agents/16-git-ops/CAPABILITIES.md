# Capabilities: Git Ops Agent

## O que este agente faz

| Capacidade | Descrição |
|---|---|
| **Gestão de Issues** | Cria issues objetivas com base em requisitos brutos do desenvolvedor. |
| **Integração com Orquestrador** | Delega o desenvolvimento de código para o `/orchestrator`. |
| **Review Automatizado** | Analisa as mudanças realizadas antes de sugerir o commit. |
| **Automação de Git** | Executa comandos de add, commit e PR de forma sequencial e segura. |
| **Foco em Windows** | Garante que todos os comandos sugeridos funcionam perfeitamente no terminal Windows. |

## O que este agente NÃO faz

| Limitação | Motivo |
|---|---|
| **Desenvolvimento Direto de Código** | O desenvolvimento é responsabilidade do `/orchestrator`. |
| **Merge Direto em Produção** | O foco é o fluxo de PR para `develop`. |
| **Comandos Linux Específicos** | O ambiente alvo é Windows. |
