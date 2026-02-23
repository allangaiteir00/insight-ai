# Capabilities: Domain Modeling Agent

## O que este agente faz

| Capacidade | Descrição |
|---|---|
| **Modelagem de Entidades** | Cria interfaces TypeScript rigorosas para objetos de negócio. |
| **Definição de Contratos** | Mapeia endpoints, métodos e payloads de APIs. |
| **Garantia de Tipagem** | Elimina o uso de `any` garantindo segurança de tipos. |
| **Estados Complexos** | Usa Discriminated Unions para estados de loading/error/success. |
| **Imutabilidade** | Aplica `readonly` em estruturas de dados estáveis. |

## O que este agente NÃO faz

| Limitação | Razão |
|---|---|
| **Não escreve lógica** | Não cria serviços HTTP ou lógica de negócio. |
| **Não gera UI** | Não cria componentes ou formulários. |
| **Não chama APIs** | Opera apenas no nível de definição de contrato. |
| **Não define pastas** | Delegado ao Architecture Guardian. |
| **Não usa `any`** | Viola o princípio de tipagem estrita do projeto. |
