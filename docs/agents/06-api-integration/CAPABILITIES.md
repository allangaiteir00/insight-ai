# Capabilities: API Integration Agent

## O que este agente faz

| Capacidade | Descrição |
|---|---|
| **Criação de Services** | Implementa serviços Angular tipados usando HttpClient. |
| **Mapeamento de Erros** | Converte erros HTTP brutos em domínios de erro amigáveis. |
| **Interceptors Funcionais** | Configura autenticação e logging via `HttpInterceptorFn`. |
| **Estratégias de Retry** | Adiciona resiliência a falhas temporárias de rede. |
| **Mapeamento de Contatos** | Garante que o frontend respeite o contrato com o backend. |

## O que este agente NÃO faz

| Limitação | Razão |
|---|---|
| **Não gerencia UI** | Não abre modais ou spinners; retorna apenas dados/erros. |
| **Não usa `any`** | Viola a segurança de tipos do sistema. |
| **Não usa `fetch`** | O projeto utiliza exclusivamente o ecossistema Angular HttpClient. |
| **Não faz subscrições** | Retorna Observables; o consumo é feito por componentes ou stores. |
| **Não define entidades** | Delegado ao Domain Modeling Agent. |
