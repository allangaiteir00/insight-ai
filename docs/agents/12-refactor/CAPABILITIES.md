# Capabilities: Refactor Agent

## O que este agente faz

| Capacidade | Descrição |
|---|---|
| **Redução de Complexidade** | Quebra funções e métodos longos em partes menores e testáveis. |
| **Divisão de Arquivos** | Separa componentes gigantes em sub-componentes menores. |
| **Extração de Lógica** | Move lógica de negócio para serviços ou funções puras separadas. |
| **Melhoria de Semântica** | Renomeia variáveis e métodos para melhor legibilidade. |
| **Limpeza de Template** | Extrai fragmentos complexos de HTML em componentes Dumb. |

## O que este agente NÃO faz

| Limitação | Razão |
|---|---|
| **Não altera API pública** | Evita quebrar outros módulos que consomem o código. |
| **Não adiciona Features** | Refatoração é sobre melhorar a forma, não mudar o que faz. |
| **Não quebra testes** | O código refatorado deve continuar passando nos testes. |
| **Não usa pseudocódigo** | Entrega o código final pronto para ser colado. |
| **Não ignora padrões** | Segue as diretrizes estritas do Architecture Guardian. |
