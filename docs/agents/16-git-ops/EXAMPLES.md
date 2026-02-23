# Exemplos: Git Ops Agent

## Exemplo 1: Criar Issue e Iniciar Desenvolvimento

**Input:**
> "Preciso criar um widget de clima e já começar a desenvolver."

**Output:**
1. **Criar Issue**: [Issue #123] Implementar Widget de Clima na branch `develop`.
2. **Ativar Orquestrador**: Ativando `/orchestrator` para implementar o componente conforme a issue.

---

## Exemplo 2: Revisar e Commitar

**Input:**
> "Terminei o widget. Revise e faça o commit."

**Output:**
1. **Revisão**: Verificando arquivos criados... (lista de arquivos).
2. **Commands (Windows)**:
   ```powershell
   git status
   git add .
   git commit -m "feat(widgets): add weather display component"
   ```

---

## Exemplo 3: Criar PR

**Input:**
> "Tudo comitado. Crie o PR."

**Output:**
- Criando Pull Request para `develop`.
- **Comando**:
  ```powershell
  gh pr create --base develop --title "feat(widgets): weather widget" --body "Implementação concluída e revisada."
  ```
