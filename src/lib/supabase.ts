import * as SecureStore from 'expo-secure-store';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

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
