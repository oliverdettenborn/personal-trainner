import { supabase, initialUrlType, hasAuthCallback } from '@lib/supabase';
import { Session } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsPasswordSet, setNeedsPasswordSet] = useState(
    () => initialUrlType === 'invite' || initialUrlType === 'recovery',
  );

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s);
      if (event === 'PASSWORD_RECOVERY') setNeedsPasswordSet(true);
      if (
        event === 'SIGNED_IN'
        && hasAuthCallback
        && (initialUrlType === 'invite' || initialUrlType === 'recovery')
      ) {
        setNeedsPasswordSet(true);
      }
      if (event === 'USER_UPDATED') setNeedsPasswordSet(false);
      // When there's an auth callback (invite/recovery URL), keep loading=true until
      // we have a definitive result — prevents premature login redirect before SIGNED_IN fires.
      // For normal usage (no callback), INITIAL_SESSION is enough to unblock routing.
      if (!hasAuthCallback && event === 'INITIAL_SESSION') setLoading(false);
      if (
        event === 'SIGNED_IN'
        || event === 'SIGNED_OUT'
        || event === 'PASSWORD_RECOVERY'
      ) setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    session,
    loading,
    userId: session?.user.id ?? null,
    needsPasswordSet,
  };
}
