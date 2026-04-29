# Plano: Spec 1 — Supabase CLI + Migrations + Schema Tests + CI Deploy

## Context

O app já funciona com AsyncStorage local. Este spec cria a infraestrutura de banco (Supabase CLI, migrations versionadas, RLS) que os Specs 2 e 3 dependem. Nenhuma mudança em código de produção — só infraestrutura + testes de schema + pipeline de deploy.

O usuário já criou o projeto no Supabase. Falta: inicializar o CLI localmente, criar as migrations, escrever testes de schema com pg-mem (sem Docker), e adicionar job de migrations ao pipeline de deploy.

---

## Pré-requisitos manuais (usuário faz antes)

1. **Supabase CLI** (Windows via scoop ou npm):
   ```bash
   scoop install supabase
   # ou
   npm install -g supabase
   ```
2. **Login no CLI:**
   ```bash
   supabase login
   ```
3. **Ter em mãos:** `project-ref` da URL do dashboard (`https://supabase.com/dashboard/project/<ref>`)
4. **Adicionar secrets no GitHub** (Settings → Secrets and variables → Actions):
   - `SUPABASE_ACCESS_TOKEN` → Account → Access Tokens no dashboard do Supabase
   - `SUPABASE_PROJECT_REF` → project-ref do dashboard (pode ser variável, não secret)
   - `EXPO_PUBLIC_SUPABASE_URL` → URL do projeto Supabase (necessário no build web)
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY` → anon key (necessário no build web)

> Docker **não é necessário** — testes rodam com pg-mem in-memory.

---

## Decisão de arquitetura: pg-mem em vez de supabase start

`pg-mem` é uma implementação in-memory de PostgreSQL puro em JS/TS — análoga ao H2 do Java ou ao mem-db do Datomic. Roda sem Docker, sem conexão de rede, sem dependência de ambiente externo. Isso mantém o CI atual (`pr.yml`, `deploy.yml`) funcionando sem mudanças na infraestrutura.

**Limitação conhecida:** `pg-mem` não suporta RLS (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY` / `CREATE POLICY`). Por isso:
- Testes de schema testam estrutura de tabelas e FK constraints (3 testes)
- Correctude do RLS é validada pela migration SQL + `supabase db push` bem-sucedido no CI

**Jest:** criar `jest.integration.config.js` separado (ts-jest + node) para não conflitar com o preset `jest-expo` existente no `package.json`.

---

## Arquivos críticos

| Arquivo | Ação |
|---|---|
| `supabase/config.toml` | Criar via `supabase init` |
| `supabase/migrations/<ts>_create_tables.sql` | Criar — DDL |
| `supabase/migrations/<ts>_enable_rls.sql` | Criar — RLS |
| `src/repositories/__tests__/schema.integration.test.ts` | Criar — 3 testes via pg-mem |
| `jest.integration.config.js` | Criar — config separada (ts-jest + node) |
| `package.json` | Modificar — script `test:integration` + deps (`pg-mem`, `ts-jest`, `pg`) |
| `.github/workflows/deploy.yml` | Modificar — adicionar job `migrate` |
| `.gitignore` | Verificar — `.env.test` já coberto? |

**Não criar:** `.env.test` (pg-mem não precisa de connection string).

---

## Plano de execução

### Task 1 — Supabase CLI init + env

1. Verificar `.gitignore` — `.env` já está (commit `5e96b62`); confirmar `.env.test` também coberto
2. Rodar `supabase init` → gera `supabase/config.toml`
3. Rodar `supabase link --project-ref <ref>` (usuário fornece o ref)
4. Criar `.env` com `EXPO_PUBLIC_SUPABASE_URL` e `EXPO_PUBLIC_SUPABASE_ANON_KEY`
5. Commit: `chore: init supabase cli`

### Task 2 — Migration DDL

1. `supabase migration new create_tables`
2. Escrever SQL no arquivo gerado: tabelas `students` e `assessments` com PKs, FKs e todos os campos da spec
3. Commit: `chore: migration - create students and assessments tables`

### Task 3 — Migration RLS

1. `supabase migration new enable_rls`
2. Escrever SQL: `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` + `CREATE POLICY "users_own_*"` para ambas as tabelas
3. Commit: `chore: migration - enable rls on students and assessments`

### Task 4 — Testes de schema com pg-mem

1. `npm install -D pg-mem ts-jest @types/jest` (pg-mem inclui types)
2. Criar `jest.integration.config.js`:
   ```js
   module.exports = {
     preset: 'ts-jest',
     testEnvironment: 'node',
     moduleNameMapper: { /* aliases do tsconfig */ },
   };
   ```
3. Adicionar ao `package.json`:
   ```json
   "test:integration": "jest --config jest.integration.config.js"
   ```
4. Criar `src/repositories/__tests__/schema.integration.test.ts`:
   - Setup: `newDb()` do pg-mem → executa o SQL do `create_tables` migration (lê o arquivo)
   - Teste 1: `students` tem as colunas `id`, `user_id`, `name`, `created_at`
   - Teste 2: `assessments` tem todas as colunas (`id`, `student_id`, `user_id`, fotos, positivos, ajustes etc.)
   - Teste 3: FK de `assessments.student_id → students.id` existe em `information_schema`
5. Rodar `npm run test:integration` → 3 passing
6. Commit: `test: add schema integration tests using pg-mem`

### Task 5 — GitHub Action: apply migrations on deploy

Modificar `.github/workflows/deploy.yml` — adicionar job `migrate` paralelo ao job `test`:

```yaml
migrate:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: supabase/setup-cli@v1
      with:
        version: latest
    - run: supabase db push --project-ref ${{ vars.SUPABASE_PROJECT_REF }}
      env:
        SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
```

E ajustar `needs` do job `build` para `needs: [test, migrate]`.

Também modificar o step `expo export` do job `build` para injetar as env vars do Supabase:
```yaml
- run: npx expo export --platform web
  env:
    NODE_ENV: production
    EXPO_PUBLIC_SUPABASE_URL: ${{ secrets.EXPO_PUBLIC_SUPABASE_URL }}
    EXPO_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.EXPO_PUBLIC_SUPABASE_ANON_KEY }}
```

6. Commit: `ci: apply supabase migrations on deploy and inject supabase env vars for web build`

### Task 6 — Aplicar no remoto + storage bucket (parcialmente manual)

1. Claude roda `supabase db push` localmente (valida antes do merge)
2. Usuário cria bucket no dashboard: Storage → New bucket → `assessment-photos` → Public
3. Verificação: `supabase db diff` deve mostrar `No schema changes found`

---

## Verificação final

```bash
npm run test:integration      # → 3 passing (sem Docker)
npm test                      # → testes unitários existentes sem regressão
supabase db diff              # → No schema changes found
```

- Tabelas visíveis no Dashboard remoto com RLS ativo (cadeado)
- Bucket `assessment-photos` criado como Public
- CI `deploy.yml` rodando job `migrate` antes de `build` na main
