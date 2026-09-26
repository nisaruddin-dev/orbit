/**
 * @module auth/useAuth
 *
 * Tracks the current Supabase session. Returns the user and a
 * loading flag. Components read this to decide whether to show
 * the sign-in screen or the main app.
 *
 * The session is read once on mount, then kept up to date via
 * Supabase's onAuthStateChange. Sign-in, sign-out, and token
 * refresh all flow through this hook.
 *
 * Source: TRD §8 (Authentication Architecture).
 */

import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';

import { supabase } from '@/data/supabase';

export interface AuthState {
  /** The current session, or null if not signed in. */
  session: Session | null;
  /** True while the initial session is being read. */
  loading: boolean;
}

export function useAuth(): AuthState {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    // Read the current session from storage.
    void supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      setSession(data.session);
      setLoading(false);
    });

    // Subscribe to future auth state changes.
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        if (cancelled) return;
        setSession(nextSession);
        setLoading(false);
      },
    );

    return () => {
      cancelled = true;
      subscription.subscription.unsubscribe();
    };
  }, []);

  return { session, loading };
}
