/**
 * @module ui/ErrorBoundary
 *
 * A React error boundary. Catches exceptions thrown by child
 * components and renders a fallback instead of unmounting the
 * entire tree.
 *
 * This is deliberately minimal. The fallback depends on where
 * the boundary sits in the tree:
 *   - Around the Canvas: a quiet message that the scene could
 *     not render. The UI stays alive.
 *   - Around the UI: nothing visible. The scene stays alive.
 *   - At the top level: a calm full-screen fallback.
 *
 * No red. No alarm. No stack traces in the UI.
 *
 * Source: System Architecture §67 (Error Boundaries),
 * §91 (Failure Isolation).
 */

import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  /** What to render when an error is caught. */
  fallback: ReactNode;
  /** Optional name for logging. */
  label?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    // Log to the console for diagnostics. In development, this
    // is the only visible signal of a caught error.
    const label = this.props.label ?? 'component';
    console.error(`[error-boundary:${label}]`, error, info);
  }

  override render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
