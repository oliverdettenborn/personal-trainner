# Spec — Acompanhamento Físico (Pixel-Perfect React Native Web)

> Referência visual: `docs/avaliacao-fisica/acompanhamento_fisico.html`
> Target: React Native Web (Expo Router) com Atomic Design
> Tema: **dark-only** — não há light mode

---

## 1. Design Tokens (CSS Variables → React Native)

Todas as cores já estão mapeadas em `src/theme/colors.ts` (key `dark`). Usar **exclusivamente** esses tokens.

| CSS Variable     | Token RN             | Hex       |
|------------------|----------------------|-----------|
| `--gold`         | `gold`               | `#C9963A` |
| `--gold-light`   | `goldLight`          | `#E4B96A` |
| `--gold-dark`    | `goldDark`           | `#8B6520` |
| `--bg`           | `background`         | `#0e0e0e` |
| `--bg2`          | `backgroundSecondary`| `#181818` |
| `--bg3`          | `backgroundTertiary` | `#222222` |
| `--bg4`          | `backgroundQuaternary`| `#2a2a2a`|
| `--border`       | `border`             | `#3a3020` |
| `--border-gold`  | `borderGold`         | `#5a4010` |
| `--text`         | `text`               | `#e8e0d0` |
| `--text2`        | `text2`              | `#a89878` |
| `--text3`        | `text3`              | `#6a5a40` |
| `--danger`       | `danger`             | `#c04040` |
| `--success`      | `success`            | `#3a8a3a` |
| `--info`         | `info`               | `#2a6a9a` |

### Cores extras usadas inline no HTML (não estão no token, adicionar ou usar literal)

| Uso                          | Hex           |
|------------------------------|---------------|
| Panel icon green bg          | `#1a3020`     |
| Panel icon green border      | `#2a6040`     |
| Panel icon amber bg          | `#302010`     |
| Panel icon amber border      | `#604020`     |
| Panel icon red bg            | `#301010`     |
| Panel icon red border        | `#602020`     |
| Panel dot amber              | `#c08030`     |
| Panel dot red                | `#a03030`     |
| Meta section bg              | `#1a1408`     |
| Meta textarea bg             | `#120f05`     |
| Btn danger border            | `#6a2020`     |
| Btn danger text              | `#c08080`     |
| Active assessment item bg    | `#2a2010`     |
| Template header gradient top | `#1a1408`     |

### Tipografia

- **Font family:** `'Segoe UI', Arial, sans-serif` — no React Native Web, usar `fontFamily: 'System'` (default) que mapeia para Segoe UI no Windows.
- **Base font size:** `14px`
- **Não usar rem/em** — todos os valores são `px` no HTML, converter para números no RN.

---

## 2. Layout Geral — Três Zonas

```
┌────────────────────────────────────────────────────┐
│                    APP HEADER                       │  height: auto (padding: 12px 20px)
├───────────┬────────────────────────────────────────┤
│           │                                        │
│  SIDEBAR  │            MAIN CONTENT                │
│  230px    │            flex: 1                      │
│           │            padding: 20px                │
│           │                                        │
│           │  ┌──────────────────────────┐          │
│           │  │      ACTION BAR          │          │
│           │  ├──────────────────────────┤          │
│           │  │      TEMPLATE CARD       │          │
│           │  │      max-width: 900px    │          │
│           │  │      margin: 0 auto      │          │
│           │  └──────────────────────────┘          │
└───────────┴────────────────────────────────────────┘
```

- `app-body`: `flexDirection: 'row'`, `minHeight: 'calc(100vh - 57px)'`
- `sidebar`: `width: 230`, fixed left, `backgroundColor: backgroundSecondary`, `borderRightWidth: 1`, `borderRightColor: border`
- `main-content`: `flex: 1`, `padding: 20`, scroll vertical

---

## 3. Componentes — Anatomia Detalhada

### 3.1 AppHeader

```
[ACOMPANHAMENTO FÍSICO]  [Select Aluno ▾]  [+ Aluno]  [Remover aluno]  [Importar JSON]
```

