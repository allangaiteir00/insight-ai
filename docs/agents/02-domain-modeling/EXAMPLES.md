# Examples: Domain Modeling Agent

## Exemplo 1 — Domínio de Usuários

**Input:**
> Domínio: Gerenciamento de Usuários.
> Entidades: Usuário com ID, nome, email e status.

**Output:**

**[Entidades de Domínio]**
```typescript
export const enum UserStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE'
}

export interface User {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly status: UserStatus;
}
```

**[Contratos de API]**
| Endpoint | Método | Request Payload | Response Payload | Estados de Erro |
|---|---|---|---|---|
| /api/users | GET | void | User[] | 401 Unauthorized |
