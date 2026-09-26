/**
 * @module data/cache
 *
 * The IndexedDB cache for the task list.
 *
 * The cache is read on app start so the scene renders with the
 * last-known tasks even before the network responds. It is
 * written after every successful fetch.
 *
 * The cache is not the source of truth. The API is. The cache
 * is a fast local mirror.
 *
 * If IndexedDB is unavailable (e.g., Firefox private mode),
 * every function fails silently and the app falls back to
 * network-only.
 *
 * Source: System Architecture §17.3 (Persistent local state),
 * §18 (Offline Guarantee).
 */

import { openDB, type DBSchema, type IDBPDatabase } from 'idb';

import type { Task } from '@orbit/shared';

const DB_NAME = 'orbit';
const DB_VERSION = 1;
const STORE_NAME = 'tasks';

/** The shape of the IndexedDB database. */
interface OrbitDB extends DBSchema {
  tasks: {
    key: string;
    value: Task;
    indexes: {
      'by-ring': string;
      'by-status': string;
    };
  };
}

let dbPromise: Promise<IDBPDatabase<OrbitDB>> | null = null;

/**
 * Open the database. Cached so we do not reopen on every call.
 * Returns null if IndexedDB is not available.
 */
function getDB(): Promise<IDBPDatabase<OrbitDB>> | null {
  if (dbPromise) return dbPromise;

  if (typeof indexedDB === 'undefined') {
    return null;
  }

  try {
    dbPromise = openDB<OrbitDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('by-ring', 'ring');
        store.createIndex('by-status', 'status');
      },
    });
    return dbPromise;
  } catch {
    // IndexedDB unavailable. Fall back to network-only.
    dbPromise = null;
    return null;
  }
}

/**
 * Load the full task list from the cache.
 * Returns an empty array if the cache is empty or unavailable.
 */
export async function loadTasksFromCache(): Promise<Task[]> {
  const dbPromiseRef = getDB();
  if (!dbPromiseRef) return [];

  try {
    const db = await dbPromiseRef;
    const tasks = await db.getAll(STORE_NAME);
    return tasks;
  } catch {
    return [];
  }
}

/**
 * Replace the entire cache with the given task list.
 * Fails silently if the cache is unavailable.
 */
export async function saveTasksToCache(tasks: Task[]): Promise<void> {
  const dbPromiseRef = getDB();
  if (!dbPromiseRef) return;

  try {
    const db = await dbPromiseRef;
    const tx = db.transaction(STORE_NAME, 'readwrite');

    // Clear the existing store, then write the new list.
    await tx.store.clear();
    for (const task of tasks) {
      await tx.store.put(task);
    }

    await tx.done;
  } catch {
    // Fails silently. The cache is not critical.
  }
}

/**
 * Clear the entire task cache.
 * Used on sign-out, or when the user wants to reset local state.
 */
export async function clearTaskCache(): Promise<void> {
  const dbPromiseRef = getDB();
  if (!dbPromiseRef) return;

  try {
    const db = await dbPromiseRef;
    await db.clear(STORE_NAME);
  } catch {
    // Fails silently.
  }
}
