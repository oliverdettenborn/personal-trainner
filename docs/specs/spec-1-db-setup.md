# Spec 1: Database Setup (Supabase CLI + Migrations)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Configurar Supabase CLI no projeto, criar migrations versionadas com o schema completo (students + assessments + RLS), e validar com testes de integração rodando contra banco local (Docker).

**Architecture:** Schema gerenciado em `supabase/migrations/`. Ambiente local via `supabase start` (Docker). Nenhuma mudança no código da aplicação — só infraestrutura de banco.

**Tech Stack:** Supabase CLI, PostgreSQL, Docker, Jest + pg (testes de integração).

---

## Context

O projeto persiste dados via AsyncStorage. Este spec cria a fundação de banco que os Specs 2 e 3 dependem. Schema via migrations (não SQL avulso) garante que futuras alterações sejam versionadas e aplicáveis via `supabase db push`.

---

## File Structure

| Arquivo | Ação | Responsabilidade |
|---|---|---|
| `supabase/config.toml` | Criar (via CLI) | Configuração do projeto Supabase CLI |
| `supabase/migrations/<ts>_create_tables.sql` | Criar | DDL: tabelas students e assessments |
| `supabase/migrations/<ts>_enable_rls.sql` | Criar | RLS policies (separado do DDL para clareza) |
| `src/repositories/__tests__/schema.integration.test.ts` | Criar | Testes de integração contra banco local |
| `.env` | Criar | Credenciais Supabase (não commitado) |
| `.env.test` | Criar | DB URL local para testes (não commitado) |
| `.gitignore` | Modificar | Garantir `.env` e `.env.test` ignorados |

---

## Pré-requisito Manual (usuário faz antes)

