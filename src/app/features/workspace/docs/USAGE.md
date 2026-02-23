# Guia de Uso Exaustivo: Workspace & Widgets

Este guia fornece instruções detalhadas e exemplos de código para configurar e consumir os recursos do Workspace e seus Widgets.

## 1. Configuração de Widgets no Editor

O `WidgetEditorComponent` permite configurar o comportamento de cada componente. Abaixo estão os parâmetros detalhados por categoria:

### 1.1 Widgets de Entidade (Data-Driven)
Para qualquer widget conectado a uma entidade, os campos obrigatórios são:
- **Entidade Alvo**: Seleção da entidade (ex: `Tasks`, `Customers`).
- **Data URL**: (Opcional) URL para override de endpoint REST.
- **Mappings**: De-para entre as colunas da entidade e os eixos do widget.

#### Exemplo de Mapeamento (Gantt):
```json
{
  "title": "task_name",
  "startDate": "start_date",
  "endDate": "due_date"
}
```

---

## 2. Exemplos de Consumo Individual

### 2.1 Kanban Widget
O Kanban exige um campo do tipo `select` para criar as colunas.
- **Configuração**: Escolha o `statusFieldKey`.
- **Interação**: Arrastar um card dispara automaticamente um `updateRecord` no banco de dados através do service transacional.

### 2.2 Tabela Dinâmica
- **Display Fields**: Você pode selecionar exatamente quais colunas exibir.
- **Ordenação**: Clique no cabeçalho. O estado de ordenação é mantido localmente via `signal`.
- **Seleção**: Clicar em uma linha emite um evento global `recordSelected`.

### 2.3 Gráficos (Charts)
O `ChartDisplayComponent` suporta múltiplos tipos via string:
- `chart-line`, `chart-bar`, `chart-area`, `chart-pie`, `chart-heatmap`, `chart-boxplot`, `chart-mixed`.
- **Theme Sync**: O gráfico detecta o tema `light` ou `dark` do sistema e ajusta as cores das fontes e grid automaticamente.

---

## 3. Implementando Lógica de Interação (Master-Detail)

Para criar uma página onde uma **Tabela** filtra um **Formulário**, siga este padrão:

1. Adicione um widget de **Tabela** configurado para a entidade `Pedidos`.
2. Adicione um widget de **Formulário** configurado para a mesma entidade `Pedidos`.
3. **Fluxo Automático**:
   - Quando o usuário clica em um item na Tabela, o bus emite `{ type: 'recordSelected', payload: 'ID_DO_PEDIDO' }`.
   - O Formulário, que está escutando o mesmo canal, captura o ID e invoca `loadRecord()`.
   - Os dados são carregados e o formulário entra em modo edição instantaneamente.

---

## 4. Troubleshooting e Dicas

### O Widget não exibe dados?
1. Verifique se o `entityId` está mapeado corretamente.
2. Certifique-se de que existem registros carregados no `EntityDataService`.
3. Confira os **Mappings**: se o gráfico espera um campo `value` e sua entidade usa `faturamento`, você deve mapear `value -> faturamento` no editor.

### O Layout do GridStack quebrou?
- Entre no modo Editor.
- Redimensione o widget manualmente.
- O sistema salvará as novas coordenadas `gs-w` e `gs-h` no Store.

---
**Este guia deve ser seguido para garantir a consistência de implementação no Workspace.**
