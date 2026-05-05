# Spec 2: AsyncStorage → Supabase (sem autenticação)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Substituir AsyncStorage por Supabase como camada de persistência, usando repository pattern com interfaces TypeScript para desacoplar o app do Supabase. Fotos vão para o Supabase Storage. O `userId` é fixo neste spec (sem auth real) — Spec 3 adiciona auth.

**Architecture:** Repository pattern com interfaces (`IStudentRepository`, `IAssessmentRepository`, `IStorageRepository`). O app depende apenas das interfaces. `src/repositories/index.ts` é o único ponto de troca — para migrar para um backend HTTP no futuro, só esse arquivo muda. `useAssessment.ts` não referencia Supabase diretamente.

**Tech Stack:** `@supabase/supabase-js`, `react-native-url-polyfill`, Jest + `@supabase/supabase-js` mock (unit tests), Jest + pg (integration tests).

**Depende de:** Spec 1 (banco criado + migrations aplicadas + ambiente local ativo).

---

## Context

Migração principal de dados. Auth será adicionado no Spec 3. Por ora, usamos um `userId` placeholder `'anon'` para satisfazer as interfaces — o RLS ficará desativado até o Spec 3 (ou usamos service role key localmente).

---

## File Structure

| Arquivo                                                                | Ação      | Responsabilidade                                   |
| ---------------------------------------------------------------------- | --------- | -------------------------------------------------- |
| `src/lib/supabase.ts`                                                  | Criar     | Cliente Supabase singleton                         |
| `src/repositories/IStudentRepository.ts`                               | Criar     | Interface de acesso a students                     |
| `src/repositories/IAssessmentRepository.ts`                            | Criar     | Interface de acesso a assessments                  |
| `src/repositories/IStorageRepository.ts`                               | Criar     | Interface de upload/delete de fotos                |
| `src/repositories/supabase/SupabaseStudentRepository.ts`               | Criar     | Implementação Supabase                             |
| `src/repositories/supabase/SupabaseAssessmentRepository.ts`            | Criar     | Implementação Supabase                             |
| `src/repositories/supabase/SupabaseStorageRepository.ts`               | Criar     | Implementação Supabase Storage                     |
| `src/repositories/index.ts`                                            | Criar     | Único ponto de troca de implementação              |
| `src/repositories/__tests__/SupabaseStudentRepository.unit.test.ts`    | Criar     | Unit tests (mock client)                           |
| `src/repositories/__tests__/SupabaseAssessmentRepository.unit.test.ts` | Criar     | Unit tests (mock client)                           |
| `src/repositories/__tests__/repositories.integration.test.ts`          | Criar     | Integration tests (banco local)                    |
| `src/hooks/useAssessment.ts`                                           | Modificar | Trocar AsyncStorage por repositórios               |
| `app/index.tsx`                                                        | Modificar | Fotos via IStorageRepository                       |
| `tsconfig.json`                                                        | Modificar | Aliases `@lib/*`, `@repositories/*`, `@services/*` |

---

## Task 1: Supabase Client + Aliases

**Files:**

- Create: `src/lib/supabase.ts`
- Modify: `tsconfig.json`

- [ ] **Step 1: Instalar dependências**

```bash
npx expo install @supabase/supabase-js react-native-url-polyfill expo-secure-store
```

- [ ] **Step 2: Criar `src/lib/supabase.ts`**

```typescript
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      storage: Platform.OS === 'web' ? undefined : ExpoSecureStoreAdapter,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  },
);
```

- [ ] **Step 3: Adicionar aliases ao `tsconfig.json`**

Dentro de `compilerOptions.paths`, adicionar:

```json
"@lib/*": ["src/lib/*"],
"@repositories/*": ["src/repositories/*"],
"@services/*": ["src/services/*"]
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/supabase.ts tsconfig.json package.json package-lock.json
git commit -m "feat: add supabase client and tsconfig aliases"
```

---

## Task 2: Repository Interfaces

**Files:**

- Create: `src/repositories/IStudentRepository.ts`
- Create: `src/repositories/IAssessmentRepository.ts`
- Create: `src/repositories/IStorageRepository.ts`

- [ ] **Step 1: Criar `src/repositories/IStudentRepository.ts`**

