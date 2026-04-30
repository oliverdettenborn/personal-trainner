import * as SecureStore from 'expo-secure-store';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

// Captured before createClient processes and clears the URL hash/code
const _isWeb = Platform.OS === 'web' && typeof window !== 'undefined';
const _hashType = _isWeb ? new URLSearchParams(window.location.hash.slice(1)).get('type') : null;
const _searchType = _isWeb ? new URLSearchParams(window.location.search).get('type') : null;
export const initialUrlType: string | null = _hashType || _searchType;

// True when the URL carries a Supabase auth callback (hash tokens or PKCE code)
export const hasAuthCallback: boolean = _isWeb
  ? window.location.hash.includes('access_token') ||
    window.location.search.includes('code=') ||
    !!initialUrlType
  : false;

const storage =
  Platform.OS === 'web'
    ? undefined
    : {
        getItem: SecureStore.getItemAsync,
        setItem: SecureStore.setItemAsync,
        removeItem: SecureStore.deleteItemAsync,
      };

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: { storage, autoRefreshToken: true, persistSession: true } },
);
