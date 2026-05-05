# GEMINI.md

This file provides guidance to Gemini CLI when working with code in this repository.

## Architecture — Atomic Design (MANDATORY)

**Layer hierarchy:** `atoms/` → `molecules/` → `organisms/` → `templates/`

**Screen files (`app/*.tsx`) MUST be thin wrappers:**

- Compose templates + organisms only
- NO `useState`, NO inline styles, NO business logic
- All state/logic lives in organisms or hooks

**Component placement rules:**
| Layer | What goes here | Examples |
|-------|---------------|----------|
| `src/components/atoms/` | Stateless primitives, no business logic | Button, Input, Text, Card, PhotoSlot |
| `src/components/molecules/` | 2+ atoms combined, minimal local state | PhotoSection, ConfirmModal, SectionLabel |
| `src/components/organisms/` | Feature-complete with own state/logic | LoginForm, SetPasswordForm, AssessmentForm, ActionBar |
| `src/components/templates/` | Layout wrappers, receive children | AuthTemplate, AssessmentTemplate |

**Example — correct screen:**

```tsx
export default function LoginScreen() {
  return (
    <AuthTemplate>
      <LoginForm onSubmit={signIn} />
    </AuthTemplate>
  );
}
```

**Test IDs:** Always use `testID` prop (not `nativeID`). Cypress selector: `[data-testid="..."]`. Jest/RNTL: `getByTestId()`.

## Quality & Testing Standards

**BDD & E2E Mandate:**

- When creating a new feature, you **MUST** first write its BDD scenarios in a dedicated file inside `docs/bdd/`.
- Every feature **MUST** have corresponding E2E tests (Cypress for Web, and eventually Maestro for Mobile).
- **E2E Isolation:** E2E tests **MUST** always run against an isolated local Supabase stack (using `supabase start`). Never point E2E tests to production or staging databases.
- No feature is considered complete until it passes its E2E validation.

**CI & Migrations:**

- When applying migrations to a remote database via Supabase CLI using a connection pooler in **Transaction Mode** (typically port 6543), you **MUST** append `?prepared_statements=false` to the connection string to avoid "prepared statement already exists" errors.

## Development Workflow

1.  **Research:** Map the feature and dependencies.
2.  **BDD Specification:** Create/Update `docs/bdd/<feature-name>.md`.
3.  **Implementation:** Build the feature following atomic design (organism for logic, template for layout, thin screen).
4.  **E2E Testing:** Write and run Cypress/Maestro tests to verify the BDD scenarios.
5.  **Validation:** Ensure all tests pass in the targeted environments.
