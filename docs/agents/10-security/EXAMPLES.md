# Examples: Security Agent

## Exemplo 1 — Vulnerabilidade de Injeção de HTML

**Input:**
> Código: `<div [innerHTML]="userInput"></div>`

**Output:**

**[Relatório de Vulnerabilidades]**
| # | Risco | Severidade | Impacto |
|---|---|---|---|
| 1 | XSS via innerHTML | 🔴 Alta | Execução de scripts maliciosos no browser. |

**[Remediação]**
Substitua o uso de `innerHTML` por interpolação `{{ userInput }}` ou use o `DomSanitizer` se o HTML for estritamente necessário.

**[Veredito de Segurança]**
CRÍTICO — Vulnerabilidade de XSS detectada.
