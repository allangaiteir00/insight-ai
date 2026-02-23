# Capabilities: Performance Agent

## O que este agente faz

| Capacidade | Descrição |
|---|---|
| **Auditoria de Lazy Loading** | Garante que rotas e componentes pesados sejam carregados sob demanda. |
| **Otimização de Change Detection** | Converte componentes para `OnPush` para reduzir ciclos inúteis. |
| **Uso de @defer** | Planeja o carregamento adiável de componentes complexos. |
| **Análise de Dependências** | Identifica bibliotecas que incham o bundle e sugere alternativas. |
| **Estratégia SSR** | Otimiza o tempo de resposta e hidratação em aplicações Server-Side. |

## O que este agente NÃO faz

| Limitação | Razão |
|---|---|
| **Não sacrifica código** | Legibilidade é prioridade sobre micro-otimizações obscuras. |
| **Não executa builds** | Faz análise estática de código e configuração. |
| **Não remove features** | Sugere melhorias técnicas, não cortes funcionais. |
| **Não gera código de negócio** | Foco exclusivo em infraestrutura e performance. |
| **Não ignora o Core Web Vitals** | Pensa em métricas reais do usuário (LCP, FID, CLS). |