```typescript
import { Student } from '@/src/types/assessment';

export interface IStudentRepository {
  findAll(): Promise<Student[]>;
  insert(student: Student): Promise<void>;
  delete(id: string): Promise<void>;
}
```

- [ ] **Step 2: Criar `src/repositories/IAssessmentRepository.ts`**

```typescript
import { Assessment } from '@/src/types/assessment';

export interface IAssessmentRepository {
  findAll(): Promise<Assessment[]>;
  insert(assessment: Assessment): Promise<void>;
  upsert(assessment: Assessment): Promise<void>;
  delete(id: string): Promise<void>;
}
```

- [ ] **Step 3: Criar `src/repositories/IStorageRepository.ts`**

```typescript
export interface IStorageRepository {
  uploadPhoto(userId: string, assessmentId: string, field: string, uri: string): Promise<string>;
  deletePhoto(url: string): Promise<void>;
}
```

- [ ] **Step 4: Commit**

```bash
git add src/repositories/
git commit -m "feat: add repository interfaces"
```

---

## Task 3: Unit Tests das Interfaces (escrita antes das implementações — TDD)

**Files:**

- Create: `src/repositories/__tests__/SupabaseStudentRepository.unit.test.ts`
- Create: `src/repositories/__tests__/SupabaseAssessmentRepository.unit.test.ts`

- [ ] **Step 1: Escrever o teste de `SupabaseStudentRepository` — verificar que falha**

```typescript
// src/repositories/__tests__/SupabaseStudentRepository.unit.test.ts
import { SupabaseStudentRepository } from '../supabase/SupabaseStudentRepository';
import { Student } from '@/src/types/assessment';

const mockSelect = jest.fn().mockReturnThis();
const mockOrder = jest.fn().mockResolvedValue({ data: [], error: null });
const mockInsert = jest.fn().mockResolvedValue({ error: null });
const mockDelete = jest.fn().mockReturnThis();
const mockEq = jest.fn().mockResolvedValue({ error: null });

const mockClient = {
  from: jest.fn().mockReturnValue({
    select: mockSelect,
    order: mockOrder,
    insert: mockInsert,
    delete: mockDelete,
    eq: mockEq,
  }),
} as any;

const USER_ID = 'user-123';

describe('SupabaseStudentRepository', () => {
  let repo: SupabaseStudentRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    repo = new SupabaseStudentRepository(mockClient, USER_ID);
  });

  it('findAll returns empty array when no students', async () => {
    mockOrder.mockResolvedValueOnce({ data: [], error: null });
    const result = await repo.findAll();
    expect(result).toEqual([]);
  });

  it('findAll maps db row to Student shape', async () => {
    mockOrder.mockResolvedValueOnce({
      data: [{ id: 's_1', name: 'Ana', created_at: 1000, user_id: USER_ID }],
      error: null,
    });
    const result = await repo.findAll();
    expect(result[0]).toEqual({ id: 's_1', name: 'Ana', createdAt: 1000 });
  });

  it('insert calls from("students").insert with user_id', async () => {
    const student: Student = { id: 's_2', name: 'Bob', createdAt: 2000 };
    await repo.insert(student);
    expect(mockClient.from).toHaveBeenCalledWith('students');
    expect(mockInsert).toHaveBeenCalledWith({
      id: 's_2',
      user_id: USER_ID,
      name: 'Bob',
      created_at: 2000,
    });
  });

  it('insert throws when supabase returns error', async () => {
    mockInsert.mockResolvedValueOnce({ error: { message: 'unique violation' } });
    const student: Student = { id: 's_3', name: 'Carol', createdAt: 3000 };
    await expect(repo.insert(student)).rejects.toMatchObject({ message: 'unique violation' });
  });

  it('delete calls from("students").delete().eq("id", id)', async () => {
    await repo.delete('s_1');
    expect(mockDelete).toHaveBeenCalled();
    expect(mockEq).toHaveBeenCalledWith('id', 's_1');
  });
});
```

- [ ] **Step 2: Rodar — deve falhar com "Cannot find module"**

```bash
npx jest SupabaseStudentRepository.unit
```

Esperado: FAIL — `Cannot find module '../supabase/SupabaseStudentRepository'`

- [ ] **Step 3: Escrever o teste de `SupabaseAssessmentRepository`**

