# Representação Visual: Theme Architecture

Diagramas detalhando a injeção de tokens e o sistema de renderização em camadas.

## 1. Fluxo de Injeção de Variáveis (Runtime Path)

```mermaid
sequenceDiagram
    participant U as Usuário
    participant S as ThemeService (Signal)
    participant R as root (document.documentElement)
    participant C as Componentes (Global)

    U->>S: Atualiza Config (updateTheme)
    S->>S: Dispara effect()
    S->>S: Calcula Shades & Contrast
    S->>R: Injeta root.style.setProperty(...)
    R->>C: CSS Variables se propagam instantaneamente
```

---

## 2. Composição do Background (Layer Stack)

O sistema de camadas permite combinações infinitas. A ordem de renderização (Z-Index lógico) é:

```mermaid
graph BT
    L1[Camada 1: Base Color/Gradient] --> L2[Camada 2: Media Image]
    L2 --> L3[Camada 3: Pattern SVG Mask]
    L3 --> L4[Camada 4: Particles Effect]
    L4 --> L5[Conteúdo da Aplicação]

    subgraph "Engine de Renderização"
        L1
        L2
        L3
        L4
    end
```

---

## 3. Árvore de Decisão de Estilo (Logic Flow)

```mermaid
graph TD
    A[Theme Change] --> B{Possui Imagem?}
    B -- Sim --> C[Ativa Layer Media]
    B -- Não --> D{Possui Gradiente?}
    
    D -- Sim --> E[Gera Linear Gradient]
    D -- Não --> F[Aplica Solid Color]
    
    C --> G[Ativa Modo Glassmorphism]
    E --> G
    
    G --> H[Injeta Blur & Opacidade nos Cards]
    H --> I[Aplicação Finalizada]
```

---
**Este documento demonstra a complexidade técnica por trás da simplicidade visual do InsightAI.**
