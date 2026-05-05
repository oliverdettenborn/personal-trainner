# Spec 3: Autenticação Multi-User (Supabase Auth)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adicionar autenticação email/password via Supabase Auth, proteger rotas com auth guard no root layout, e substituir o `userId` placeholder (`'anon'`) pelo ID real do usuário autenticado. O acesso é restrito a usuários previamente cadastrados manualmente pelo administrador (Personal Trainers autorizados).

**Architecture:** `useAuth` hook expõe `session` e `userId`. `useAssessment` recebe `userId` via parâmetro (em vez do placeholder). Root layout redireciona para `/login` se não autenticado. `createRepositories(userId)` é chamado com o ID real.

**Tech Stack:** Supabase Auth (email/password), `expo-secure-store` (já instalado no Spec 2), Expo Router, Jest + mocks do Supabase Auth (unit tests).

**Depende de:** Spec 1 (schema + RLS) + Spec 2 (repositórios + useAssessment migrado).

---

## Context

Após o Spec 2, o app funciona com dados no Supabase mas sem auth — qualquer requisição usa `user_id = 'anon'` e o RLS está efetivamente bypassado. Este spec fecha o ciclo: cada trainer tem seus dados isolados. O cadastro de novos treinadores é feito manualmente no Supabase Dashboard para controle total de acesso.

---

## User Management (Manual)

Antes de testar o login, o administrador deve:

1.  Acessar o Supabase Dashboard -> **Authentication** -> **Settings**.
2.  Desativar "Allow new users to sign up" para impedir auto-cadastro.
3.  Ir em **Users** -> **Add User** -> **Create new user**.
4.  Informar e-mail e senha do Personal Trainer.

---

## File Structure

| Arquivo                                           | Ação      | Responsabilidade                                             |
| ------------------------------------------------- | --------- | ------------------------------------------------------------ |
| `src/services/authService.ts`                     | Criar     | signIn, signOut                                              |
| `src/hooks/useAuth.ts`                            | Criar     | Estado reativo de sessão                                     |
| `src/hooks/useAssessment.ts`                      | Modificar | Receber `userId` como parâmetro (remover hardcoded `'anon'`) |
| `app/login.tsx`                                   | Criar     | Tela de login (apenas entrada)                               |
| `app/_layout.tsx`                                 | Modificar | Auth guard + passar `userId` para o hook                     |
| `app/index.tsx`                                   | Modificar | Usar `userId` real para fotos                                |
| `src/services/__tests__/authService.unit.test.ts` | Criar     | Unit tests do auth service                                   |
| `src/hooks/__tests__/useAuth.unit.test.ts`        | Criar     | Unit tests do hook                                           |

---

## Task 1: Auth Service

**Files:**

- Create: `src/services/authService.ts`
- Create: `src/services/__tests__/authService.unit.test.ts`

- [ ] **Step 1: Escrever os testes primeiro**

```typescript
// src/services/__tests__/authService.unit.test.ts
const mockSignInWithPassword = jest.fn();
const mockSignOut = jest.fn();

jest.mock('@lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: mockSignInWithPassword,
      signOut: mockSignOut,
    },
  },
}));

import { signIn, signOut } from '../authService';

describe('authService', () => {
  beforeEach(() => jest.clearAllMocks());

  it('signIn returns user on success', async () => {
    mockSignInWithPassword.mockResolvedValueOnce({
      data: { user: { id: 'u_1' } },
      error: null,
    });
    const user = await signIn('a@b.com', '123456');
    expect(user).toEqual({ id: 'u_1' });
  });

  it('signIn throws on error', async () => {
    mockSignInWithPassword.mockResolvedValueOnce({
      data: {},
      error: { message: 'Invalid credentials' },
    });
    await expect(signIn('a@b.com', 'wrong')).rejects.toMatchObject({
      message: 'Invalid credentials',
    });
  });

  it('signOut calls supabase.auth.signOut', async () => {
    mockSignOut.mockResolvedValueOnce({ error: null });
    await signOut();
    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });

  it('signOut throws on error', async () => {
    mockSignOut.mockResolvedValueOnce({ error: { message: 'network error' } });
    await expect(signOut()).rejects.toMatchObject({ message: 'network error' });
  });
});
```

- [ ] **Step 2: Rodar — deve falhar com "Cannot find module"**

```bash
npx jest authService.unit
```

- [ ] **Step 3: Criar `src/services/authService.ts`**

```typescript
import { supabase } from '@lib/supabase';

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.user;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
```

- [ ] **Step 4: Rodar — deve passar**

```bash
npx jest authService.unit
```

- [ ] **Step 5: Commit**

```bash
git add src/services/authService.ts src/services/__tests__/authService.unit.test.ts
git commit -m "feat: add auth service (signIn, signOut)"
```

---

## Task 2: useAuth Hook

**Files:**

- Create: `src/hooks/useAuth.ts`
- Create: `src/hooks/__tests__/useAuth.unit.test.ts`

- [ ] **Step 1: Escrever os testes**

