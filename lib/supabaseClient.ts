import { createClient, SupabaseClient } from '@supabase/supabase-js';

// For client-side code, env vars might not be set in local dev without a .env file.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase: SupabaseClient;

if (!supabaseUrl || !supabaseAnonKey) {
    // Fallback to placeholder values for local development to allow the UI to render.
    // This will cause Supabase API calls to fail with an auth error, but the app won't crash.
    // A real Supabase instance is required for functionality.
    console.warn(
        'Supabase environment variables not set. Using placeholder credentials. ' +
        'API calls to Supabase will fail. For full functionality, create a .env.local file ' +
        'and set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
    );
    supabase = createClient('https://placeholder.supabase.co', 'placeholder-anon-key');
} else {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };
