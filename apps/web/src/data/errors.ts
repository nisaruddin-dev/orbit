/**
 * @module data/errors
 *
 * Typed errors for API failures.
 *
 * Every non-2xx response from the backend is converted into an
 * ApiError. It carries the error code from the envelope, the
 * human-readable message, and the HTTP status.
 *
 * The envelope comes from the FastAPI exception handler in
 * apps/api/app/main.py, which matches TRD §28.
 *
 *   {"error": {"code": "TASK_NOT_FOUND", "message": "...", "request_id": "..."}}
 */

export class ApiError extends Error {
  readonly code: string;
  readonly status: number;
  readonly requestId: string | null;

  constructor(
    code: string,
    message: string,
    status: number,
    requestId: string | null = null,
  ) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.requestId = requestId;
  }
}

/**
 * Network failures and unparseable responses. Distinct from
 * ApiError because they indicate a problem before or after the
 * HTTP exchange, not an error the server reported.
 */
export class ApiNetworkError extends Error {
  constructor(message: string, cause: unknown = null) {
    super(message, cause !== null ? { cause } : undefined);
    this.name = 'ApiNetworkError';
  }
}

/**
 * Raised when a request is attempted but there is no valid
 * session. The UI should route the user back to the sign-in
 * screen.
 */
export class ApiAuthError extends Error {
  constructor(message = 'No active session.') {
    super(message);
    this.name = 'ApiAuthError';
  }
}
