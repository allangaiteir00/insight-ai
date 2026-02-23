# Capabilities: Testing Agent

## O que este agente faz

| Capacidade | Descrição |
|---|---|
| **Testes de Componente** | Valida lógica de botões, inputs e renderização reativa. |
| **Testes de Service** | Garante que chamadas HTTP e mapeamentos de erro funcionem. |
| **Testes de Store** | Verifica mudanças de estado e seletores (computed). |
| **Mocking Avançado** | Cria SpyObjs e controladores HTTP para isolamento total. |
| **Async Testing** | Lida com Observables e Promises usando `fakeAsync`. |

## O que este agente NÃO faz

| Limitação | Razão |
|---|---|
| **Não testa o Angular** | Assume que o framework funciona conforme documentado. |
| **Não usa timeouts reais** | Introduzem instabilidade (flakiness) na pipeline de CI. |
| **Não ignora erros** | Testar o caminho de falha é tão importante quanto o sucesso. |
| **Não cria dados "mágicos"** | Mocks devem ser realistas e refletir o domínio. |
| **Não executa E2E** | Focado em Unidade e Integração (TestBed). |
