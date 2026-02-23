# Feature: Identity & Access Management (IAM)

O módulo de Identity é responsável pela governança de acesso, autenticação e multi-tenancy do InsightAI. Ele garante que os dados sejam isolados por organização e que cada usuário tenha permissões granulares baseadas em seu papel.

## 📄 Índice de Documentação

Explore os pilares da segurança do sistema:

1.  **[Detalhamento Técnico (TECHNICAL.md)](./TECHNICAL.md)**:
    - Engenharia de Isolamento de Dados (Tenancy).
    - Estrutura do motor de permissões RBAC/ACL.
    - Sincronização de contexto de usuário.

2.  **[Guia de Uso (USAGE.md)](./USAGE.md)**:
    - Como gerenciar usuários e grupos.
    - Configuração de perfis de acesso personalizados.
    - Mapeamento de "Capabilities".

3.  **[Representação Visual (VISUAL.md)](./VISUAL.md)**:
    - Diagrama ER das entidades de identidade.
    - Fluxo de validação de permissão.

---

## 🚀 Status da Feature: **EM DESENVOLVIMENTO (v0.1)**

- [x] Declaração de Entidades SaaS (`Tenants`, `Roles`, `Users`, `Groups`).
- [x] Seeding de dados para testes.
- [/] Implementação do motor de permissões reativo.
- [ ] Integração com Auth Provider externo.
- [x] Documentação inicial no padrão robusto.

---
*Garantindo a soberania e segurança dos dados empresariais.*
