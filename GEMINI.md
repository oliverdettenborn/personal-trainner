# GEMINI.md

This file provides guidance to Gemini CLI when working with code in this repository.

## Quality & Testing Standards

**BDD & E2E Mandate:**
- When creating a new feature, you **MUST** first write its BDD scenarios in a dedicated file inside `docs/bdd/`.
- Every feature **MUST** have corresponding E2E tests (Cypress for Web, and eventually Maestro for Mobile).
- No feature is considered complete until it passes its E2E validation.

**CI & Migrations:**
- When applying migrations to a remote database via Supabase CLI using a connection pooler in **Transaction Mode** (typically port 6543), you **MUST** append `?prepared_statements=false` to the connection string to avoid "prepared statement already exists" errors.

## Development Workflow

1.  **Research:** Map the feature and dependencies.
2.  **BDD Specification:** Create/Update `docs/bdd/<feature-name>.md`.
3.  **Implementation:** Build the feature following the project's architectural patterns.
4.  **E2E Testing:** Write and run Cypress/Maestro tests to verify the BDD scenarios.
5.  **Validation:** Ensure all tests pass in the targeted environments.