```typescript
// src/repositories/__tests__/SupabaseAssessmentRepository.unit.test.ts
import { SupabaseAssessmentRepository } from '../supabase/SupabaseAssessmentRepository';
import { Assessment } from '@/src/types/assessment';

const mockOrder = jest.fn().mockResolvedValue({ data: [], error: null });
const mockInsert = jest.fn().mockResolvedValue({ error: null });
const mockUpsert = jest.fn().mockResolvedValue({ error: null });
const mockDelete = jest.fn().mockReturnThis();
const mockEq = jest.fn().mockResolvedValue({ error: null });

const mockClient = {
  from: jest.fn().mockReturnValue({
    select: jest.fn().mockReturnThis(),
    order: mockOrder,
    insert: mockInsert,
    upsert: mockUpsert,
    delete: mockDelete,
    eq: mockEq,
  }),
} as any;

const USER_ID = 'user-456';

describe('SupabaseAssessmentRepository', () => {
  let repo: SupabaseAssessmentRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    repo = new SupabaseAssessmentRepository(mockClient, USER_ID);
  });

  it('findAll maps db row to Assessment shape', async () => {
    mockOrder.mockResolvedValueOnce({
      data: [
        {
          id: 'a_1',
          student_id: 's_1',
          user_id: USER_ID,
          created_at: 1000,
          positivo_1: 'Ótimo',
        },
      ],
      error: null,
    });
    const result = await repo.findAll();
    expect(result[0]).toMatchObject({
      id: 'a_1',
      studentId: 's_1',
      createdAt: 1000,
      positivo_1: 'Ótimo',
    });
    expect(result[0]).not.toHaveProperty('student_id');
    expect(result[0]).not.toHaveProperty('user_id');
  });

  it('insert maps Assessment to db row with user_id', async () => {
    const assessment: Assessment = {
      id: 'a_2',
      studentId: 's_1',
      createdAt: 2000,
      positivo_1: 'Bom',
    };
    await repo.insert(assessment);
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'a_2',
        student_id: 's_1',
        user_id: USER_ID,
        created_at: 2000,
        positivo_1: 'Bom',
      }),
    );
  });

  it('upsert calls supabase upsert', async () => {
    const assessment: Assessment = { id: 'a_3', studentId: 's_1', createdAt: 3000 };
    await repo.upsert(assessment);
    expect(mockUpsert).toHaveBeenCalled();
  });

  it('delete removes by id', async () => {
    await repo.delete('a_1');
    expect(mockDelete).toHaveBeenCalled();
    expect(mockEq).toHaveBeenCalledWith('id', 'a_1');
  });
});
```

- [ ] **Step 4: Rodar — deve falhar com "Cannot find module"**

```bash
npx jest SupabaseAssessmentRepository.unit
```

Esperado: FAIL — `Cannot find module '../supabase/SupabaseAssessmentRepository'`

---

## Task 4: Implementações Supabase

**Files:**

- Create: `src/repositories/supabase/SupabaseStudentRepository.ts`
- Create: `src/repositories/supabase/SupabaseAssessmentRepository.ts`
- Create: `src/repositories/supabase/SupabaseStorageRepository.ts`

- [ ] **Step 1: Criar `src/repositories/supabase/SupabaseStudentRepository.ts`**

```typescript
import { SupabaseClient } from '@supabase/supabase-js';
import { IStudentRepository } from '../IStudentRepository';
import { Student } from '@/src/types/assessment';

export class SupabaseStudentRepository implements IStudentRepository {
  constructor(
    private readonly client: SupabaseClient,
    private readonly userId: string,
  ) {}

  async findAll(): Promise<Student[]> {
    const { data, error } = await this.client
      .from('students')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) throw error;
    return (data ?? []).map((row) => ({
      id: row.id,
      name: row.name,
      createdAt: row.created_at,
    }));
  }

  async insert(student: Student): Promise<void> {
    const { error } = await this.client.from('students').insert({
      id: student.id,
      user_id: this.userId,
      name: student.name,
      created_at: student.createdAt,
    });
    if (error) throw error;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.client.from('students').delete().eq('id', id);
    if (error) throw error;
  }
}
```

- [ ] **Step 2: Rodar unit tests do Student — devem passar**

```bash
npx jest SupabaseStudentRepository.unit
```

Esperado: 5 passing.

