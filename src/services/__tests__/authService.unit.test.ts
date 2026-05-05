import { supabase } from '@lib/supabase';

import { signIn, signOut, updatePassword } from '../authService';

jest.mock('@lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      updateUser: jest.fn(),
    },
  },
}));

const mockSignIn = supabase.auth.signInWithPassword as jest.Mock;
const mockSignOut = supabase.auth.signOut as jest.Mock;
const mockUpdateUser = supabase.auth.updateUser as jest.Mock;

describe('authService', () => {
  beforeEach(() => jest.clearAllMocks());

  it('signIn returns user on success', async () => {
    mockSignIn.mockResolvedValueOnce({
      data: { user: { id: 'u_1' } },
      error: null,
    });
    const user = await signIn('a@b.com', '123456');
    expect(user).toEqual({ id: 'u_1' });
  });

  it('signIn throws on error', async () => {
    mockSignIn.mockResolvedValueOnce({
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

  it('updatePassword calls updateUser with password', async () => {
    mockUpdateUser.mockResolvedValueOnce({ data: {}, error: null });
    await updatePassword('newpass123');
    expect(mockUpdateUser).toHaveBeenCalledWith({ password: 'newpass123' });
  });

  it('updatePassword throws on error', async () => {
    mockUpdateUser.mockResolvedValueOnce({
      error: { message: 'weak password' },
    });
    await expect(updatePassword('123')).rejects.toMatchObject({
      message: 'weak password',
    });
  });
});
