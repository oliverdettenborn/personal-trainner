jest.mock('@lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(),
    },
  },
}));

import { renderHook, act, waitFor } from '@testing-library/react-native';
import { supabase } from '@lib/supabase';
import { useAuth } from '../useAuth';

const mockGetSession = supabase.auth.getSession as jest.Mock;
const mockOnAuthStateChange = supabase.auth.onAuthStateChange as jest.Mock;

type AuthCallback = (event: string, session: unknown) => void;

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: jest.fn() } },
    });
  });

  it('starts with loading=true and session=null', () => {
    mockGetSession.mockReturnValueOnce(new Promise(() => {}));
    const { result } = renderHook(() => useAuth());
    expect(result.current.loading).toBe(true);
    expect(result.current.session).toBeNull();
    expect(result.current.userId).toBeNull();
  });

  it('sets session after getSession resolves', async () => {
    const fakeSession = { user: { id: 'u_123' } };
    mockGetSession.mockResolvedValueOnce({ data: { session: fakeSession } });
    const { result } = renderHook(() => useAuth());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.session).toEqual(fakeSession);
    expect(result.current.userId).toBe('u_123');
  });

  it('updates session on auth state change', async () => {
    mockGetSession.mockResolvedValueOnce({ data: { session: null } });
    let cb: AuthCallback;
    mockOnAuthStateChange.mockImplementation((fn: AuthCallback) => {
      cb = fn;
      return { data: { subscription: { unsubscribe: jest.fn() } } };
    });
    const { result } = renderHook(() => useAuth());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const newSession = { user: { id: 'u_456' } };
    act(() => cb('SIGNED_IN', newSession));
    expect(result.current.session).toEqual(newSession);
    expect(result.current.userId).toBe('u_456');
  });

  it('needsPasswordSet starts false in normal session', async () => {
    mockGetSession.mockResolvedValueOnce({ data: { session: null } });
    const { result } = renderHook(() => useAuth());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.needsPasswordSet).toBe(false);
  });

  it('needsPasswordSet becomes true on PASSWORD_RECOVERY event', async () => {
    mockGetSession.mockResolvedValueOnce({ data: { session: null } });
    let cb: AuthCallback;
    mockOnAuthStateChange.mockImplementation((fn: AuthCallback) => {
      cb = fn;
      return { data: { subscription: { unsubscribe: jest.fn() } } };
    });
    const { result } = renderHook(() => useAuth());
    await waitFor(() => expect(result.current.loading).toBe(false));
    act(() => cb('PASSWORD_RECOVERY', null));
    expect(result.current.needsPasswordSet).toBe(true);
  });

  it('needsPasswordSet becomes false on USER_UPDATED event', async () => {
    mockGetSession.mockResolvedValueOnce({ data: { session: null } });
    let cb: AuthCallback;
    mockOnAuthStateChange.mockImplementation((fn: AuthCallback) => {
      cb = fn;
      return { data: { subscription: { unsubscribe: jest.fn() } } };
    });
    const { result } = renderHook(() => useAuth());
    await waitFor(() => expect(result.current.loading).toBe(false));
    act(() => cb('PASSWORD_RECOVERY', null));
    expect(result.current.needsPasswordSet).toBe(true);
    act(() => cb('USER_UPDATED', { user: { id: 'u_1' } }));
    expect(result.current.needsPasswordSet).toBe(false);
  });
});
