# Documentação Técnica: Identity & Multi-tenancy Engine

O motor de Identidade do InsightAI é estruturado para suportar o modelo hierárquico necessário para aplicações SaaS Enterprise.

## 1. Arquitetura de Multi-tenancy (Data Isolation)

O sistema utiliza uma estratégia de **Soft Multi-tenancy** baseada em Chaves Estrangeiras (`tenantId`):

- **Isolamento Lógico**: Cada registro de entidade de negócio (ex: `Task`, `Customer`) deve obrigatoriamente possuir um vínculo com um `Tenant`.
- **Global Context**: O sistema mantém um `currentTenantId` (Sinal) que filtra automaticamente as queries no `EntityDataService`.
- **Tenants Entity**: Armazena metadados da organização, como plano (Free/Pro/Ent) e configurações de branding.

## 2. Motor de Permissões (RBAC/ACL)

A segurança é gerida através de uma implementação de **Role-Based Access Control (RBAC)**:

### 2.1 Estrutura de Papéis (`Roles`)
Cada papel define um conjunto de "Capabilities" em formato string (ex: `projects:edit`, `users:*`).
- **Capability Path**: Seguimos o padrão `context:action`.
- **Wildcards**: Suporte a `*` para conceder acesso total a um contexto de entidade.

### 2.2 Validação Reativa
O `IdentityService` provê um sinal computado `permissions$` que extrai as capacidades do papel do usuário atual.
O componente `HasPermissionDirective` (planejado) utiliza este sinal para esconder/desabilitar elementos da UI em tempo real.

---

## 3. Entidades de Sistema

| Entidade | Responsabilidade | Relacionamentos |
| :--- | :--- | :--- |
| **User** | Ator principal do sistema. | N:1 Role, N:1 Tenant |
| **Role** | Agrupador de permissões. | 1:N User |
| **Tenant** | Unidade de isolamento de dados. | 1:N User, 1:N Group |
| **Group** | Agrupador lógico para partilha de recursos. | N:1 Tenant |

---

## 4. Integração com Backend (Plan)

Para a transição de Mocks para Persistência Real:
- **Token JWT**: Deve conter o `tenantId` e `roleId` no payload para validação stateless.
- **Middleware de Segurança**: O backend deve injetar automaticamente um filtro `WHERE tenant_id = XYZ` em todas as queries SQL/NoSQL baseadas no token do usuário.

---
*Documentação técnica v0.1 — Base para segurança Enterprise.*
