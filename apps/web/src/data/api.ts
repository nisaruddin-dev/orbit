/**
 * @module data/api
 *
 * The HTTP client for the Orbit backend.
 *
 * Every call attaches the current Supabase JWT and parses the
 * response. Non-2xx responses become ApiError. Network failures
 * become ApiNetworkError. Missing session becomes ApiAuthError.
 *
 * This module does no caching, no retry, no optimistic mutation,
 * and no offline queueing. Those belong to higher layers
 * (TanStack Query, sync.ts) that sit above it.
 *
 * Source: TRD §26 (API Design), System Architecture §21
 * (Realtime Architecture — the API remains canonical).
 */

import type { Task } from '@orbit/shared';

import { supabase } from './supabase';
import { ApiAuthError, ApiError, ApiNetworkError } from './errors';

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error('VITE_API_URL is not set. Add it to apps/web/.env');
}

/** Shape of the error envelope from the backend. */
interface ErrorEnvelope {
  error: {
    code: string;
    message: string;
    request_id?: string | null;
  };
}

/** Narrowing helper for the error envelope. */
function isErrorEnvelope(value: unknown): value is ErrorEnvelope {
  if (typeof value !== 'object' || value === null) return false;
  if (!('error' in value)) return false;
  const error = value.error;
  if (typeof error !== 'object' || error === null) return false;
  return 'code' in error && 'message' in error;
}

/** TaskCreate body — mirrors the backend schema. */
export interface TaskCreate {
  title: string;
  notes?: string;
  ring: 'today' | 'week' | 'someday';
  priority?: 0 | 1 | 2 | 3;
  due_at?: string | null;
  recurrence?: 'daily' | 'weekly' | 'monthly' | null;
  orbit_angle?: number | null;
  orbit_radius?: number | null;
}

/** TaskUpdate body — all fields optional. */
export type TaskUpdate = Partial<TaskCreate> & {
  status?: 'idle' | 'in_progress' | 'completed' | 'archived';
};

/** Response shape for a list of tasks. */
interface TaskListResponse {
  tasks: Task[];
}

/**
 * Read the current JWT from the Supabase session. Throws
 * ApiAuthError if there is no session.
 */
async function getAccessToken(): Promise<string> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) {
    throw new ApiAuthError();
  }
  return token;
}

/**
 * The base request function. Every endpoint goes through here.
 */
async function request<T>(
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  path: string,
  body?: unknown,
): Promise<T> {
  const token = await getAccessToken();

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  const init: RequestInit = {
    method,
    headers,
  };
  if (body !== undefined) {
    init.body = JSON.stringify(body);
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}/api/v1${path}`, init);
  } catch (cause) {
    throw new ApiNetworkError('Request failed before reaching the server.', cause);
  }

  // 204 No Content — nothing to parse.
  if (response.status === 204) {
    return undefined as unknown as T;
  }

  // Parse the body once.
  let parsed: unknown = null;
  try {
    parsed = await response.json();
  } catch {
    // No body or invalid JSON.
  }

  if (!response.ok) {
    if (isErrorEnvelope(parsed)) {
      throw new ApiError(
        parsed.error.code,
        parsed.error.message,
        response.status,
        parsed.error.request_id ?? null,
      );
    }
    throw new ApiError(
      'HTTP_ERROR',
      `Request failed with status ${String(response.status)}.`,
      response.status,
    );
  }

  return parsed as T;
}

/* ---------- Tasks endpoints ---------- */

export async function listTasks(): Promise<Task[]> {
  const response = await request<TaskListResponse>('GET', '/tasks');
  return response.tasks;
}

export async function getTask(id: string): Promise<Task> {
  return request<Task>('GET', `/tasks/${id}`);
}

export async function createTask(payload: TaskCreate): Promise<Task> {
  return request<Task>('POST', '/tasks', payload);
}

export async function updateTask(
  id: string,
  payload: TaskUpdate,
): Promise<Task> {
  return request<Task>('PATCH', `/tasks/${id}`, payload);
}

export async function completeTask(id: string): Promise<Task> {
  return request<Task>('POST', `/tasks/${id}/complete`);
}

export async function restoreTask(id: string): Promise<Task> {
  return request<Task>('POST', `/tasks/${id}/restore`);
}

export async function archiveTask(id: string): Promise<undefined> {
  return request<undefined>('DELETE', `/tasks/${id}`);
}

export async function unarchiveTask(id: string): Promise<Task> {
  return request<Task>('POST', `/tasks/${id}/unarchive`);
}
