jest.mock('@lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
    },
  },
}));

import { supabase } from '@lib/supabase';
import { signIn, signOut } from '../authService';

const mockSignIn = supabase.auth.signInWithPassword as jest.Mock;
const mockSignOut = supabase.auth.signOut as jest.Mock;

describe('authService', () => {
  beforeEach(() => jest.clearAllMocks());

  it('signIn returns user on success', async () => {
    mockSignIn.mockResolvedValueOnce({ data: { user: { id: 'u_1' } }, error: null });
    const user = await signIn('a@b.com', '123456');
    expect(user).toEqual({ id: 'u_1' });
  });

  it('signIn throws on error', async () => {
    mockSignIn.mockResolvedValueOnce({ data: {}, error: { message: 'Invalid credentials' } });
    await expect(signIn('a@b.com', 'wrong')).rejects.toMatchObject({ message: 'Invalid credentials' });
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