- [ ] **Step 3: Criar `src/repositories/supabase/SupabaseAssessmentRepository.ts`**

```typescript
import { SupabaseClient } from '@supabase/supabase-js';
import { IAssessmentRepository } from '../IAssessmentRepository';
import { Assessment } from '@/src/types/assessment';

export class SupabaseAssessmentRepository implements IAssessmentRepository {
  constructor(
    private readonly client: SupabaseClient,
    private readonly userId: string,
  ) {}

  async findAll(): Promise<Assessment[]> {
    const { data, error } = await this.client
      .from('assessments')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) throw error;
    return (data ?? []).map(
      ({ user_id, student_id, created_at, ...rest }) =>
        ({
          ...rest,
          studentId: student_id,
          createdAt: created_at,
        }) as Assessment,
    );
  }

  async insert(assessment: Assessment): Promise<void> {
    const { studentId, createdAt, ...rest } = assessment;
    const { error } = await this.client.from('assessments').insert({
      ...rest,
      student_id: studentId,
      user_id: this.userId,
      created_at: createdAt,
    });
    if (error) throw error;
  }

  async upsert(assessment: Assessment): Promise<void> {
    const { studentId, createdAt, ...rest } = assessment;
    const { error } = await this.client.from('assessments').upsert({
      ...rest,
      student_id: studentId,
      user_id: this.userId,
      created_at: createdAt,
    });
    if (error) throw error;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.client.from('assessments').delete().eq('id', id);
    if (error) throw error;
  }
}
```

- [ ] **Step 4: Rodar unit tests do Assessment — devem passar**

```bash
npx jest SupabaseAssessmentRepository.unit
```

Esperado: 4 passing.

- [ ] **Step 5: Criar `src/repositories/supabase/SupabaseStorageRepository.ts`**

```typescript
import { SupabaseClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import { IStorageRepository } from '../IStorageRepository';

const BUCKET = 'assessment-photos';

export class SupabaseStorageRepository implements IStorageRepository {
  constructor(private readonly client: SupabaseClient) {}

  async uploadPhoto(
    userId: string,
    assessmentId: string,
    field: string,
    uri: string,
  ): Promise<string> {
    const ext = uri.split('.').pop() ?? 'jpg';
    const path = `${userId}/${assessmentId}/${field}.${ext}`;

    if (Platform.OS === 'web') {
      const res = await fetch(uri);
      const blob = await res.blob();
      const { error } = await this.client.storage
        .from(BUCKET)
        .upload(path, blob, { upsert: true, contentType: blob.type });
      if (error) throw error;
    } else {
      const formData = new FormData();
      formData.append('file', { uri, name: `${field}.${ext}`, type: `image/${ext}` } as any);
      const { error } = await this.client.storage
        .from(BUCKET)
        .upload(path, formData, { upsert: true });
      if (error) throw error;
    }

    const { data } = this.client.storage.from(BUCKET).getPublicUrl(path);
    return data.publicUrl;
  }

  async deletePhoto(publicUrl: string): Promise<void> {
    const path = publicUrl.split(`/storage/v1/object/public/${BUCKET}/`)[1];
    if (!path) return;
    await this.client.storage.from(BUCKET).remove([path]);
  }
}
```

- [ ] **Step 6: Commit**

```bash
git add src/repositories/supabase/
git commit -m "feat: add supabase repository implementations"
```

---

## Task 5: Integration Tests dos Repositórios

**Files:**

- Create: `src/repositories/__tests__/repositories.integration.test.ts`

Estes testes rodam contra o banco local (`supabase start`) e verificam o comportamento real de CRUD.

- [ ] **Step 1: Verificar que `supabase start` está ativo**

```bash
supabase status
```

Esperado: `API URL: http://127.0.0.1:54321`

- [ ] **Step 2: Escrever os testes de integração — verificar que falham sem dados**

