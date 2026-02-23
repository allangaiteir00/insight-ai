# Feature: Entity Management

O motor de Gestão de Entidades é responsável por definir, validar e persistir a estrutura de dados central da aplicação.

## 📄 Índice de Documentação

Aprofunde-se no motor de dados:

1.  **[Detalhamento Técnico (TECHNICAL.md)](file:///c:/Users/allangaiteiro/Documents/projetos/insight-ai/src/app/features/entity-management/docs/TECHNICAL.md)**:
    - Arquitetura do Schema Engine.
    - Gestão de estado reativo com `_recordsMap`.
    - Lógica de Optimistic Updates e Mocks.

2.  **[Guia de Uso (USAGE.md)](file:///c:/Users/allangaiteiro/Documents/projetos/insight-ai/src/app/features/entity-management/docs/USAGE.md)**:
    - Como criar e configurar novas entidades.
    - Melhores práticas de modelagem.
    - Manipulação de dados via `EntityDataService`.

3.  **[Representação Visual (VISUAL.md)](file:///c:/Users/allangaiteiro/Documents/projetos/insight-ai/src/app/features/entity-management/docs/VISUAL.md)**:
    - Fluxo do Schema para a UI.
    - Ciclo de vida da transação de dados.

---

## 🚀 Status da Feature: **CONSOLIDADO (v2.0)**

- [x] Registro centralizado de metadados.
- [x] CRUD reativo in-memory com Signals.
- [x] Suporte a relacionamentos One-to-Many.
- [x] Injeção dinâmica em Widgets (Gantt, Kanban, Tabelas).
- [x] Documentação exaustiva no padrão robusto.

---
*A base sólida para um sistema Metadata-Driven.*
