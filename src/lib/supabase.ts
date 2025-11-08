import { createClient } from '@supabase/supabase-js';

// Use the working Supabase configuration
const supabaseUrl = 'https://vabrourjisvcxbekhvcw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhYnJvdXJqaXN2Y3hiZWtodmN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyNDg3MTQsImV4cCI6MjA3MDgyNDcxNH0.I4dxrrPSGTksy6Vd89kC2POn04paW6CrhkJg1iBIV2s';

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