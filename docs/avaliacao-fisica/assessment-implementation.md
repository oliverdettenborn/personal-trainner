# Plano de Implementação: Alinhar Código com SPEC Pixel-Perfect

> **Referência:** `docs/avaliacao-fisica/SPEC.md`  
> **HTML Reference:** `docs/avaliacao-fisica/acompanhamento_fisico.html`  
> **Estado atual:** ✅ Implementação completa — todos os componentes alinhados pixel-perfect com o HTML de referência.

---

## Status de Implementação

| Fase | Status |
|------|--------|
| Fase 1: Tokens e Limpeza | ✅ Concluída |
| Fase 2: State Management | ✅ Concluída |
| Fase 3: Wiring Componentes | ✅ Concluída |
| Fase 4: Detalhes Visuais | ✅ Concluída |
| Fase 5: Print CSS & Web | ✅ Concluída |
| Fase 6: Testes | ✅ Concluída (11 suites, 28 testes) |

---

## Divergências HTML vs React Native — Resolvidas

| # | Componente | Divergência | Severidade | Resolução |
|---|-----------|-------------|------------|-----------|
| 1 | AppHeader | Título fontSize 26 → deveria ser 18 | Crítica | fontSize corrigido, layout com `<select>` nativo |
| 2 | AppHeader | Botão "Novo Aluno" hardcoded → deveria ser `<select>` dropdown | Crítica | `<select>` nativo web, modal próprio pro "+ Aluno" |
| 3 | Sidebar | Duplicava student selector + botão remover | Crítica | Stripped: só "Avaliações" + lista + "+ Nova avaliação" |
| 4 | PhotoSection | Data/Peso usavam MeasurementRow com ícone circular | Crítica | Convertidos pra Input boxed como no HTML |
| 5 | Ícones | Ionicons (genéricos) → SVG paths exatos do HTML | Crítica | Todos substituídos por react-native-svg inline |
| 6 | AssessmentForm | Emojis (📝📅) nos títulos obs/meta | Crítica | SVG icons (info, person) com cores split |
| 7 | FeedbackPanel | `icon` prop (Ionicons) → `svgPath` prop | Média | Prop renomeada, SVG inline |
| 8 | MeasurementRow | `icon` prop (Ionicons) → `svgPath` prop | Média | Prop renomeada, SVG inline |
| 9 | SectionLabel | paddingHorizontal 16 → 24 | Média | Corrigido |
| 10 | Empty State | Ionicons fitness-outline gold → SVG info icon text3 | Média | SVG com opacity 0.4 |
| 11 | Footer | textAlign sem alignItems center | Média | alignItems: 'center' |
| 12 | Meta textarea | bg genérico → #120f05 | Média | Corrigido |
| 13 | Print CSS | Faltava hide de input[type=file] | Baixa | Adicionado |
| 14 | AssessmentForm | Seção "FOTOS" label sobrando | Média | Removida (labels dentro de PhotoSection) |
| 15 | _layout.tsx | Over-engineered (Stack, ThemeProvider, fonts) | Baixa | Simplificado pra Slot + SplashScreen |

---

## Fase 1: Fundação — Tokens e Limpeza

### 1.1 Adicionar cores extras ao theme
- **Arquivo:** `src/theme/colors.ts`
- ~15 cores estão hardcoded nos componentes. Centralizar:
  - `panelGreenBg: '#1a3020'`, `panelGreenBorder: '#2a6040'`
  - `panelAmberBg: '#302010'`, `panelAmberBorder: '#604020'`
  - `panelRedBg: '#301010'`, `panelRedBorder: '#602020'`
  - `dotAmber: '#c08030'`, `dotRed: '#a03030'`
  - `metaBg: '#1a1408'`, `metaTextareaBg: '#120f05'`
  - `btnDangerBorder: '#6a2020'`, `btnDangerText: '#c08080'`
  - `activeAssessmentBg: '#2a2010'`
  - `templateHeaderGradientTop: '#1a1408'`
- **Verificação:** grep por hex literals hardcoded → substituir por tokens

### 1.2 Consolidar rota duplicada
- **Deletar:** `app/(tabs)/assessment.tsx` (duplicata experimental)
- **Manter:** `app/index.tsx` como entry point único
- **Verificação:** `npx expo start --web` → app carrega sem erro

---

