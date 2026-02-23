# Documentação Técnica Exaustiva: Theme Engine

O motor de temas do InsightAI é um sistema de design dinâmico baseado em **CSS Variables** e **Angular Signals**, projetado para fornecer personalização estética imediata sem recarregamento de página.

## 1. Arquitetura do Motor (Macro-to-Micro)

O sistema opera em três níveis de abstração:

### 1.1 Camada de Persistência e Sinal (`ThemeService`)
Localizado em `src/app/core/services/theme.service.ts`, o serviço é a fonte da verdade:
- **Reactive State**: Utiliza um `signal<ThemeConfig>` que é sincronizado com o `localStorage`.
- **Efeito Global**: Um `effect()` monitora o signal e invoca `applyTheme()`, que injeta as variáveis no `:root` do documento.
- **Glassmorphism Logic**: Calcula automaticamente opacidades e blurs baseado no tipo de fundo para garantir legibilidade (ex: `--glass-bg`).

### 1.2 Sistema de Renderização em Camadas (Layered Rendering)
Diferente de sistemas simples, o InsightAI utiliza um modelo de **3 camadas independentes** injetadas via CSS:

1.  **Base Layer (`--bg-base`)**: Cor sólida ou Gradiente Linear.
2.  **Media Layer (`--bg-media`)**: Imagens de fundo complexas.
3.  **Pattern Layer (`--bg-pattern`)**: Máscaras SVG repetitivas.

O `BackgroundRendererComponent` renderiza estas camadas simultaneamente, permitindo que um padrão SVG seja sobreposto a um gradiente, criando profundidade visual rica.

### 1.3 Geração Dinâmica de Tons (Shade Engine)
O método `generateColorShades()` utiliza a função nativa `color-mix` do CSS para gerar uma paleta completa (50-900) a partir de uma única cor primária. Isso garante que componentes de terceiros ou bibliotecas de UI tenham sempre tons compatíveis disponíveis.

---

## 2. Detalhamento Técnico das Variáveis CSS

O motor injeta as seguintes tokens de alta fidelidade:

| Variável | Origem | Lógica de Cálculo |
| :--- | :--- | :--- |
| `--color-primary` | `theme.primary` | Cor base para toda a identidade. |
| `--color-border` | Dinâmico | `color-mix` entre o texto e transparência (10%). |
| `--is-custom-bg` | Flag | `1` se o fundo não for sólido, usado para ativar efeitos de vidro. |
| `--bg-pattern` | SVG Injector | O motor substitui o hex do SVG via string manipulation em runtime para casar com a cor primária. |

---

## 3. Integração com Componentes (Theming Contract)

Todos os componentes do sistema devem respeitar o contrato de variáveis:
- **Cores**: Devem usar `var(--color-surface-card)` em vez de `white`.
- **Bordas**: Devem usar `var(--color-border)` para auto-ajuste entre temas claros/escuros.
- **Efeitos**: Devem aplicar `backdrop-filter: blur(var(--glass-blur))` quando o `is-custom-bg` for ativo.

---

## 4. Extensibilidade: Adicionando Novos Presets

Para registrar um novo tema "Out-of-the-box":
1.  Defina o objeto `ThemeConfig` no `theme-gallery.component.ts`.
2.  O motor resolverá automaticamente os gradientes e tons de contraste baseados no `backgroundType` escolhido.

---
*Documentação técnica oficial v2.0.*
