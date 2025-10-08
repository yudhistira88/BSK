import { createClient, SupabaseClient } from '@supabase/supabase-js';

// The user has provided the public Supabase credentials.
// For this static application setup, we will use them directly.
const supabaseUrl = 'https://avaksnncsiptconloujk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2YWtzbm5jc2lwdGNvbmxvdWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyNzM4NzYsImV4cCI6MjA3MTg0OTg3Nn0.Xo_8xycG6PNMGYwMPYMvlq3TuQYwnqbKC59ybHsWLJo';

let supabase: SupabaseClient;
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
    // This block should ideally not be reached now.
    // Kept as a fallback in case the credentials are removed.
    console.error(
        'Supabase configuration is missing. Registration and login will not work.'
    );
    // Create a dummy client to avoid crashes
    supabase = createClient('https://placeholder.supabase.co', 'placeholder-anon-key');
} else {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };
