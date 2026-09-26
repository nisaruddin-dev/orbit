/**
 * @module data/supabase
 *
 * The Supabase client. Initialized once, from environment
 * variables. Exposes authentication and, later, realtime.
 *
 * The publishable key is public. It ships to the browser. It
 * cannot access data that RLS policies do not allow.
 *
 * The secret key is never used in the frontend. It exists only
 * in the backend.
 *
 * Source: System Architecture §5 (Bounded Direct Data-Plane
 * Access), §60 (Security Model).
 */

import { createClient } from '@supabase/supabase-js';

/**
 * Read the environment. Vite exposes any variable prefixed with
 * `VITE_` to the frontend via `import.meta.env`.
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl) {
  throw new Error(
    'VITE_SUPABASE_URL is not set. Add it to apps/web/.env',
  );
}
if (!supabasePublishableKey) {
  throw new Error(
    'VITE_SUPABASE_PUBLISHABLE_KEY is not set. Add it to apps/web/.env',
  );
}

export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey,
  {
    auth: {
      // Persist the session in localStorage so a reload keeps
      // the user signed in.
      persistSession: true,
      // Refresh the access token automatically before it expires.
      autoRefreshToken: true,
      // Detect the session from the URL hash when Supabase redirects
      // back to us after an auth flow. Not used for password sign-in
      // but harmless to leave on.
      detectSessionInUrl: true,
    },
  },
);
