# Representação Visual Exaustiva: Workspace Engine

Este documento apresenta os fluxos de dados e as estruturas de classe que compõe o motor de Workspace.

## 1. Arquitetura de Fluxo de Dados (Data Flow)

O diagrama abaixo ilustra como as configurações do `WorkspaceStore` são destiladas até a renderização do widget final.

```mermaid
sequenceDiagram
    participant S as WorkspaceStore (Signal)
    participant C as WorkspaceContainer (GridStack)
    participant D as WidgetDisplay (Proxy)
    participant F as EntityWidget (Dispatcher)
    participant W as Concrete Widget (Gantt/Chart/etc)

    S->>C: Emite lista de widgets [_widgets()]
    C->>C: Sincroniza GridStack DOM
    C->>D: Renderiza app-widget-display
    D->>D: Resolve Data Strategy (API vs EntityService)
    D->>F: Repassa metadados e dados resolvidos
    F->>W: Instancia componente específico (@switch)
    W-->>D: Emite ações (edit/remove)
    D-->>S: Atualiza Configuração/Estado
```

---

## 2. Barramento de Interação (Event Bus Interaction)

Diagrama de sequência demonstrando um fluxo Master-Detail entre uma Tabela e um Formulário.

```mermaid
sequenceDiagram
    participant T as TableWidget (Source)
    participant B as PageInteractionService (Bus)
    participant F as FormWidget (Target)
    participant D as EntityDataService (Persistence)

    T->>T: Clique na Linha (item.id)
    T->>B: Emitir 'recordSelected' {payload: ID}
    B->>F: Notifica inscritos (InteractionEvent)
    F->>F: Captura ID e busca no EntityDataService
    D-->>F: Retorna Objeto Registro
    F->>F: Patchea Reactive Form
    Note over F: Usuário edita e salva
    F->>D: updateRecord(ID, data)
    D-->>B: Emitir 'dataChanged'
    B-->>T: Refresh automático via Signal
```

---

## 3. Hierarquia de Componentes (Logical Structure)

```mermaid
graph TD
    A[WorkspaceContainer] --> B[EditorToolbar]
    A --> C[GridStack Item]
    C --> D[WidgetDisplay]
    D --> E[WidgetHeader]
    D --> F[WidgetContent]
    F --> G[EntityWidget Dispatcher]
    
    G --> H1[ChartDisplay]
    G --> H2[GanttWidget]
    G --> H3[KanbanWidget]
    G --> H4[TableWidget]
    G --> H5[MetricWidget]
    G --> H6[FormWidget]
    G --> H7[FilterWidget]
    G --> H8[MapWidget]
    G --> H9[CalendarWidget]

    subgraph "Core Services"
        S1[WorkspaceStore]
        S2[PageInteractionService]
        S3[EntityDataService]
    end

    D -.-> S1
    H3 -.-> S2
    H6 -.-> S3
```

---

## 4. Ciclo de Vida do Widget (Config to Render)

```mermaid
stateDiagram-v2
    [*] --> Discovered: Metadata Constants
    Discovered --> Configured: Editor Modal
    Configured --> Persisted: WorkspaceStore
    Persisted --> GridSync: Container effect()
    GridSync --> DataFetching: WidgetDisplay
    DataFetching --> Rendered: Factory Dispatcher
    Rendered --> Interactive: Interaction Bus
```

---
**Diagramas gerados para a versão 2.0 do motor.**
