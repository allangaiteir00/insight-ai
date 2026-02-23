# Guia de Uso: Gestão de Identidade e Acessos (IAM)

Este guia explica como configurar a estrutura de usuários e permissões do seu tenant no InsightAI.

## 1. Gerenciando Usuários

A administração de usuários é onde você controla quem tem acesso ao sistema.
1. Acesse **Configurações > Usuários**.
2. **Convidar Usuário**: Insira o e-mail e atribua um **Papel (Role)** e uma **Organização (Tenant)**.
3. **Status**: Usuários podem estar `Ativos`, `Inativos` (sem acesso) ou `Pendentes` (aguardando convite).

---

## 2. Definindo Perfis de Acesso (Roles)

Os papéis determinam o que os usuários podem ou não fazer nos módulos de Workspace e Dados.
- **Admin**: Acesso total a todas as entidades e configurações.
- **Editor**: Pode criar e editar dados, mas não gerenciar outros usuários.
- **Viewer**: Apenas leitura em todos os dashboards.

### Como aplicar permissões customizadas
No campo `permissions` da entidade Role, utilize o formato:
- `workspace:edit`: Permite alterar layouts.
- `tasks:*`: Permite CRUD completo na entidade Tarefas.
- `*`: Super-admin (Cuidado!).

---

## 3. Multi-tenancy: Trabalhando com Organizações

O InsightAI é isolado por Tenant. Isso significa que:
- Registros criados na "Org A" **nunca** serão visíveis na "Org B".
- Um usuário pode estar vinculado a múltiplas organizações se o convite for aceito em ambas (funcionalidade futura).

---

## 4. Grupos de Trabalho

Utilize **Grupos** para organizar seus usuários internamente (ex: Squad Alpha, Departamento Financeiro). Futuramente, as permissões poderão ser atribuídas diretamente a grupos.

---
*Guia de operações de segurança v0.1.*
