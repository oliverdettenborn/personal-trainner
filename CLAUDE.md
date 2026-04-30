# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev              # start Supabase local (Docker) + Expo together
npm run db               # start only Supabase local (Docker)
npm start                # start only Expo
npm test                 # unit + integration tests (jest-expo)
npm run test:integration # schema integration tests only (ts-jest/node, uses pg-mem)
npm run typecheck        # TypeScript type check
```

Run a single test file:
```bash
npm test -- src/hooks/useAssessment.test.ts
```

## Architecture

**Stack:** React Native + Expo Router, TypeScript strict, AsyncStorage (current), Supabase (in progress).

**Atomic design:** `src/components/atoms/` → `molecules/` → `organisms/` → `templates/`. Screen files in `app/` MUST be thin — they compose templates + organisms, delegate ALL logic/state to organisms or hooks. NO inline styles, NO useState, NO business logic in screen files.

**Component rules:**
- `atoms/` — Stateless primitives (Button, Input, Text, Card, PhotoSlot). No business logic.
- `molecules/` — Combine 2+ atoms with minimal local state (PhotoSection, ConfirmModal, SectionLabel).
- `organisms/` — Feature-complete sections with their own state/logic (LoginForm, AssessmentForm, ActionBar, Sidebar).
- `templates/` — Layout wrappers that define page structure (AuthTemplate, AssessmentTemplate). Receive children, no business logic.

**Screen pattern (app/*.tsx):**
```tsx
// CORRECT — thin screen, delegates everything
export default function LoginScreen() {
  return (
    <AuthTemplate>
      <LoginForm onSubmit={signIn} />
    </AuthTemplate>
  );
}

// WRONG — logic, state, and styles directly in screen file
export default function LoginScreen() {
  const [email, setEmail] = useState('');
  // ... 80 lines of UI code
}
```

**Test IDs:** Use `testID` prop (not `nativeID`) for test selectors. Cypress uses `[data-testid="..."]`, Jest/RNTL uses `getByTestId()`. Reserve `nativeID` only for functional DOM access (e.g. `document.getElementById`).

**State:** `src/hooks/useAssessment.ts` owns all app state — students + assessments in a single `AssessmentDB` record, persisted to AsyncStorage with a 3s debounce. All state mutations go through this hook.

**Data model:** `src/types/assessment.ts` defines `Student`, `Assessment`, and `AssessmentDB`. Assessment fields use English snake_case: `front_before_date`, `front_before_weight`, `back_before_date`, etc. Photo fields: `photo_front_before`, `photo_front_after`, `photo_back_before`, `photo_back_after`.

**Database:** Supabase with migrations in `supabase/migrations/`. Two migrations: `20260428000001_create_tables.sql` (DDL) and `20260428000002_enable_rls.sql` (RLS policies). Local dev uses Docker via `npm run db`; production migrations apply automatically on push to `main` via GitHub Actions.

**Storage bucket:** `assessment-photos` — private, 5MB limit, MIME types: `image/jpeg, image/png, image/webp`.

**Testing:** Unit tests use `jest-expo` preset. Integration tests use `jest.integration.config.js` (ts-jest + node) with `pg-mem` as in-memory PostgreSQL — no Docker required for CI.

**CI/CD:** 
- `release.yml`: Runs on push to `main`. Executes `checks.yml` -> (Parallel: `e2e-web.yml`, `build-web.yml`) -> `migrate.yml` (depends on E2Es) -> `deploy-pages.yml` (depends on migrate & build).
- `pr.yml`: Runs on pull requests. Executes `checks.yml`, `build-test` (with placeholders), and `e2e-web.yml`.
- **Note:** For GitHub Actions, ensure `SUPABASE_DB_URL` uses the **Connection Pooler (Transaction Mode, port 6543)**.

## Quality & Testing

**BDD & E2E:** 
- When creating a new feature, ALWAYS write its BDD scenarios in a dedicated file inside `docs/bdd/` and implement the corresponding E2E tests (Cypress for Web, and eventually Maestro for Mobile). 
- **E2E Isolation:** E2E tests **MUST** always run against an isolated local Supabase stack (using `supabase start` in CI). NEVER use production or staging credentials for E2E.
- Every feature must be validated by an E2E test before being considered complete.

## Environment

Local `.env` (not committed):
```
EXPO_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
EXPO_PUBLIC_SUPABASE_ANON_KEY=<publishable key from supabase start output>
```

GitHub Actions uses:
- Secret: `SUPABASE_ACCESS_TOKEN`
- Variables: `SUPABASE_PROJECT_REF`, `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`

## Supabase local reset

After changing migration files, reset the local DB:
```bash
supabase db reset
```
