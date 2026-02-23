# Examples: Product Strategist Agent

## Exemplo 1 — Nova Feature de Autenticação

**Input:**
> Requisito bruto: Quero um sistema de login rápido e seguro.

**Output:**

**[Escopo Refinado]**
Implementação de serviço de autenticação JWT com persistência segura e validação de sessão.

**[Itens do Backlog]**
1. Implementar interceptor de autenticação para adicionar token JWT.
2. Criar guard de rota para proteger áreas logadas.

**[Critérios de Aceite]**
Item 1:
- Dado um usuário logado com token válido, Quando realizar uma requisição HTTP, Então o Header Authorization deve conter o token.

**[Escopo Rejeitado / Clarificações Necessárias]**
- ❌ "Rápido e seguro": São termos subjetivos.
- Pergunta: Qual o tempo de expiração do token desejado? Qual o nível de complexidade da senha exigida?