```typescript
// src/repositories/__tests__/repositories.integration.test.ts
import { createClient } from '@supabase/supabase-js';
import { SupabaseStudentRepository } from '../supabase/SupabaseStudentRepository';
import { SupabaseAssessmentRepository } from '../supabase/SupabaseAssessmentRepository';
import { Student, Assessment } from '@/src/types/assessment';

// Usa service role key local para bypassar RLS nos testes
const SUPABASE_URL = 'http://127.0.0.1:54321';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// A service role key aparece no output de `supabase start`
const client = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
const USER_ID = 'test-user-integration';

describe('Repository Integration Tests', () => {
  let studentRepo: SupabaseStudentRepository;
  let assessmentRepo: SupabaseAssessmentRepository;

  const testStudent: Student = {
    id: `s_test_${Date.now()}`,
    name: 'Integration Test Student',
    createdAt: Date.now(),
  };

  const testAssessment: Assessment = {
    id: `a_test_${Date.now()}`,
    studentId: testStudent.id,
    createdAt: Date.now(),
    positivo_1: 'Bom desempenho',
  };

  beforeAll(() => {
    studentRepo = new SupabaseStudentRepository(client, USER_ID);
    assessmentRepo = new SupabaseAssessmentRepository(client, USER_ID);
  });

  afterAll(async () => {
    // Limpeza
    await client.from('assessments').delete().eq('id', testAssessment.id);
    await client.from('students').delete().eq('id', testStudent.id);
  });

  it('inserts and finds a student', async () => {
    await studentRepo.insert(testStudent);
    const students = await studentRepo.findAll();
    const found = students.find((s) => s.id === testStudent.id);
    expect(found).toMatchObject({ id: testStudent.id, name: testStudent.name });
  });

  it('inserts and finds an assessment', async () => {
    await assessmentRepo.insert(testAssessment);
    const assessments = await assessmentRepo.findAll();
    const found = assessments.find((a) => a.id === testAssessment.id);
    expect(found).toMatchObject({
      id: testAssessment.id,
      studentId: testStudent.id,
      positivo_1: 'Bom desempenho',
    });
  });

  it('upserts updated fields', async () => {
    const updated = { ...testAssessment, positivo_1: 'Excelente' };
    await assessmentRepo.upsert(updated);
    const assessments = await assessmentRepo.findAll();
    const found = assessments.find((a) => a.id === testAssessment.id);
    expect(found?.positivo_1).toBe('Excelente');
  });

  it('deletes assessment', async () => {
    await assessmentRepo.delete(testAssessment.id);
    const assessments = await assessmentRepo.findAll();
    expect(assessments.find((a) => a.id === testAssessment.id)).toBeUndefined();
  });

  it('deletes student (cascades to assessments)', async () => {
    await studentRepo.delete(testStudent.id);
    const students = await studentRepo.findAll();
    expect(students.find((s) => s.id === testStudent.id)).toBeUndefined();
  });
});
```

- [ ] **Step 3: Adicionar `SUPABASE_SERVICE_ROLE_KEY` no `.env.test`**

Copiar a `service_role key` do output de `supabase start`:

```env
SUPABASE_DB_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

- [ ] **Step 4: Rodar os integration tests**

```bash
npm run test:integration -- --testPathPattern=repositories.integration
```

Esperado: 5 passing.

- [ ] **Step 5: Commit**

```bash
git add src/repositories/__tests__/repositories.integration.test.ts .env.test
git commit -m "test: add repository integration tests"
```

---

## Task 6: Repository Index

**Files:**

- Create: `src/repositories/index.ts`

- [ ] **Step 1: Criar `src/repositories/index.ts`**

```typescript
import { supabase } from '@lib/supabase';
import { SupabaseStudentRepository } from './supabase/SupabaseStudentRepository';
import { SupabaseAssessmentRepository } from './supabase/SupabaseAssessmentRepository';
import { SupabaseStorageRepository } from './supabase/SupabaseStorageRepository';
import type { IStudentRepository } from './IStudentRepository';
import type { IAssessmentRepository } from './IAssessmentRepository';
import type { IStorageRepository } from './IStorageRepository';

export function createRepositories(userId: string): {
  students: IStudentRepository;
  assessments: IAssessmentRepository;
  storage: IStorageRepository;
} {
  return {
    students: new SupabaseStudentRepository(supabase, userId),
    assessments: new SupabaseAssessmentRepository(supabase, userId),
    storage: new SupabaseStorageRepository(supabase),
  };
}

// Para migrar para HTTP no futuro:
// Trocar as 3 linhas acima por HttpXRepository(API_URL, token)
// Zero mudança em useAssessment ou nos componentes.

