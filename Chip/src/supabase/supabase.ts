import 'react-native-url-polyfill/auto';
import {createClient} from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const supabaseUrl = 'https://qsqweweesjdcztnhowwj.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzcXdld2Vlc2pkY3p0bmhvd3dqIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODk3MTQxODEsImV4cCI6MjAwNTI5MDE4MX0.rpFRghNQFmtW08m3aIAoHe4CGhvvTwjRRvmiMPqCT18';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