- Instalar Supabase CLI: `npm install -g supabase`
- Instalar Docker Desktop (necessário para `supabase start`)
- Criar projeto em [supabase.com](https://supabase.com) → copiar **Project URL** e **anon key**
- Rodar: `supabase login`

---

## Task 1: Init + Variáveis de Ambiente

**Files:**
- Create: `supabase/config.toml` (via CLI)
- Create: `.env`
- Modify: `.gitignore`

- [ ] **Step 1: Inicializar Supabase CLI na raiz do projeto**

```bash
supabase init
```

Esperado: pasta `supabase/` criada com `config.toml`.

- [ ] **Step 2: Linkar ao projeto remoto**

```bash
supabase link --project-ref SEU_PROJECT_REF
```

`SEU_PROJECT_REF` fica na URL do dashboard: `https://supabase.com/dashboard/project/<ref>`

- [ ] **Step 3: Criar `.env` na raiz**

```env
EXPO_PUBLIC_SUPABASE_URL=https://SEU_PROJETO.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=SUA_ANON_KEY
```

- [ ] **Step 4: Garantir `.gitignore` ignora envs**

```bash
grep "\.env" .gitignore
```

Se não aparecer, adicionar ao `.gitignore`:

```
.env
.env.local
.env.test
```

- [ ] **Step 5: Commit**

```bash
git add supabase/ .gitignore
git commit -m "chore: init supabase cli"
```

---

## Task 2: Migration — DDL (Tabelas)

**Files:**
- Create: `supabase/migrations/<timestamp>_create_tables.sql`

- [ ] **Step 1: Criar migration**

```bash
supabase migration new create_tables
```

- [ ] **Step 2: Editar o arquivo criado em `supabase/migrations/`**

```sql
CREATE TABLE students (
  id         TEXT   PRIMARY KEY,
  user_id    UUID   NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name       TEXT   NOT NULL,
  created_at BIGINT NOT NULL
);

CREATE TABLE assessments (
  id         TEXT   PRIMARY KEY,
  user_id    UUID   NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id TEXT   NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  created_at BIGINT NOT NULL,
  notes      TEXT,
  next_goal  TEXT
);

-- one row per view (side × moment): photo + date + weight at that snapshot
CREATE TABLE assessment_snapshots (
  id            TEXT    PRIMARY KEY,
  assessment_id TEXT    NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  side          TEXT    NOT NULL,
  moment        TEXT    NOT NULL,
  photo_url     TEXT,
  date          DATE,
  weight        FLOAT,
  UNIQUE (assessment_id, side, moment)
);

-- extensible key-value measurements (weight, body fat %, circumferences, etc.)
CREATE TABLE assessment_metrics (
  id            TEXT    PRIMARY KEY,
  assessment_id TEXT    NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  name          TEXT    NOT NULL,
  value         FLOAT   NOT NULL,
  unit          TEXT,
  position      INTEGER NOT NULL DEFAULT 0
);

-- categorized feedback items (positive, adjustment, or any future category)
CREATE TABLE assessment_feedback (
  id            TEXT    PRIMARY KEY,
  assessment_id TEXT    NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  category      TEXT    NOT NULL,
  content       TEXT    NOT NULL,
  position      INTEGER NOT NULL DEFAULT 0
);
```

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/
git commit -m "chore: migration - create students and assessments tables"
```

---

## Task 3: Migration — RLS Policies

**Files:**
- Create: `supabase/migrations/<timestamp>_enable_rls.sql`

- [ ] **Step 1: Criar migration**

```bash
supabase migration new enable_rls
```

- [ ] **Step 2: Editar o arquivo criado**

```sql
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_students" ON students
  FOR ALL
  USING      (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_assessments" ON assessments
  FOR ALL
  USING      (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/
git commit -m "chore: migration - enable rls on students and assessments"
```

---

## Task 4: Ambiente Local + Testes de Integração

**Files:**
- Create: `src/repositories/__tests__/schema.integration.test.ts`
- Create: `.env.test`

- [ ] **Step 1: Subir Supabase local**

```bash
supabase start
```

Esperado: output com URLs locais incluindo:
```
API URL: http://127.0.0.1:54321
DB URL:  postgresql://postgres:postgres@127.0.0.1:54322/postgres
Studio:  http://127.0.0.1:54323
```

- [ ] **Step 2: Confirmar tabelas no Supabase Studio local**

Acessar `http://127.0.0.1:54323` → Table Editor → verificar `students` e `assessments`.

- [ ] **Step 3: Instalar dependências de teste**

```bash
npm install -D jest @types/jest ts-jest pg @types/pg
```

- [ ] **Step 4: Adicionar script de teste ao `package.json`**

```json
"scripts": {
  "test:integration": "jest --testPathPattern=integration"
}
```

- [ ] **Step 5: Verificar ou criar `jest.config.js`**

Se não existir:

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@repositories/(.*)$': '<rootDir>/src/repositories/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
  },
};
```

- [ ] **Step 6: Criar `.env.test`**

```env
SUPABASE_DB_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres
```

- [ ] **Step 7: Escrever os testes — verificar que o teste falha sem banco**

```bash
npx jest schema.integration
```

Esperado: FAIL com `connection refused` (banco não está rodando ainda em CI).

- [ ] **Step 8: Criar `src/repositories/__tests__/schema.integration.test.ts`**

```typescript
import { Client } from 'pg';

const DB_URL =
  process.env.SUPABASE_DB_URL ??
  'postgresql://postgres:postgres@127.0.0.1:54322/postgres';

describe('Schema Integration', () => {
  let client: Client;

  beforeAll(async () => {
    client = new Client({ connectionString: DB_URL });
    await client.connect();
  });

  afterAll(async () => {
    await client.end();
  });

  it('students table has required columns', async () => {
    const res = await client.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'students' ORDER BY column_name
    `);
    const cols = res.rows.map((r: any) => r.column_name);
    expect(cols).toContain('id');
    expect(cols).toContain('user_id');
    expect(cols).toContain('name');
    expect(cols).toContain('created_at');
  });

  it('assessments table has all photo columns', async () => {
    const res = await client.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'assessments' ORDER BY column_name
    `);
    const cols = res.rows.map((r: any) => r.column_name);
    expect(cols).toContain('id');
    expect(cols).toContain('student_id');
    expect(cols).toContain('user_id');
    expect(cols).toContain('photo_frente_antes');
    expect(cols).toContain('photo_frente_depois');
    expect(cols).toContain('photo_costas_antes');
    expect(cols).toContain('photo_costas_depois');
  });

  it('assessments.student_id has FK to students.id', async () => {
    const res = await client.query(`
      SELECT ccu.table_name AS foreign_table
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_name = 'assessments'
        AND kcu.column_name = 'student_id'
    `);
    expect(res.rows[0].foreign_table).toBe('students');
  });

  it('RLS is enabled on students', async () => {
    const res = await client.query(
      `SELECT rowsecurity FROM pg_tables WHERE tablename = 'students'`
    );
    expect(res.rows[0].rowsecurity).toBe(true);
  });

  it('RLS is enabled on assessments', async () => {
    const res = await client.query(
      `SELECT rowsecurity FROM pg_tables WHERE tablename = 'assessments'`
    );
    expect(res.rows[0].rowsecurity).toBe(true);
  });
});
```

- [ ] **Step 9: Rodar os testes com banco local ativo**

```bash
npm run test:integration
```

Esperado: 5 passing.

- [ ] **Step 10: Commit**

```bash
git add src/repositories/__tests__/ jest.config.js .env.test .gitignore package.json
git commit -m "test: add schema integration tests"
```

---

## Task 5: Aplicar no Ambiente Remoto

- [ ] **Step 1: Push das migrations para o projeto remoto**

```bash
supabase db push
```

Esperado: `Finished supabase db push.`

- [ ] **Step 2: Criar bucket `assessment-photos`**

No Supabase Dashboard → Storage → New bucket → nome: `assessment-photos` → marcar **Public**.

- [ ] **Step 3: Verificar no Dashboard remoto**

Table Editor → confirmar `students` e `assessments` com RLS ativo (cadeado).

---

## Verificação Final

- [ ] `supabase db diff` mostra `No schema changes found`
- [ ] `npm run test:integration` → 5 passing (com `supabase start` ativo)
- [ ] Tabelas visíveis no Studio local (`http://127.0.0.1:54323`)
- [ ] Tabelas visíveis no Dashboard remoto
- [ ] Bucket `assessment-photos` criado como Public