| Propriedade              | Valor                                        |
|--------------------------|----------------------------------------------|
| background               | `backgroundSecondary` (#181818)              |
| borderBottom             | `1px solid borderGold` (#5a4010)             |
| padding                  | `12px 20px`                                  |
| flexDirection            | `row`                                        |
| alignItems               | `center`                                     |
| gap                      | `16px`                                       |
| flexWrap                 | `wrap`                                       |

**Título:**
- "ACOMPANHAMENTO" → `color: gold`, "FÍSICO" → `color: text`
- `fontSize: 18`, `fontWeight: 700`, `letterSpacing: 1`

**Select aluno:**
- `backgroundColor: backgroundTertiary`, `borderColor: borderGold`, `borderWidth: 1`, `borderRadius: 6`
- `color: text`, `padding: '6px 10px'`, `fontSize: 13`, `minWidth: 180`
- Focus: `borderColor: gold`

**Botões header:**
- `btn-gold`: `backgroundColor: gold`, `color: #0e0e0e`, `fontWeight: 600`, `fontSize: 13`, `padding: '6px 14px'`, `borderRadius: 6`
- `btn-outline`: `backgroundColor: transparent`, `borderWidth: 1`, `borderColor: borderGold`, `color: gold`
- `btn-outline:hover`: `borderColor: gold`
- `btn-sm`: `padding: '4px 10px'`, `fontSize: 12`
- `btn-danger`: `backgroundColor: transparent`, `borderWidth: 1`, `borderColor: #6a2020`, `color: #c08080`

---

### 3.2 Sidebar

| Propriedade   | Valor                                  |
|---------------|----------------------------------------|
| width         | `230`                                  |
| backgroundColor | `backgroundSecondary`                |
| borderRight   | `1px solid border`                     |
| padding       | `16px 12px`                            |
| flexDirection | `column`                               |
| gap           | `8px`                                  |

**Sidebar title:** `fontSize: 11`, `fontWeight: 700`, `color: text3`, `textTransform: uppercase`, `letterSpacing: 1`, `marginBottom: 4`

**Assessment list:** `flexDirection: column`, `gap: 4`, `flex: 1`, `overflowY: auto`

**Assessment item:**
- `backgroundColor: backgroundTertiary`, `borderWidth: 1`, `borderColor: border`, `borderRadius: 6`, `padding: '8px 10px'`
- Hover: `borderColor: borderGold`
- **Active:** `borderColor: gold`, `backgroundColor: #2a2010`
- `.a-date`: `fontSize: 12`, `color: gold`, `fontWeight: 600`
- `.a-student`: `fontSize: 11`, `color: text2`, `marginTop: 2`
- `.a-weight`: `fontSize: 11`, `color: text3`

**Botão "+ Nova avaliação":** `btn-gold` (full width dentro da sidebar)

**Empty state sidebar:** `color: text3`, `fontSize: 12`, `textAlign: center`, `padding: '20px 0'`

---

### 3.3 Empty State (Main Content)

Quando nenhuma avaliação está selecionada:

- `flexDirection: column`, `alignItems: center`, `justifyContent: center`, `gap: 12`, `padding: '60px 20px'`
- SVG icon: `48x48`, `fill: text3`, `opacity: 0.4`
- Text: `fontSize: 13`, `color: text3`
- Mensagem: "Selecione um aluno e crie uma avaliação para começar."

---

### 3.4 Action Bar

```
[Salvar]  [Imprimir / PDF]  [Importar JSON]          [● Salvo]  [Excluir avaliação]
└─── left ──────────────────────────────┘             └─── right ──────────────────┘
```

| Propriedade   | Valor                        |
|---------------|------------------------------|
| flexDirection | `row`                        |
| gap           | `8px`                        |
| marginBottom  | `16px`                       |
| alignItems    | `center`                     |
| flexWrap      | `wrap`                       |
| maxWidth      | `900`                        |
| margin        | `0 auto 16px`                |

**Status indicator:**
- `fontSize: 12`, `color: text3`, `flexDirection: row`, `alignItems: center`, `gap: 6`
- Dot saved: `width: 8`, `height: 8`, `borderRadius: 4`, `backgroundColor: success` (#3a8a3a)
- Dot unsaved: mesma coisa mas `backgroundColor: gold` (#C9963A) com animação pulse (opacity 1→0.4→1, 1.5s infinite)

---

### 3.5 Template Card

Container principal da ficha de avaliação.

| Propriedade     | Valor                                |
|-----------------|--------------------------------------|
| backgroundColor | `backgroundSecondary` (#181818)      |
| borderWidth     | `1`                                  |
| borderColor     | `borderGold` (#5a4010)               |
| borderRadius    | `10`                                 |
| overflow        | `hidden`                             |
| maxWidth        | `900`                                |
| margin          | `0 auto`                             |

---

### 3.6 Template Header (dentro do Card)

```
     ACOMPANHAMENTO FÍSICO
  EVOLUÇÃO | DISCIPLINA | CONSISTÊNCIA
```

| Propriedade     | Valor                                |
|-----------------|--------------------------------------|
| textAlign       | `center`                             |
| padding         | `20px 16px 12px`                     |
| borderBottom    | `1px solid borderGold`               |
| background      | `linear-gradient(180deg, #1a1408 0%, #181818 100%)` |

- **Título:** `fontSize: 26`, `fontWeight: 900`, `letterSpacing: 3`, `textTransform: uppercase`
  - "ACOMPANHAMENTO" → `color: text` (#e8e0d0)
  - "FÍSICO" → `color: gold` (#C9963A)
- **Subtítulo:** `fontSize: 11`, `color: text3`, `letterSpacing: 3`, `marginTop: 4`, `textTransform: uppercase`
  - "EVOLUÇÃO | DISCIPLINA | CONSISTÊNCIA" — os `|` são separadores literais com `\u00A0` (non-breaking space) ao redor

> **RN Web:** Para `linear-gradient`, usar `{ background: 'linear-gradient(180deg, #1a1408 0%, #181818 100%)' }` no style (funciona em web via react-native-web).

---

### 3.7 Section Label

Badge centralizado que identifica "Frente" ou "Costas".

```
                    ┌──────────┐
─────────────────── │  FRENTE  │ ───────────────────
                    └──────────┘
```

| Propriedade (container) | Valor                                    |
|-------------------------|------------------------------------------|
| textAlign               | `center`                                 |
| padding                 | `8px 16px`                               |
| backgroundColor         | `backgroundTertiary` (#222222)           |
| borderBottom            | `1px solid borderGold`                   |
| borderTop               | `1px solid borderGold`                   |

| Propriedade (badge span) | Valor                                   |
|--------------------------|------------------------------------------|
| backgroundColor          | `backgroundQuaternary` (#2a2a2a)        |
| borderWidth              | `1`                                     |
| borderColor              | `borderGold`                            |
| color                    | `gold`                                  |
| fontSize                 | `13`                                    |
| fontWeight               | `700`                                   |
| letterSpacing            | `2`                                     |
| padding                  | `4px 24px`                              |
| borderRadius             | `20`                                    |
| textTransform            | `uppercase`                             |

---

### 3.8 Photo Section (o "spread" Antes/Depois)

Layout em grid de 4 colunas:

```
┌──────────┬───────────────┬───────────────┬──────────┐
│ Side Info│   Photo Col   │   Photo Col   │ Side Info│
│  160px   │   flex: 1     │   flex: 1     │  160px   │
│ (ANTES)  │   (ANTES)     │   (DEPOIS)    │ (DEPOIS) │
└──────────┴───────────────┴───────────────┴──────────┘
```

| Propriedade        | Valor                                |
|--------------------|--------------------------------------|
| display (web)      | `grid`                               |
| gridTemplateColumns| `160px 1fr 1fr 160px`                |
| gap                | `0`                                  |
| padding            | `16`                                 |
| backgroundColor    | `backgroundSecondary`                |

> **RN Web:** Usar `display: 'grid'` via style prop no web. Para compatibilidade, implementar com `flexDirection: 'row'` e widths fixos/flex como fallback.

**Existem 2 instâncias:** "Frente" e "Costas", com medidas diferentes:
- **Frente:** Ombros + Cintura
- **Costas:** Ombros + Coxas

#### 3.8.1 Side Info (coluna lateral de dados)

`width: 160`, `flexDirection: column`, `gap: 10`, `padding: '0 10px'`

**Campo Data:**
- Label: `fontSize: 10`, `fontWeight: 700`, `color: text3`, `textTransform: uppercase`, `letterSpacing: 1`
- Input (date): `backgroundColor: backgroundTertiary`, `borderWidth: 1`, `borderColor: border`, `borderRadius: 4`, `padding: '5px 8px'`, `color: text`, `fontSize: 13`, `width: '100%'`
- Focus: `borderColor: gold`

**Campo Peso:**
- Mesma estrutura do campo Data, mas `type: text`, `placeholder: "0,0 kg"`

**Measurement Row:**

```
┌──────┐
│  🔵  │  OMBROS
│      │  __ cm
└──────┘
```

| Propriedade (row)   | Valor                                |
|---------------------|--------------------------------------|
| flexDirection       | `row`                                |
| alignItems          | `center`                             |
| gap                 | `6`                                  |

| Propriedade (icon circle) | Valor                            |
|---------------------------|----------------------------------|
| width                     | `28`                             |
| height                    | `28`                             |
| borderWidth               | `1`                              |
| borderColor               | `borderGold`                     |
| borderRadius              | `14` (50%)                       |
| alignItems                | `center`                         |
| justifyContent            | `center`                         |

| Propriedade (SVG icon)  | Valor                              |
|-------------------------|--------------------------------------|
| width                   | `14`                                 |
| height                  | `14`                                 |
| fill                    | `gold`                               |

| Propriedade (label)   | Valor                                |
|-----------------------|--------------------------------------|
| fontSize              | `9`                                  |
| color                 | `text3`                              |
| textTransform         | `uppercase`                          |
| letterSpacing         | `1`                                  |

| Propriedade (input)   | Valor                                |
|-----------------------|--------------------------------------|
| backgroundColor       | `transparent`                        |
| borderWidth           | `0`                                  |
| borderBottomWidth     | `1`                                  |
| borderBottomColor     | `borderGold`                         |
| color                 | `text`                               |
| fontSize              | `12`                                 |
| width                 | `100%`                               |
| padding               | `2px 0`                              |
| Focus: borderColor    | `gold`                               |

**Side Info DEPOIS (lado direito):** Idêntico ao esquerdo, mas:
- `textAlign: right` no container
- Measurement rows: ordem invertida — `[info, icon]` em vez de `[icon, info]`
- Input do measurement: `textAlign: right`
- `.measure-info`: `alignItems: flex-end`

#### 3.8.2 Photo Column

`flexDirection: column`, `gap: 8`, `alignItems: center`

**Photo label tag:**
- `fontSize: 11`, `fontWeight: 700`, `color: text2`, `letterSpacing: 2`, `textTransform: uppercase`
- Texto: "ANTES" ou "DEPOIS"

**Photo Slot:**

| Propriedade      | Valor                                      |
|------------------|--------------------------------------------|
| width            | `100%`                                     |
| aspectRatio      | `3/4` (0.75)                               |
| backgroundColor  | `backgroundTertiary`                       |
| borderWidth      | `1`                                        |
| borderStyle      | `dashed`                                   |
| borderColor      | `borderGold`                               |
| borderRadius     | `6`                                        |
| alignItems       | `center`                                   |
| justifyContent   | `center`                                   |
| overflow         | `hidden`                                   |
| position         | `relative`                                 |

**Estado vazio (placeholder):**
- SVG camera/image icon: `24x24`, `fill: text3`
- Texto: "Clique para adicionar foto", `fontSize: 10`, `color: text3`

**Estado com foto:**
- `<Image>`: `width: '100%'`, `height: '100%'`, `position: absolute`, `top: 0`, `left: 0`, `resizeMode: cover`

**Botão remover (hover-only):**
- `position: absolute`, `top: 4`, `right: 4`
- `backgroundColor: rgba(0,0,0,0.7)`, `borderWidth: 1`, `borderColor: #555`, `color: #ccc`
- `fontSize: 10`, `padding: '2px 6px'`, `borderRadius: 4`
- **Visível apenas no hover** (web: usar `display: none` default, `:hover .photo-remove { display: block }`)

**Interação:** Pressionar o slot abre `expo-image-picker` para selecionar imagem. A imagem selecionada é exibida em base64 data URI.

---

### 3.9 Section Divider

Entre "Frente" e "Costas":

| Propriedade     | Valor               |
|-----------------|----------------------|
| height          | `1`                  |
| backgroundColor | `borderGold`         |

---

### 3.10 Bottom Panels (Feedback — 3 colunas)

```
┌───────────────────┬────────────────────┬────────────────────┐
│ ✔ Pontos          │ ⚠ Pontos          │ ⓘ Próximos         │
│   POSITIVOS       │   a MELHORAR       │   AJUSTES          │
│ ● ___________     │ ● ___________      │ ● ___________      │
│ ● ___________     │ ● ___________      │ ● ___________      │
│ ● ___________     │ ● ___________      │ ● ___________      │
│ ● ___________     │ ● ___________      │ ● ___________      │
└───────────────────┴────────────────────┴────────────────────┘
```

**Container:** `display: grid`, `gridTemplateColumns: 1fr 1fr 1fr`, `borderTopWidth: 1`, `borderTopColor: borderGold`

**Panel (cada coluna):** `padding: '14px 16px'`, `borderRightWidth: 1`, `borderRightColor: border` (último sem border)

**Panel Header:** `flexDirection: row`, `alignItems: center`, `gap: 8`, `marginBottom: 10`

**Panel Icon (circle):** `width: 22`, `height: 22`, `borderRadius: 11`

| Variante | background | borderColor | SVG fill |
|----------|------------|-------------|----------|
| green    | `#1a3020`  | `#2a6040`   | `#3a8a3a`|
| amber    | `#302010`  | `#604020`   | `#c08030`|
| red      | `#301010`  | `#602020`   | `#a03030`|

**SVG icons dos panels:**
- Green (check): `M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z`
- Amber (warning triangle): `M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z`
- Red (info circle): `M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z`

**Panel Title:** `fontSize: 11`, `fontWeight: 700`, `textTransform: uppercase`, `letterSpacing: 1`
- Parte "Pontos" / "Próximos" → cor default (text)
- Parte "Positivos" / "a Melhorar" / "Ajustes" → `color: gold`

**Panel Rows:** `flexDirection: column`, `gap: 5`

**Panel Row:** `flexDirection: row`, `alignItems: center`, `gap: 6`

**Panel Dot:** `width: 10`, `height: 10`, `borderRadius: 5`
- green: `#3a8a3a`
- amber: `#c08030`
- red: `#a03030`

**Panel Input:**
- `backgroundColor: transparent`, `borderWidth: 0`, `borderBottomWidth: 1`, `borderBottomColor: border`
- `color: text`, `fontSize: 12`, `flex: 1`, `padding: '2px 0'`
- Focus: `borderBottomColor: gold`

**Dados (data-fields):**

| Panel       | Fields                                      | Placeholder pattern         |
|-------------|---------------------------------------------|-----------------------------|
| Positivos   | `positivo_1..4`                             | "Ponto positivo 1..4"       |
| A Melhorar  | `melhorar_1..4`                             | "Ponto a melhorar 1..4"     |
| Ajustes     | `ajuste_1..4`                               | "Ajuste 1..4"               |

---

### 3.11 Bottom Info (Observações + Meta — 2 colunas)

```
┌──────────────────────────────┬──────────────────────┐
│ ⓘ Observações GERAIS         │ 👤 Próxima META       │
│ ┌──────────────────────────┐ │ ┌──────────────────┐ │
│ │ textarea                 │ │ │ textarea         │ │
│ └──────────────────────────┘ │ └──────────────────┘ │
└──────────────────────────────┴──────────────────────┘
```

**Container:** `display: grid`, `gridTemplateColumns: 3fr 2fr`, `borderTopWidth: 1`, `borderTopColor: borderGold`

#### Observações (esquerda):
- `padding: '14px 16px'`, `borderRightWidth: 1`, `borderRightColor: borderGold`

#### Meta (direita):
- `padding: '14px 16px'`, `backgroundColor: #1a1408`

**Section mini title:** `flexDirection: row`, `alignItems: center`, `gap: 8`, `fontSize: 11`, `fontWeight: 700`, `textTransform: uppercase`, `letterSpacing: 1`, `marginBottom: 8`
- SVG icon: `14x14`, `fill: gold`
- Parte destacada: `color: gold`

**SVG icons:**
- Observações (info): `M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z`
- Meta (person): `M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z`

**Textarea:**
- `backgroundColor: backgroundTertiary`, `borderWidth: 1`, `borderColor: border`, `borderRadius: 4`
- `color: text`, `fontSize: 12`, `width: '100%'`, `padding: 8`, `minHeight: 60`
- Focus: `borderColor: gold`
- Meta textarea: `minHeight: 70`, `borderColor: borderGold`, `backgroundColor: #120f05`

**Data fields:**
- `observacoes` → placeholder: "Anotações gerais sobre a avaliação..."
- `proxima_meta` → placeholder: "Meta para o próximo período..."

---

### 3.12 Template Footer

```
            Personal Caio Oliver
   Consistência é o que transforma.
```

| Propriedade     | Valor                                |
|-----------------|--------------------------------------|
| textAlign       | `center`                             |
| padding         | `14`                                 |
| borderTop       | `1px solid borderGold`               |
| backgroundColor | `backgroundTertiary`                 |

- **Nome:** `fontSize: 14`, `fontWeight: 700`, `letterSpacing: 2`, `textTransform: uppercase`
  - "Personal" → `color: text`
  - "Caio Oliver" → `color: gold`
- **Tagline:** `fontSize: 10`, `color: text3`, `letterSpacing: 2`, `marginTop: 4`, `textTransform: uppercase`
  - "Consistência é o que" → `color: text3`
  - "transforma." → `color: gold`

---

### 3.13 Modal — Novo Aluno

**Overlay:** `position: fixed/absolute`, `inset: 0`, `backgroundColor: rgba(0,0,0,0.75)`, `alignItems: center`, `justifyContent: center`, `zIndex: 100`

**Modal box:**
- `backgroundColor: backgroundSecondary`, `borderWidth: 1`, `borderColor: borderGold`, `borderRadius: 10`, `padding: 24`, `width: 340`

**Título:** `color: gold`, `fontSize: 15`, `marginBottom: 16`

**Label:** `fontSize: 12`, `color: text2`, `marginBottom: 4`

**Input:** `backgroundColor: backgroundTertiary`, `borderWidth: 1`, `borderColor: borderGold`, `color: text`, `padding: '8px 10px'`, `borderRadius: 6`, `width: '100%'`, `marginBottom: 14`, `fontSize: 13`

**Actions:** `flexDirection: row`, `gap: 8`, `justifyContent: flex-end`, `marginTop: 4`

---

## 4. Mapeamento de Dados (Assessment Model)

O model já está definido em `src/types/assessment.ts`. Todos os campos `data-field` do HTML mapeiam 1:1:

### Seção Frente
| data-field             | Tipo   | Seção             |
|------------------------|--------|-------------------|
| `frente_antes_data`    | date   | Frente > Antes    |
| `frente_antes_peso`    | text   | Frente > Antes    |
| `frente_antes_ombros`  | text   | Frente > Antes    |
| `frente_antes_cintura` | text   | Frente > Antes    |
| `frente_depois_data`   | date   | Frente > Depois   |
| `frente_depois_peso`   | text   | Frente > Depois   |
| `frente_depois_ombros` | text   | Frente > Depois   |
| `frente_depois_cintura`| text   | Frente > Depois   |

### Seção Costas
| data-field             | Tipo   | Seção             |
|------------------------|--------|-------------------|
| `costas_antes_data`    | date   | Costas > Antes    |
| `costas_antes_peso`    | text   | Costas > Antes    |
| `costas_antes_ombros`  | text   | Costas > Antes    |
| `costas_antes_coxas`   | text   | Costas > Antes    |
| `costas_depois_data`   | date   | Costas > Depois   |
| `costas_depois_peso`   | text   | Costas > Depois   |
| `costas_depois_ombros` | text   | Costas > Depois   |
| `costas_depois_coxas`  | text   | Costas > Depois   |

### Feedback Panels
| data-field     | Panel            |
|----------------|------------------|
| `positivo_1..4`| Pontos Positivos |
| `melhorar_1..4`| Pontos a Melhorar|
| `ajuste_1..4`  | Próximos Ajustes |

### Bottom Info
| data-field      | Seção           |
|-----------------|-----------------|
| `observacoes`   | Observações     |
| `proxima_meta`  | Próxima Meta    |

### Fotos
| key                  | Slot                |
|----------------------|---------------------|
| `photo_frente_antes` | Frente > Antes      |
| `photo_frente_depois`| Frente > Depois     |
| `photo_costas_antes` | Costas > Antes      |
| `photo_costas_depois`| Costas > Depois     |

---

## 5. Comportamentos & Interações

### 5.1 Persistência
- **Storage:** `AsyncStorage` (key: `caio_oliver_db`)
- **Formato:** `{ students: Record<id, Student>, assessments: Record<id, Assessment> }`
- **Autosave:** Debounce de 3 segundos após qualquer alteração de campo
- **Save indicator:** Dot verde + "Salvo" quando persistido; dot gold pulsante + "Não salvo" quando dirty

### 5.2 CRUD Alunos
1. Botão "+ Aluno" → abre modal
2. Preencher nome → "Criar" → cria student com `id: 's_' + Date.now()`, fecha modal, seleciona aluno, cria primeira avaliação automaticamente
3. "Remover aluno" → confirmação → deleta student + todas avaliações associadas

### 5.3 CRUD Avaliações
1. Selecionar aluno no dropdown → sidebar popula com avaliações do aluno (ordenadas por `createdAt` desc)
2. "+ Nova avaliação" → cria assessment com `id: 'a_' + Date.now()`, salva, seleciona
3. Clicar item na sidebar → carrega avaliação (preenche todos campos + fotos)
4. "Excluir avaliação" → confirmação → remove do DB

### 5.4 Importação JSON
- Input file (hidden) aceita `.json`
- Parse → extrai `studentName` → find-or-create student → cria assessment com dados do JSON
- Seleciona aluno + carrega avaliação criada

### 5.5 Fotos
- Tap no photo slot → `expo-image-picker` (launchImageLibraryAsync)
- Resultado em base64 URI → armazenado no assessment
- Hover mostra botão "✕ remover"
- Remover limpa a foto do slot

### 5.6 Print/PDF
- Botão "Imprimir / PDF" → `window.print()`
- **Print CSS:** esconde sidebar, header, action bar, file inputs, botões de remover foto
- Body mantém background escuro com `print-color-adjust: exact`
- Template card ocupa 100% width sem border-radius

---

## 6. Mapeamento Componentes → Atomic Design

| Componente HTML          | Nível      | Componente RN               | Arquivo                                     |
|--------------------------|------------|------------------------------|----------------------------------------------|
| `button`                 | Atom       | `Button`                     | `src/components/atoms/Button/`               |
| `input`, `select`        | Atom       | `Input`                      | `src/components/atoms/Input/`                |
| `textarea`               | Atom       | `Input` (multiline)          | `src/components/atoms/Input/`                |
| `.template-card`         | Atom       | `Card`                       | `src/components/atoms/Card/`                 |
| `.photo-slot`            | Atom       | `PhotoSlot`                  | `src/components/atoms/PhotoSlot/`            |
| `.measure-row`           | Molecule   | `MeasurementRow`             | `src/components/molecules/MeasurementRow/`   |
| `.panel` (feedback)      | Molecule   | `FeedbackPanel`              | `src/components/molecules/FeedbackPanel/`    |
| `.photo-section`         | Molecule   | `PhotoSection`               | `src/components/molecules/PhotoSection/`     |
| `.section-label`         | Molecule   | `SectionLabel`               | `src/components/molecules/SectionLabel/`     |
| `.action-bar`            | Organism   | `ActionBar`                  | `src/components/organisms/ActionBar/`        |
| `.app-header`            | Organism   | `AppHeader`                  | `src/components/organisms/AppHeader/`        |
| `.sidebar`               | Organism   | `Sidebar`                    | `src/components/organisms/Sidebar/`          |
| Full form (all sections) | Organism   | `AssessmentForm`             | `src/components/organisms/AssessmentForm/`   |
| Full page layout         | Template   | `AssessmentTemplate`         | `src/components/templates/AssessmentTemplate/`|

---

## 7. SVG Icons Reference

Todos os ícones são SVGs inline com `viewBox="0 0 24 24"`. Extrair para constantes ou componente `SvgIcon`.

| Nome           | Uso                            | Path `d`                                                                                                                                                              |
|----------------|--------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `location`     | Medida Ombros/Coxas           | `M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z` |
| `calendar`     | Medida Cintura                | `M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z`                      |
| `image`        | Photo placeholder             | `M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z`                                      |
| `check`        | Panel Positivos               | `M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z`                                                                                                                 |
| `warning`      | Panel A Melhorar              | `M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z`                                                                                                                |
| `info`         | Panel Ajustes / Observações   | `M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z`                                                                  |
| `person`       | Próxima Meta                  | `M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z` |
| `download`     | Importar JSON                 | `M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z`                                                                                                                         |
| `info-outline` | Empty state                   | `M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z`                                                                  |

---

## 8. Regras Pixel-Perfect

1. **Todos os valores numéricos são em `px`** — converter para números puros no React Native (sem unidades).
2. **Gap é real gap** — usar `gap` property no RN Web (suportado em `display: 'flex'`).
3. **Grid layout** — usar `display: 'grid'` no web via style prop (react-native-web suporta). Para sections com `grid-template-columns`, aplicar diretamente.
4. **Border dashed** — `borderStyle: 'dashed'` funciona no RN Web.
5. **Linear gradient** — aplicar via `background` style prop (string CSS) no web. Não usar `LinearGradient` component do Expo (overengineering para web-only).
6. **Hover states** — usar pseudo-classes via `StyleSheet` web extensions ou wrapper com `onMouseEnter`/`onMouseLeave` state.
7. **`aspect-ratio: 3/4`** — `aspectRatio: 3/4` ou `aspectRatio: 0.75` funciona em RN.
8. **`overflow: hidden`** — `overflow: 'hidden'` funciona em RN.
9. **Animação pulse** — usar `Animated` do RN ou CSS animation via web style.
10. **`text-transform: uppercase`** — `textTransform: 'uppercase'` funciona em RN.
11. **`letter-spacing`** — `letterSpacing: N` funciona em RN (valor em px, não em em).
12. **Placeholder color** — `placeholderTextColor` prop no `TextInput`.
13. **Focus border color** — `onFocus`/`onBlur` state para trocar `borderColor`.
14. **`calc(100vh - 57px)`** — no web, usar `minHeight: 'calc(100vh - 57px)'` via style prop.
15. **Scrollbar** — `overflow-y: auto` no main content e assessment list.

---

## 9. Estrutura do Photo Section — Dados por Seção

### Frente

| Posição     | Campos                                                              | Medidas                          |
|-------------|---------------------------------------------------------------------|----------------------------------|
| Esquerda    | `frente_antes_data`, `frente_antes_peso`                           | Ombros (`frente_antes_ombros`), Cintura (`frente_antes_cintura`) |
| Foto Antes  | `photo_frente_antes`                                               | —                                |
| Foto Depois | `photo_frente_depois`                                              | —                                |
| Direita     | `frente_depois_data`, `frente_depois_peso`                         | Ombros (`frente_depois_ombros`), Cintura (`frente_depois_cintura`) |

### Costas

| Posição     | Campos                                                              | Medidas                          |
|-------------|---------------------------------------------------------------------|----------------------------------|
| Esquerda    | `costas_antes_data`, `costas_antes_peso`                           | Ombros (`costas_antes_ombros`), Coxas (`costas_antes_coxas`) |
| Foto Antes  | `photo_costas_antes`                                               | —                                |
| Foto Depois | `photo_costas_depois`                                              | —                                |
| Direita     | `costas_depois_data`, `costas_depois_peso`                         | Ombros (`costas_depois_ombros`), Coxas (`costas_depois_coxas`) |

---

## 10. Estados da Aplicação

| Estado                          | UI visível                                                           |
|---------------------------------|----------------------------------------------------------------------|
| Nenhum aluno selecionado        | Sidebar: "Selecione um aluno..." / Main: Empty state                |
| Aluno selecionado, sem avaliação| Sidebar: "Nenhuma avaliação ainda..." + botão Nova / Main: Empty state|
| Aluno + avaliação selecionada   | Sidebar: lista com item ativo / Main: Action Bar + Template Card     |
| Modal Novo Aluno aberto         | Overlay escuro + caixa modal centralizada                            |
| Dirty (não salvo)               | Dot gold pulsante + "Não salvo" no status                           |
| Saved                           | Dot verde + "Salvo" no status                                        |

---

## 11. Checklist de Fidelidade Visual

Use esta checklist para validar que cada elemento está pixel-perfect:

- [ ] Background geral `#0e0e0e`
- [ ] Header com gradient border bottom gold
- [ ] Sidebar width exato 230px
- [ ] Assessment items com border gold quando active
- [ ] Template card com border-radius 10 e max-width 900
- [ ] Header gradient de `#1a1408` → `#181818`
- [ ] Section labels com badge pill (borderRadius 20)
- [ ] Photo section em grid 4 colunas `160px 1fr 1fr 160px`
- [ ] Photo slots com aspect-ratio 3:4 e border dashed
- [ ] Measurement rows com icon circles de 28x28
- [ ] Measurement inputs com underline only (borderBottom)
- [ ] Side direito com layout espelhado (text-align right, icon à direita)
- [ ] 3 panels de feedback em grid equal columns
- [ ] Dots coloridos 10x10 nos panel rows
- [ ] Bottom info em grid 3fr/2fr
- [ ] Meta section com background `#1a1408`
- [ ] Footer com nome em uppercase e letterSpacing 2
- [ ] Todos os hover states (border color transitions)
- [ ] Pulse animation no dot unsaved
- [ ] Modal com overlay 75% opacity
- [ ] Print CSS esconde sidebar + header + action bar
