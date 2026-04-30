# Personal Trainer — Avaliação Física

App para personal trainers registrarem e acompanharem avaliações físicas de seus alunos.

## Stack

- **Framework:** React Native + Expo (Web + Mobile)
- **Router:** Expo Router (file-based)
- **Language:** TypeScript (strict)
- **Backend:** Supabase (Auth, Database, Storage)
- **State:** AsyncStorage + custom hook (`useAssessment`)
- **Testing:** Jest (unit) + Cypress (E2E web)

## Getting Started

```bash
npm install

# Start Supabase local (Docker) + Expo together
npm run dev

# Or separately:
npm run db       # Supabase only
npm start        # Expo only
npm run web      # Expo web on port 8081
```

### Environment

Create a `.env` file:
```
EXPO_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
EXPO_PUBLIC_SUPABASE_ANON_KEY=<key from supabase start>
```

## Architecture

### Atomic Design

```
src/components/
├── atoms/         # Stateless primitives (Button, Input, Text, Card, PhotoSlot)
├── molecules/     # 2+ atoms, minimal state (PhotoSection, ConfirmModal)
├── organisms/     # Feature-complete, own state (LoginForm, AssessmentForm, ActionBar)
└── templates/     # Layout wrappers (AuthTemplate, AssessmentTemplate)
```

### Screen Pattern

Screen files (`app/*.tsx`) are **thin wrappers** — no state, no styles, no logic:

```tsx
export default function LoginScreen() {
  return (
    <AuthTemplate>
      <LoginForm onSubmit={signIn} />
    </AuthTemplate>
  );
}
```

### Project Structure

```
app/                  # Expo Router screens (thin wrappers)
src/
├── components/       # Atomic design hierarchy
├── hooks/            # Custom hooks (useAssessment, useAuth)
├── lib/              # Supabase client config
├── services/         # Auth service layer
├── theme/            # Color tokens
├── types/            # TypeScript types (Assessment, Student)
└── utils/            # Utilities (masks)
supabase/
├── migrations/       # SQL migrations (DDL + RLS)
└── config.toml       # Local dev config
cypress/
└── e2e/              # E2E test specs
docs/
├── bdd/              # BDD scenarios per feature
└── specs/            # Implementation specs
```

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Supabase + Expo together |
| `npm run db` | Supabase local only |
| `npm start` | Expo dev server |
| `npm run web` | Expo web (port 8081) |
| `npm test` | Unit + integration tests |
| `npm run test:e2e:run` | Cypress E2E (headless) |
| `npm run test:e2e` | Cypress E2E (interactive) |
| `npm run typecheck` | TypeScript validation |
| `npm run lint:fix` | ESLint autofix |

## Testing

### Unit Tests (Jest)
```bash
npm test
npm test -- src/hooks/useAssessment.test.ts  # single file
```

### E2E Tests (Cypress)
```bash
npm run test:e2e:run   # headless
npm run test:e2e       # interactive (opens Cypress UI)
```

### Integration Tests
```bash
npm run test:integration  # schema tests with pg-mem
```

## Conventions

- **Test IDs:** Use `testID` prop. Cypress: `[data-testid="..."]`, Jest: `getByTestId()`
- **nativeID:** Reserved only for functional DOM access (`document.getElementById`)
- **BDD:** Every feature needs `docs/bdd/<feature>.md` before implementation
- **E2E:** Every feature needs a Cypress spec before being considered done

## CI/CD

- **On push to `main`:** checks → E2E + build → migrate → deploy
- **On PR:** checks → build-test → E2E

## License

See [LICENSE](LICENSE)
