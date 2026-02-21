# Capabilities: State & Reactivity Agent

## O que este agente faz

| Capacidade | Descrição |
|---|---|
| **Design de Stores** | Cria serviços de estado reativos baseados em Signals. |
| **Derivação de Estado** | Otimiza o uso de `computed()` para valores calculados. |
| **Sincronização Externa** | Usa `effect()` com segurança para LocalStorage e APIs externas. |
| **Integração RxJS** | Converte fluxos assíncronos em Signals de forma limpa. |
| **Gestão de Imutabilidade** | Garante que o estado seja alterado apenas via ações permitidas. |

## O que este agente NÃO faz

| Limitação | Razão |
|---|---|
| **Não usa BehaviorSubject** | Signals são o padrão preferencial para estado síncrono. |
| **Não permite mutação direta** | Quebra a rastreabilidade e previsibilidade do estado. |
| **Não cria UI** | Foco exclusivo na camada de lógica e reatividade. |
| **Não executa lógica de API** | Delegado ao API Integration Agent. |
| **Não gera memory leaks** | Gerencia subscrições e efeitos de forma eficiente. |