export type { IStudentRepository, IAssessmentRepository, IStorageRepository };
```

- [ ] **Step 2: Commit**

```bash
git add src/repositories/index.ts
git commit -m "feat: add repository index (single swap point)"
```

---

## Task 7: Migrar useAssessment

**Files:**

- Modify: `src/hooks/useAssessment.ts`

- [ ] **Step 1: Ler `src/hooks/useAssessment.ts` atual na íntegra**

- [ ] **Step 2: Reescrever `src/hooks/useAssessment.ts`**

```typescript
import { useState, useCallback, useRef, useMemo } from 'react';
import { useFocusEffect } from 'expo-router';
import { AssessmentDB, Student, Assessment } from '@/src/types/assessment';
import { createRepositories } from '@repositories/index';

const DEBOUNCE_MS = 2000;
const ANON_USER_ID = 'anon'; // substituído por userId real no Spec 3
const EMPTY_DB: AssessmentDB = { students: {}, assessments: {} };

export function useAssessment() {
  const [db, setDb] = useState<AssessmentDB>(EMPTY_DB);
  const [loading, setLoading] = useState(true);
  const [currentStudentId, setCurrentStudentId] = useState<string | null>(null);
  const [currentAssessmentId, setCurrentAssessmentId] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const repos = useMemo(() => createRepositories(ANON_USER_ID), []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      Promise.all([repos.students.findAll(), repos.assessments.findAll()])
        .then(([students, assessments]) => {
          const studentsMap: Record<string, Student> = {};
          students.forEach((s) => {
            studentsMap[s.id] = s;
          });
          const assessmentsMap: Record<string, Assessment> = {};
          assessments.forEach((a) => {
            assessmentsMap[a.id] = a;
          });
          setDb({ students: studentsMap, assessments: assessmentsMap });
          if (!currentStudentId && students.length > 0) {
            const firstId = students[0].id;
            setCurrentStudentId(firstId);
            const first = assessments
              .filter((a) => a.studentId === firstId)
              .sort((a, b) => b.createdAt - a.createdAt)[0];
            if (first) setCurrentAssessmentId(first.id);
          }
        })
        .finally(() => setLoading(false));
    }, [repos]),
  );

  const addStudent = useCallback(
    async (name: string) => {
      const student: Student = {
        id: `s_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        name,
        createdAt: Date.now(),
      };
      const assessment: Assessment = {
        id: `a_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        studentId: student.id,
        createdAt: Date.now(),
      };
      await repos.students.insert(student);
      await repos.assessments.insert(assessment);
      setDb((prev) => ({
        students: { ...prev.students, [student.id]: student },
        assessments: { ...prev.assessments, [assessment.id]: assessment },
      }));
      setCurrentStudentId(student.id);
      setCurrentAssessmentId(assessment.id);
    },
    [repos],
  );

  const removeStudent = useCallback(
    async (id: string) => {
      await repos.students.delete(id);
      setDb((prev) => {
        const students = { ...prev.students };
        const assessments = { ...prev.assessments };
        delete students[id];
        Object.values(assessments)
          .filter((a) => a.studentId === id)
          .forEach((a) => delete assessments[a.id]);
        return { students, assessments };
      });
      if (currentStudentId === id) {
        setCurrentStudentId(null);
        setCurrentAssessmentId(null);
      }
    },
    [repos, currentStudentId],
  );

  const addAssessment = useCallback(
    async (studentId: string) => {
      const assessment: Assessment = {
        id: `a_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        studentId,
        createdAt: Date.now(),
      };
      await repos.assessments.insert(assessment);
      setDb((prev) => ({
        ...prev,
        assessments: { ...prev.assessments, [assessment.id]: assessment },
      }));
      setCurrentAssessmentId(assessment.id);
    },
    [repos],
  );

  const updateAssessment = useCallback(
    (id: string, data: Partial<Assessment>) => {
      setDb((prev) => {
        const updated = { ...prev.assessments[id], ...data };
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
          repos.assessments.upsert(updated).catch(console.error);
        }, DEBOUNCE_MS);
        return { ...prev, assessments: { ...prev.assessments, [id]: updated } };
      });
    },
    [repos],
  );

  const removeAssessment = useCallback(
    async (id: string) => {
      await repos.assessments.delete(id);
      setDb((prev) => {
        const assessments = { ...prev.assessments };
        delete assessments[id];
        return { ...prev, assessments };
      });
      if (currentAssessmentId === id) {
        const remaining = Object.values(db.assessments)
          .filter((a) => a.id !== id && a.studentId === currentStudentId)
          .sort((a, b) => b.createdAt - a.createdAt);
        setCurrentAssessmentId(remaining[0]?.id ?? null);
      }
    },
    [repos, currentAssessmentId, currentStudentId, db.assessments],
  );

  const saveManual = useCallback(async () => {
    if (!currentAssessmentId) return;
    const assessment = db.assessments[currentAssessmentId];
    if (assessment) await repos.assessments.upsert(assessment);
  }, [repos, currentAssessmentId, db.assessments]);

  const importFromJSON = useCallback(
    async (jsonData: any) => {
      const imported = jsonData as AssessmentDB;
      await Promise.all([
        ...Object.values(imported.students).map((s) => repos.students.insert(s)),
        ...Object.values(imported.assessments).map((a) => repos.assessments.insert(a)),
      ]);
      setDb((prev) => ({
        students: { ...prev.students, ...imported.students },
        assessments: { ...prev.assessments, ...imported.assessments },
      }));
    },
    [repos],
  );

  const currentStudent = currentStudentId ? db.students[currentStudentId] : null;
  const currentAssessment = currentAssessmentId ? db.assessments[currentAssessmentId] : null;
  const studentAssessments = currentStudentId
    ? Object.values(db.assessments).filter((a) => a.studentId === currentStudentId)
    : [];

  return {
    db,
    loading,
    currentStudentId,
    currentAssessmentId,
    currentStudent,
    currentAssessment,
    studentAssessments,
    setCurrentStudentId,
    setCurrentAssessmentId,
    addStudent,
    removeStudent,
    addAssessment,
    updateAssessment,
    removeAssessment,
    importFromJSON,
    saveManual,
  };
}
```

- [ ] **Step 3: Confirmar que AsyncStorage foi removido**

```bash
grep -r "AsyncStorage" src/ app/
```

Esperado: nenhum resultado.

- [ ] **Step 4: Commit**

```bash
git add src/hooks/useAssessment.ts
git commit -m "feat: migrate useAssessment to repository pattern (removes AsyncStorage)"
```

---

## Task 8: Migrar Upload de Fotos

**Files:**

- Modify: `app/index.tsx`

- [ ] **Step 1: Ler `app/index.tsx` e localizar handlers de foto**

Buscar por `photo_`, `updateAssessment` com foto, `ImagePicker`, `captureImage`.

- [ ] **Step 2: Adicionar handler de upload**

```typescript
import { createRepositories } from '@repositories/index';

// Dentro do componente (userId temporário até Spec 3):
const ANON_USER_ID = 'anon';

const handlePhotoCapture = useCallback(
  async (field: keyof Assessment, uri: string) => {
    if (!currentAssessmentId) return;
    const { storage } = createRepositories(ANON_USER_ID);
    const url = await storage.uploadPhoto(ANON_USER_ID, currentAssessmentId, field, uri);
    updateAssessment(currentAssessmentId, { [field]: url } as Partial<Assessment>);
  },
  [currentAssessmentId, updateAssessment],
);
```

Substituir o handler de foto existente por este.

- [ ] **Step 3: Remover dependência do AsyncStorage**

```bash
npm uninstall @react-native-async-storage/async-storage
```

- [ ] **Step 4: Commit**

```bash
git add app/index.tsx package.json package-lock.json
git commit -m "feat: upload photos to supabase storage; remove async-storage"
```

---

## Verificação Final

- [ ] `npx jest SupabaseStudentRepository.unit` → 5 passing
- [ ] `npx jest SupabaseAssessmentRepository.unit` → 4 passing
- [ ] `npm run test:integration -- --testPathPattern=repositories.integration` → 5 passing (com `supabase start` ativo)
- [ ] `grep -r "AsyncStorage" src/ app/` → sem resultados
- [ ] App roda (`npx expo start`) → dados carregam do Supabase, não do localStorage
- [ ] Adicionar aluno → aparece no Supabase Studio local (Table Editor → students)
- [ ] Foto capturada → aparece no Storage local (`http://127.0.0.1:54323` → Storage)