## Fase 2: State Management — Hook `useAssessment`

### 2.1 Adicionar estado de seleção ao hook
- **Arquivo:** `src/hooks/useAssessment.ts`
- Adicionar:
  - `currentStudentId: string | null` + `setCurrentStudentId`
  - `currentAssessmentId: string | null` + `setCurrentAssessmentId`
  - Computed: `currentStudent` (derived de `db.students[currentStudentId]`)
  - Computed: `currentAssessment` (derived de `db.assessments[currentAssessmentId]`)
  - Computed: `studentAssessments` (filtered + sorted by `createdAt` desc)
- Comportamentos:
  - `addStudent()` → auto-selecionar student + criar primeira avaliação + auto-selecionar
  - `removeStudent()` → limpar seleção se era o student ativo
  - `addAssessment()` → auto-selecionar a nova avaliação
  - `removeAssessment()` → selecionar próxima ou limpar

### 2.2 Atualizar testes do hook
- **Arquivo:** `src/hooks/useAssessment.test.ts`
- Cobrir: seleção de student, seleção de assessment, auto-seleção em CRUD, limpeza ao deletar

---

## Fase 3: Wiring — Conectar Componentes ao Estado

### 3.1 Refatorar `app/index.tsx` (página raiz)
- Usar `useAssessment()` como source of truth
- Passar props reais (não hardcoded) para todos os organismos
- Layout 3-zonas conforme SPEC §2:
  - `AppHeader` (topo)
  - `Sidebar` (left, 230px) + `Main Content` (flex: 1, scroll)
  - Main content: `currentAssessment` → ActionBar + AssessmentForm, senão → Empty State (SPEC §3.3)
- `minHeight: 'calc(100vh - 57px)'` no body

### 3.2 Refatorar `AppHeader`
- **Arquivo:** `src/components/organisms/AppHeader/AppHeader.tsx`
- Student selector → dropdown real (Picker ou `<select>` nativo web)
- Props: `students`, `currentStudentId`, `onSelectStudent`, `onAddStudent`, `onRemoveStudent`, `onImportJSON`
- Botões: "+ Aluno" (abre modal), "Remover aluno", "Importar JSON"

### 3.3 Refatorar `Sidebar`
- **Arquivo:** `src/components/organisms/Sidebar/Sidebar.tsx`
- Props: `students`, `currentStudentId`, `assessments` (filtradas), `currentAssessmentId`
- Callbacks: `onSelectStudent`, `onSelectAssessment`, `onAddAssessment`, `onAddStudent`, `onRemoveStudent`
- Wiring real: clicar assessment item → `onSelectAssessment(id)`
- Empty states conforme SPEC §10:
  - Nenhum aluno: "Selecione um aluno..."
  - Aluno sem avaliação: "Nenhuma avaliação ainda..." + botão Nova

### 3.4 Refatorar `AssessmentForm`
- **Arquivo:** `src/components/organisms/AssessmentForm/AssessmentForm.tsx`
- Props: `assessment: Assessment`, `onUpdate: (field, value) => void`
- Cada input chama `onUpdate(fieldName, value)` → chain até `updateAssessment()`
- PhotoSection: `onPhotoChange(photoKey, uri)` → mesma cadeia
- FeedbackPanels: cada input chama `onUpdate` com field name correto
- Observações + Meta: mesma cadeia

### 3.5 Wiring `ActionBar`
- **Arquivo:** `src/components/organisms/ActionBar/ActionBar.tsx`
- Props: `isDirty`, `onSave`, `onPrint`, `onImportJSON`, `onDeleteAssessment`
- Status indicator: dot verde se salvo, dot gold pulsante se dirty

### 3.6 Empty State no Main Content
- **Arquivo:** `app/index.tsx` (inline)
- SVG 48x48, texto: "Selecione um aluno e crie uma avaliação para começar."
- Conforme SPEC §3.3

---

## Fase 4: Detalhes Visuais Pixel-Perfect

### 4.1 Hover states
- Sidebar assessment items: hover → `borderColor: borderGold`
- Buttons outline: hover → `borderColor: gold`
- Photo slot remove button: visível apenas no hover
- Implementar com `onMouseEnter`/`onMouseLeave` + state

