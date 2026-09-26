/**
 * @module auth/SignInScreen
 *
 * The sign-in form. An overlay on top of the scene. Appears
 * when no session exists, disappears once signed in.
 *
 * Only email + password. No sign-up, no password reset, no
 * magic link. This is a single-user application; the account
 * was created once in the Supabase dashboard.
 *
 * Source: System Architecture §61 (Authentication),
 * TRD §8.
 */

import { useState, type SubmitEvent } from 'react';

import { supabase } from '@/data/supabase';

export function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError('Could not sign in. Check your email and password.');
        setSubmitting(false);
        return;
      }

      // Success. The auth state hook will pick up the new session
      // and App will render the scene. No further action needed.
    } catch {
      setError('Something went wrong. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="sign-in-root">
      <div className="sign-in-panel">
        <h1 className="sign-in-title">Orbit</h1>
        <p className="sign-in-subtitle">A quiet place for your tasks.</p>

        <form
          onSubmit={(e) => {
            void handleSubmit(e);
          }}
          className="sign-in-form"
        >
          <div className="sign-in-field">
            <label className="sign-in-label" htmlFor="sign-in-email">
              Email
            </label>
            <input
              id="sign-in-email"
              className="sign-in-input"
              type="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              disabled={submitting}
              required
            />
          </div>

          <div className="sign-in-field">
            <label className="sign-in-label" htmlFor="sign-in-password">
              Password
            </label>
            <input
              id="sign-in-password"
              className="sign-in-input"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              disabled={submitting}
              required
            />
          </div>

          {error && <p className="sign-in-error">{error}</p>}

          <button
            type="submit"
            className="sign-in-button"
            disabled={submitting}
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
