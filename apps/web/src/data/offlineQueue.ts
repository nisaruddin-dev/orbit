/**
 * @module data/offlineQueue
 *
 * A durable queue of mutations that failed due to network errors.
 *
 * Only network errors are queued. Real HTTP errors (4xx, 5xx with
 * a body) and auth errors are not queued — they are terminal.
 *
 * The queue lives in IndexedDB. It survives reload. On reconnect,
 * the queue is flushed in FIFO order.
 *
 * Bounded at 100 entries. If the queue exceeds that, the oldest
 * entries are dropped. That is a safety valve; a queue that large
 * means something is wrong.
 *
 * Source: System Architecture §19 (Offline Queue),
 * TRD §20 (Mutation Queue).
 */

import { openDB, type DBSchema, type IDBPDatabase } from 'idb';

const DB_NAME = 'orbit';
const DB_VERSION = 2;
const STORE_NAME = 'offline-queue';
const MAX_QUEUE_SIZE = 100;

/** The kinds of mutation the queue can hold. */
export type QueuedMutationType = 'update' | 'complete';

/** A single queued mutation. */
export interface QueuedMutation {
  /** Monotonic ID, generated when the entry is created. */
  id: number;
  /** The task this mutation applies to. */
  taskId: string;
  /** The kind of mutation. */
  type: QueuedMutationType;
  /** The payload — a TaskUpdate for 'update', empty for 'complete'. */
  payload: unknown;
  /** When the mutation was queued. */
  queuedAt: number;
}

interface QueueDB extends DBSchema {
  'offline-queue': {
    key: number;
    value: QueuedMutation;
    indexes: {
      'by-queued-at': number;
    };
  };
}

let dbPromise: Promise<IDBPDatabase<QueueDB>> | null = null;

function getDB(): Promise<IDBPDatabase<QueueDB>> | null {
  if (dbPromise) return dbPromise;

  if (typeof indexedDB === 'undefined') {
    return null;
  }

  try {
    dbPromise = openDB<QueueDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, {
            keyPath: 'id',
            autoIncrement: true,
          });
          store.createIndex('by-queued-at', 'queuedAt');
        }
      },
    });
    return dbPromise;
  } catch {
    dbPromise = null;
    return null;
  }
}

/**
 * Add a mutation to the queue. Returns the queue entry ID, or
 * null if the queue is unavailable.
 *
 * If the queue exceeds MAX_QUEUE_SIZE, the oldest entry is
 * dropped first.
 */
export async function enqueue(
  mutation: Omit<QueuedMutation, 'id' | 'queuedAt'>,
): Promise<number | null> {
  const dbPromiseRef = getDB();
  if (!dbPromiseRef) return null;

  try {
    const db = await dbPromiseRef;
    const entry: Omit<QueuedMutation, 'id'> = {
      ...mutation,
      queuedAt: Date.now(),
    };
    const id = await db.add(STORE_NAME, entry as QueuedMutation);

    // Enforce the bound.
    const count = await db.count(STORE_NAME);
    if (count > MAX_QUEUE_SIZE) {
      const excess = count - MAX_QUEUE_SIZE;
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const index = tx.store.index('by-queued-at');
      let removed = 0;
      let cursor = await index.openCursor();
      while (cursor && removed < excess) {
        await cursor.delete();
        removed += 1;
        cursor = await cursor.continue();
      }
      await tx.done;
    }

    return id;
  } catch {
    return null;
  }
}

/**
 * Read all queued mutations, in FIFO order.
 */
export async function readAll(): Promise<QueuedMutation[]> {
  const dbPromiseRef = getDB();
  if (!dbPromiseRef) return [];

  try {
    const db = await dbPromiseRef;
    const index = db.transaction(STORE_NAME).store.index('by-queued-at');
    return await index.getAll();
  } catch {
    return [];
  }
}

/**
 * Remove a queued mutation by ID.
 */
export async function remove(id: number): Promise<void> {
  const dbPromiseRef = getDB();
  if (!dbPromiseRef) return;

  try {
    const db = await dbPromiseRef;
    await db.delete(STORE_NAME, id);
  } catch {
    // Fails silently. Not critical.
  }
}

/**
 * Remove every queued mutation.
 * Called on sign-out, and when the queue is abandoned.
 */
export async function clear(): Promise<void> {
  const dbPromiseRef = getDB();
  if (!dbPromiseRef) return;

  try {
    const db = await dbPromiseRef;
    await db.clear(STORE_NAME);
  } catch {
    // Fails silently.
  }
}

/**
 * Count the queued mutations. Useful for the offline indicator.
 */
export async function count(): Promise<number> {
  const dbPromiseRef = getDB();
  if (!dbPromiseRef) return 0;

  try {
    const db = await dbPromiseRef;
    return await db.count(STORE_NAME);
  } catch {
    return 0;
  }
}