### 4.2 Template Header gradient
- Verificar `background: 'linear-gradient(180deg, #1a1408 0%, #181818 100%)'`
- Título split: "ACOMPANHAMENTO" `color: text`, "FÍSICO" `color: gold`

### 4.3 Sidebar assessment item active state
- Item ativo: `borderColor: gold`, `backgroundColor: #2a2010`
- Comparar `currentAssessmentId` com `item.id`

### 4.4 Modal Novo Aluno
- Verificar contra SPEC §3.13: overlay 75% opacity, box 340px, input styling

### 4.5 Photo base64
- **Arquivo:** `src/components/atoms/PhotoSlot/PhotoSlot.tsx`
- Garantir que `expo-image-picker` retorna base64 (`options: { base64: true }`)
- Armazenar como data URI no assessment

---

## Fase 5: Print CSS & Funcionalidades Web

### 5.1 Print CSS
- **Arquivo:** `app/+html.tsx` ou stylesheet global
- `@media print`: esconder sidebar, header, action bar, botões remover foto, file inputs
- `body`: manter background escuro, `print-color-adjust: exact`
- Template card: 100% width, sem border-radius

### 5.2 Print/PDF button
- `window.print()` no web

### 5.3 Import JSON handler
- File input hidden, accept `.json`
- Parse → find-or-create student → create assessment → selecionar

---

## Fase 6: Testes

### 6.1 Testes do hook atualizado
- CRUD completo com seleção
- Auto-save trigger
- Import JSON flow

### 6.2 Testes de integração leve
- `index.tsx`: renderiza empty state quando nada selecionado
- `index.tsx`: renderiza form quando assessment selecionado

### 6.3 Atualizar testes existentes
- Sidebar, AssessmentForm, AppHeader terão props novas → atualizar mocks e assertions

---

## Arquivos Impactados

| Arquivo | Ação |
|---------|------|
| `src/theme/colors.ts` | Adicionar ~15 tokens extras |
| `src/hooks/useAssessment.ts` | Adicionar seleção + computed values |
| `src/hooks/useAssessment.test.ts` | Atualizar testes |
| `app/index.tsx` | Refatorar como entry point com layout 3-zonas |
| `app/(tabs)/assessment.tsx` | **DELETAR** |
| `src/components/organisms/AppHeader/AppHeader.tsx` | Student selector real, props |
| `src/components/organisms/Sidebar/Sidebar.tsx` | Wiring de seleção, empty states |
| `src/components/organisms/AssessmentForm/AssessmentForm.tsx` | Conectar inputs ao hook |
| `src/components/organisms/ActionBar/ActionBar.tsx` | Props reais (isDirty, callbacks) |
| `src/components/atoms/PhotoSlot/PhotoSlot.tsx` | Garantir base64 |
| `app/+html.tsx` | Print CSS |

---

## Checklist de Verificação

1. `npx expo start --web` → app carrega sem erros
2. Criar aluno via modal → aparece no dropdown e sidebar
3. Criar avaliação → form carrega com campos vazios, status "Não salvo"
4. Preencher campos → auto-save 3s → status muda para "Salvo"
5. Navegar entre avaliações na sidebar → form atualiza
6. Remover avaliação → próxima é selecionada ou empty state
7. Remover aluno → confirmação → student + assessments removidos
8. Import JSON → student criado/encontrado, avaliação carregada
9. Print/PDF → `window.print()` esconde UI, mostra só template card
10. `npm test` → todos os testes passam
11. Checklist visual SPEC §11 → pixel-perfect

---

## Decisões Técnicas

- **Rota duplicada:** Deletar `(tabs)/assessment.tsx`, manter `index.tsx`
- **State management:** Tudo no hook `useAssessment` (sem Context/Redux — app simples)
- **Grid layout:** `display: 'grid'` direto no web (react-native-web suporta)
- **Hover:** `onMouseEnter`/`onMouseLeave` com state local (web-only)
- **Print:** CSS global via `+html.tsx`
- **Student selector:** Manter tanto no AppHeader (atalho) quanto na Sidebar (navegação)

---

## Considerações Futuras (Pós-MVP)

- **Fotos em AsyncStorage** — base64 pode estourar ~6MB. Migrar para `expo-file-system` se necessário.
- **Gráficos de evolução** — baseados nos pesos e medidas históricos.
- **Export PDF nativo** — substituir `window.print()` por geração real de PDF.
