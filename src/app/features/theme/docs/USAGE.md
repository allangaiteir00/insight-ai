# Guia de Uso: Customização Estética (Theme Engine)

O sistema de temas permite transformar completamente o visual da aplicação em segundos. Este guia explica como tirar o máximo proveito das ferramentas de customização.

## 1. Utilizando a Galeria de Presets

A galeria fornece combinações pré-configuradas:
- **Seleção Direta**: Ao clicar em um card da galeria, o `ThemeService.updateTheme()` é invocado, aplicando as mudanças instantaneamente.
- **Interoperabilidade**: Se você selecionar um preset de "Gradiente", o motor desativa automaticamente a camada de "Imagem" para evitar poluição visual.

---

## 2. Ajustes Manuais no Editor de Tema

### 2.1 Cores e Tipografia
- **Cor Primária**: Define o tom de botões, seleções e ícones ativos.
- **Fonte**: Você pode alternar entre `Inter`, `Outfit` e `Roboto`. O sistema injeta a variável `--font-family` globalmente.

### 2.2 Modificadores de Fundo (Background)
O sistema suporta quatro tipos de experiências:
1.  **Sólido**: Limpo e corporativo.
2.  **Gradiente**: Moderno e vibrante. Utilize o `gradientFrom` e `gradientTo`.
3.  **Imagem**: Alta fidelidade. Recomendado para dashboards executivos.
4.  **Padrão (Pattern)**: Texturas SVG sutis que utilizam a cor primária como traço.

---

## 3. Desenvolvedores: Aplicando o Tema no Código

Ao criar um novo componente, nunca use cores hexadecimais fixas. Siga este padrão:

```scss
.meu-componente {
  background: var(--color-surface-card);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);

  &:hover {
    background: var(--color-primary-50);
    border-color: var(--color-primary-500);
  }
}
```

### Otimização para "Glassmorphism"
Se o seu componente precisa de um efeito de transparência elegante sobre fundos complexos:

```scss
.card-glass {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  opacity: var(--glass-opacity);
}
```

---

## 4. Dicas de Design

- **Contraste**: O motor calcula o `textSecondary` automaticamente. Não force cores de texto manuais.
- **Arredondamento**: O token `--radius` afeta desde botões até os widgets do dashboard, mantendo a harmonia visual.

---
*Guia atualizado para a versão 2.0.*
