# Guia de Uso: Gestão de Dados (Entity Management)

Este guia explica como configurar e gerenciar as estruturas de dados fundamentais do sistema.

## 1. Criando uma Nova Entidade

Para criar uma estrutura (ex: "Inventário"):
1.  Acesse a tela de **Gestão de Entidades**.
2.  Clique em **+ Nova Entidade**.
3.  Defina o nome interno (`inventory`) e o label de exibição ("Controle de Estoque").
4.  Adicione os campos necessários:
    - `nome` (string)
    - `quantidade` (number)
    - `status` (select: Disponível, Em Falta)

---

## 2. Configurando o Engine de Visualização

Após definir a entidade, ela torna-se disponível globalmente no Workspace:
- **Filtro Automático**: Ao adicionar um widget de Filtro, selecione sua nova entidade. O sistema lerá os campos e criará os inputs de pesquisa automaticamente.
- **Formulário Reativo**: O widget de Formulário gerará todos os campos de edição baseados no seu esquema, sem necessidade de escrever uma linha de HTML.

---

## 3. Melhores Práticas de Modelagem

- **IDs de Entidade**: Use nomes no plural e em minúsculas (ex: `projects`, `leads`).
- **Campos Obrigatórios**: Marque como `required` apenas o essencial para evitar fricção na entrada de dados.
- **Relacionamentos**: Use o tipo `relation` para vincular entidades (ex: vincular uma `Tarefa` a um `Projeto`).

---

## 4. Desenvolvedores: Manipulando Dados via Código

Para interagir com os dados de uma entidade programaticamente, use o `EntityDataService`:

```typescript
// Adicionando um registro
this.dataService.addRecord('tasks', { title: 'Nova Task', status: 'todo' });

// Buscando dados reativos
const tasks = this.dataService.getRecords('tasks')();
```

---
*Este guia é a base para a operação de dados no InsightAI.*
