# Documentação Técnica Exaustiva: Entity Management Engine

O motor de gerenciamento de entidades é o alicerce de dados do InsightAI, permitindo a definição dinâmica de esquemas que geram interfaces de usuário automaticamente.

## 1. Arquitetura do Schema Engine (Macro-to-Micro)

O sistema é centrado no `EntityRegistryService` e `EntityDataService`, operando de forma desacoplada:

### 1.1 Definição de Esquema (`EntityRegistryService`)
O registro armazena metadados estruturais (`EntityDefinition`):
- **Campos Dinâmicos**: Suporta `string`, `number`, `date`, `boolean`, `select` e `relation`.
- **Validação de Tipos**: Cada campo possui metadados que o `FormWidget` utiliza para aplicar validadores (required, min/max).
- **Extensibilidade**: Permite adicionar novas entidades em runtime, que são imediatamente refletidas no `WidgetPicker`.

### 1.2 Camada de Dados Reativa (`EntityDataService`)
Diferente de um service tradicional, o `EntityDataService` funciona como um **In-Memory Store** sincronizado:
- **`_recordsMap` Signal**: Centraliza todos os dados de todas as entidades em um único sinal reativo.
- **Computed Queries**: O método `getRecords(id)` retorna um sinal derivado, garantindo que apenas widgets interessados naquela entidade específica sejam notificados sobre mudanças.
- **Optimistic Updates**: As mutações (`add`, `update`, `delete`) ocorrem instantaneamente no sinal local para garantir latência zero na UI, com hooks preparados para sincronia de backend.

---

## 2. Detalhes de Implementação dos Modelos

### 2.1 EntityField e Mapeamentos
Os campos são imutáveis e seguem um contrato rigoroso:
- **`select`**: Exige um array de `options` (label/value).
- **`relation`**: Define um vínculo de chave estrangeira com outra `entityId`, permitindo que o sistema gere automaticamente dropdowns de busca ou visualizações master-detail.

### 2.2 EntityAction
Define as operações permitidas no barramento de comandos:
- `create`: Abre o modal de criação generativo.
- `update`: Habilita o modo de edição no formulário.
- `delete`: Dispara o fluxo de confirmação e remoção transacional.

---

## 3. Fluxo Transacional (Data Lifecycle)

1.  **Ingestão**: O `EntityDataService` semeia dados iniciais via `seedInitialData()`.
2.  **Mutação**: Quando um `KanbanWidget` move um card ou um `FormWidget` é salvo, o `EntityDataService.updateRecord` é invocado.
3.  **Propagação**: O signal `_recordsMap` é atualizado -> o computed de `getRecords` emite -> todos os widgets (Tabelas, Gráficos, KPI) se atualizam simultaneamente sem refresh de página.

---

## 4. Estratégia de Mocking e Desenvolvimento
Para facilitar o desenvolvimento Offline-First, o sistema gera IDs únicos baseados no timestamp e prefixo da entidade (`task-1708...`), garantindo que não haja colisões de dados locais antes da persistência definitiva.

---
*Documentação técnica autoritativa v2.0.*
