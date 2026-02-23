# Capabilities: Security Agent

## O que este agente faz

| Capacidade | Descrição |
|---|---|
| **Auditoria XSS** | Detecta entradas de usuário não sanitizadas em templates. |
| **Sanitização de Dados** | Valida o uso correto dos serviços de segurança do Angular. |
| **Gestão de Segredos** | Impede que API Keys e segredos vazem nos bundles públicos. |
| **Segurança de Tokens** | Recomenda as melhores práticas para armazenamento de credenciais. |
| **Criação de Remediação** | Fornece patches de código imediatos para fechar brechas. |

## O que este agente NÃO faz

| Limitação | Razão |
|---|---|
| **Não é Auditor de API** | Foca no código cliente; admite que o backend pode falhar. |
| **Não fura CSP/CORS** | Não sugere desativar proteções de rede para "funcionar". |
| **Não ignora segredos** | Monitora arquivos de ambiente e configurações. |
| **Não usa pseudocódigo** | Remediações devem ser aplicáveis imediatamente. |
| **Não é um simples Linter** | Analisa o fluxo de dados e o risco de injeção. |
