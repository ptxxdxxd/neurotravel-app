import { createClient } from '@supabase/supabase-js';

// Supabase project settings. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env
// to point at your own project; the values below are the defaults for the hosted app.
// The anon key is a public, client-side key. Access is controlled by row level security.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vabrourjisvcxbekhvcw.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhYnJvdXJqaXN2Y3hiZWtodmN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyNDg3MTQsImV4cCI6MjA3MDgyNDcxNH0.I4dxrrPSGTksy6Vd89kC2POn04paW6CrhkJg1iBIV2s';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Helper function to get current user
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error('Error getting user:', error);
    return null;
  }
  return user;
}