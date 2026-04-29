import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@lib/supabase';

function detectNeedsPasswordSet(): boolean {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return false;
  const hash = window.location.hash;
  return hash.includes('type=invite') || hash.includes('type=recovery');
}

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsPasswordSet, setNeedsPasswordSet] = useState(detectNeedsPasswordSet);

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
