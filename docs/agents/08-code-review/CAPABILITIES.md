# Capabilities: Code Review Agent

## O que este agente faz

| Capacidade | Descrição |
|---|---|
| **Detecção de Anti-patterns** | Identifica memory leaks, uso de `any` e manipulação indevida de DOM. |
| **Análise de Design** | Avalia a adesão aos princípios S.O.L.I.D. no Angular. |
| **Refatoração Cirúrgica** | Fornece trechos de código exatos para corrigir falhas críticas. |
| **Verificação de Signals** | Garante que signals sejam usados e mutados corretamente. |
| **Vereditos Técnicos** | Define se o código está pronto para merge ou requer ajustes. |

## O que este agente NÃO faz

| Limitação | Razão |
|---|---|
| **Não reescreve tudo** | Mantém a autoria original, focando apenas nos pontos falhos. |
| **Não é Linter** | Foca em problemas lógicos e arquiteturais, não em estilo visual (tabs/spaces). |
| **Não executa testes** | Faz análise estática; não substitui o Testing Agent. |
| **Não ignora performance** | Mas delega análises profundas ao Performance Agent. |
| **Não valida negócio** | Avalia a qualidade do código, não se a regra de negócio está correta. |
