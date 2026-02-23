# Documentação Técnica Exaustiva: Workspace & Widgets

O ecossistema de Workspace do InsightAI é um motor de visualização dinâmica e orquestração de dados de alta fidelidade, operando sobre uma arquitetura reativa moderna orientada a metadados.

## 1. Arquitetura do Sistema (Macro-to-Micro)

### 1.1 Camada de Orquestração (Container & Grid)
A peça central é o `WorkspaceContainerComponent`, que gerencia o ciclo de vida do layout:
- **GridStack.js Engine**: Utiliza a v10 do GridStack para orquestrar a grade 12-colunas. O container sincroniza o estado via `effect()` do Angular 17. Quando o `WorkspaceStore` emite novos widgets, o container invoca `grid.makeWidget()` dinamicamente.
- **Detecção de Mutação**: Escuta o evento `change` do GridStack. Sempre que um widget é movido ou redimensionado, o container extrai as coordenadas e invoca `store.updateWidgetPosition()`, garantindo que o layout seja persistente.
- **Reflow de Gráficos**: Possui um delay estratégico de 100ms (`CHART_RESIZE_DELAY_MS`) para disparar eventos globais de `resize`, permitindo que componentes baseados em Canvas/SVG (ECharts, Leaflet) recalculem seu aspect-ratio sem flickering.

### 1.2 Gestão de Estado (Store & Signals)
O `WorkspaceStore` (`services/workspace-store.service.ts`) isola a lógica de negócio da visualização:
- **Signals Reativos**: Mantém `_activeVersion`, `_mode` (viewer/editor) e `_editingWidget` como signals privados.
- **Versionamento Híbrido**: O método `loadDashboard` tenta buscar versões do backend via `DashboardApiService`. Em caso de falha de rede, o sistema entra em modo **Local Persistence Fallback**, gerando uma versão `v-local` estável para não interromper a UX.
- **Imutabilidade**: Todas as mutações de lista de widgets utilizam spread operators para garantir que os Signals propaguem as mudanças corretamente através da árvore de componentes.

---

## 2. Estratégias de Dados e Sincronização

O `WidgetDisplayComponent` atua como o **Data Proxy** para todos os widgets. Ele implementa uma estratégia de resolução de dados em árvore:

1.  **Prioridade Entidade**: Se `entityId` estiver configurado, ele ignora `dataUrl` e se conecta ao `EntityDataService`.
2.  **Mapeamento em Tempo Real**: O componente utiliza `computed()` para mapear o `entitySource` (dados puros da entidade) para o formato esperado pelo widget (ex: rótulo/valor para gráficos).
3.  **Filtros Contextuais**: Escuta o `PageInteractionService` para capturar eventos de filtragem. Ao receber um `filterApplied`, o `computedState` revalida e recarrega os dados aplicando os predicados de filtro localmente ou via parâmetros de URL na API.
4.  **Hierarquia Master-Detail**: Detecta seleções de registros irmãos via `onRecordSelected`. Se houver relação de chave estrangeira entre a entidade do widget e a entidade selecionada, o widget aplica um auto-filtro para exibir apenas dados relacionados.

---

## 3. Catálogo Técnico de Widgets (Deep Dive)

### 3.1 Gráficos Avançados (`ChartDisplayComponent`)
Motor baseado em **ECharts** com integração profunda de Design Tokens:
- **Token Bridge**: O método `readTokens()` extrai variáveis CSS (`--color-primary`, `--color-text-primary`) diretamente do DOM em runtime, garantindo que os gráficos mudem de cor instantaneamente ao trocar o tema do sistema.
- **Modo Demo (Mocking)**: Quando não há URL de dados, o componente injeta `generateMockData()`, produzindo séries temporais realistas para visualização prévia.
- **Mapeamentos Dinâmicos**: Transforma objetos complexos em arrays categóricos ECharts usando os `mappings` definidos no `WidgetConfig`.

### 3.2 Gantt Enterprise (`GanttWidgetComponent`)
- **Implementação**: Custom wrapper sobre motor de Gantt SVG.
- **WBS (Work Breakdown Structure)**: Converte arrays de registros em estruturas `parentId/children` vinculadas.
- **Interatividade**: Escala dinâmica (Dia, Semana, Mês) via `signal` interno que altera a viewport do motor de renderização.

### 3.3 Kanban Transacional (`KanbanWidgetComponent`)
- **Drag & Drop**: Utiliza `Angular CDK DragDrop`.
- **Transacional**: Não apenas altera a UI; ao soltar (drop), invoca o `EntityDataService.updateRecord`. Se a operação falhar, a UI reverte o estado (Optimistic UI Pattern).
- **Auto-Gerenciamento**: Identifica automaticamente campos do tipo `select` na entidade para definir as colunas de status.

### 3.4 Formulários Dinâmicos (`FormWidgetComponent`)
- **Reactive Forms Generator**: Reconstrói o `FormGroup` sempre que o `EntityDefinition` muda.
- **Modos Híbridos**: Detecta se está em "Modo Criação" ou "Modo Edição" via presença de `selectedRecordId` no barramento de eventos.
- **Persistence Bus**: Dispara `dataChanged` após salvar, permitindo que Tabelas e Widgets de Métrica se atualizem sem recarregar a página.

### 3.5 Mapa Geográfico (`MapWidgetComponent`)
- **Leaflet Integration**: Engine de mapas OpenSource.
- **Clusterização Implícita**: Utiliza `fitBounds` para enquadrar marcadores dinamicamente baseados na geo-localização (Lat/Lng) mapeada da entidade.

---

## 4. Fluxo de Extensibilidade (Novos Widgets)

Para adicionar um novo widget, o desenvolvedor deve seguir o protocolo de 4 passos:
1.  **Modelo**: Adicionar o novo tipo em `WidgetType` (`dashboard.model.ts`).
2.  **Metadados**: Registrar ícone, categoria e labels em `widget-metadata.constants.ts`.
3.  **Implementação**: Criar o componente em `shared/widgets/` aceitando os inputs padrão (`config`, `entity`, `data`).
4.  **Dispatcher**: Registrar o novo caso no `@switch` do `EntityWidgetComponent`.

---
*Este documento é a autoridade técnica final para a implementação do Workspace v2.0.*