```typescript
// src/hooks/__tests__/useAuth.unit.test.ts
import { renderHook, act } from '@testing-library/react-hooks';

const mockGetSession = jest.fn();
const mockOnAuthStateChange = jest.fn();

jest.mock('@lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: mockGetSession,
      onAuthStateChange: mockOnAuthStateChange,
    },
  },
}));

import { useAuth } from '../useAuth';

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: jest.fn() } },
    });
  });

  it('starts with loading=true and session=null', () => {
    mockGetSession.mockReturnValueOnce(new Promise(() => {})); // never resolves
    const { result } = renderHook(() => useAuth());
    expect(result.current.loading).toBe(true);
    expect(result.current.session).toBeNull();
    expect(result.current.userId).toBeNull();
  });

  it('sets session after getSession resolves', async () => {
    const fakeSession = { user: { id: 'u_123' } };
    mockGetSession.mockResolvedValueOnce({ data: { session: fakeSession } });
    const { result, waitForNextUpdate } = renderHook(() => useAuth());
    await waitForNextUpdate();
    expect(result.current.loading).toBe(false);
    expect(result.current.session).toEqual(fakeSession);
    expect(result.current.userId).toBe('u_123');
  });

  it('updates session on auth state change', async () => {
    mockGetSession.mockResolvedValueOnce({ data: { session: null } });
    let authChangeCallback: any;
    mockOnAuthStateChange.mockImplementation((cb: any) => {
      authChangeCallback = cb;
      return { data: { subscription: { unsubscribe: jest.fn() } } };
    });
    const { result, waitForNextUpdate } = renderHook(() => useAuth());
    await waitForNextUpdate();
    const newSession = { user: { id: 'u_456' } };
    act(() => authChangeCallback('SIGNED_IN', newSession));
    expect(result.current.session).toEqual(newSession);
    expect(result.current.userId).toBe('u_456');
  });
});
```

- [ ] **Step 2: Rodar — deve falhar**

```bash
npx jest useAuth.unit
```

- [ ] **Step 3: Criar `src/hooks/useAuth.ts`**

```typescript
import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@lib/supabase';

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { session, loading, userId: session?.user.id ?? null };
}
```

- [ ] **Step 4: Rodar — deve passar**

```bash
npx jest useAuth.unit
```

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useAuth.ts src/hooks/__tests__/useAuth.unit.test.ts
git commit -m "feat: add useAuth hook"
```

---

## Task 3: Tela de Login

**Files:**

- Create: `app/login.tsx`

- [ ] **Step 1: Criar `app/login.tsx`**

```typescript
import React, { useState } from 'react';
import {
  View, TextInput, Text, TouchableOpacity,
  StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { signIn } from '@services/authService';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await signIn(email, password);
    } catch (e: any) {
      setError('E-mail ou senha inválidos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.title}>Área do Treinador</Text>

      {error && <Text style={styles.error}>{error}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="email"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="current-password"
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.buttonText}>Entrar</Text>}
      </TouchableOpacity>

      <Text style={styles.info}>Acesso restrito. Entre em contato com o administrador para obter sua conta.</Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  error: { color: '#ef4444', marginBottom: 12, textAlign: 'center', fontSize: 14 },
  input: {
    borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8,
    padding: 12, marginBottom: 12, fontSize: 16,
  },
  button: {
    backgroundColor: '#6366f1', borderRadius: 8, padding: 14,
    alignItems: 'center', marginBottom: 16,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  info: { textAlign: 'center', color: '#6b7280', fontSize: 12, marginTop: 20 },
});
```

- [ ] **Step 2: Commit**

```bash
git add app/login.tsx
git commit -m "feat: add login screen (restricted access)"
```

---

## Task 4: Auth Guard no Root Layout

**Files:**

- Modify: `app/_layout.tsx`

- [ ] **Step 1: Ler `app/_layout.tsx` atual na íntegra**

- [ ] **Step 2: Adicionar auth guard preservando providers existentes**

- [ ] **Step 3: Commit**

---

## Task 5: Conectar userId Real ao useAssessment e Fotos

**Files:**

- Modify: `src/hooks/useAssessment.ts`
- Modify: `app/index.tsx`

- [ ] **Step 1: Modificar `useAssessment.ts` para receber `userId`**

- [ ] **Step 2: Modificar `app/index.tsx` para passar `userId` real**

- [ ] **Step 3: Commit**

---

## Task 6: Botão de Logout

**Files:**

- Modify: `src/components/organisms/AppHeader/AppHeader.tsx`

- [ ] **Step 1: Ler `AppHeader.tsx` para entender estrutura atual de botões**

- [ ] **Step 2: Adicionar botão de logout**

- [ ] **Step 3: Commit**

---

## Verificação Final

- [ ] `npx jest authService.unit` → 4 passing
- [ ] `npx jest useAuth.unit` → 3 passing
- [ ] App roda: `npx expo start`
- [ ] Acessar o app → redireciona para `/login`
- [ ] Login com credenciais criadas manualmente no Dashboard → redireciona para `/`
- [ ] Adicionar aluno → aparece no Supabase Dashboard com `user_id` correto
- [ ] Fazer logout → redireciona para `/login`
- [ ] Login de volta → dados do trainer aparecem (RLS isolando dados)
