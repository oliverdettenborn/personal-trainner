import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase, initialUrlType } from '@lib/supabase';

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsPasswordSet, setNeedsPasswordSet] = useState(
    () => initialUrlType === 'invite' || initialUrlType === 'recovery',
  );

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s);
      if (event === 'PASSWORD_RECOVERY') setNeedsPasswordSet(true);
      if (event === 'USER_UPDATED') setNeedsPasswordSet(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { session, loading, userId: session?.user.id ?? null, needsPasswordSet };
}
