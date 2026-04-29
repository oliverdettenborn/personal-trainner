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
    let authChangeCallback: (event: string, session: unknown) => void;
    mockOnAuthStateChange.mockImplementation((cb: typeof authChangeCallback) => {
      authChangeCallback = cb;
      return { data: { subscription: { unsubscribe: jest.fn() } } };
    });
    const { result } = renderHook(() => useAuth());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const newSession = { user: { id: 'u_456' } };
    act(() => authChangeCallback('SIGNED_IN', newSession));
    expect(result.current.session).toEqual(newSession);
    expect(result.current.userId).toBe('u_456');
  });
});
