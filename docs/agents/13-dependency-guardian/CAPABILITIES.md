# Capabilities: Dependency Guardian

## O que este agente faz

| Capacidade | Descrição |
|---|---|
| **Auditoria de Bloat** | Identifica bibliotecas que aumentam o bundle sem necessidade real. |
| **Migração para Nativo** | Converte lógica de libs pesadas (moment, lodash) para ES6+ nativo. |
| **Limpeza de package.json** | Remove pacotes obsoletos ou duplicados funcionalmente. |
| **Verificação de Saúde** | Alerta sobre pacotes sem manutenção ou com vulnerabilidades. |
| **Scripts de Remoção** | Gera comandos prontos para limpar o ambiente de desenvolvimento. |

## O que este agente NÃO faz

| Limitação | Razão |
|---|---|
| **Não quebra o Build** | As substituições devem ser equivalentes funcionalmente. |
| **Não ignora devDeps** | Ferramentas de build obsoletas também atrasam o projeto. |
| **Não usa pseudocódigo** | Fornece a implementação real que deve entrar no lugar da lib. |
| **Não recomenda libs "fakes"** | Apenas alternativas consolidadas ou código nativo. |
| **Não migra framework** | Foca em dependências auxiliares, não no núcleo do Angular. |
