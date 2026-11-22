import { openDB, type DBSchema, type IDBPDatabase } from 'idb';

interface CivicOSDB extends DBSchema {
  posts: {
    key: string;
    value: {
      id: string;
      communityId: string;
      data: string; // JSON stringified
      updatedAt: number;
    };
    indexes: { 'by-community': string };
  };
  materials: {
    key: string;
    value: {
      id: string;
      communityId: string;
      data: string;
      updatedAt: number;
    };
    indexes: { 'by-community': string };
  };
  materialBlobs: {
    key: string;
    value: {
      id: string;
      materialId: string;
      encryptedBlob: string; // AES-256 encrypted
      cachedAt: number;
    };
  };
  events: {
    key: string;
    value: {
      id: string;
      communityId: string;
      data: string;
      updatedAt: number;
    };
    indexes: { 'by-community': string };
  };
  pendingOps: {
    key: string;
    value: {
      id: string;
      type: string;
      payload: string;
      timestamp: number;
      status: 'pending' | 'syncing' | 'failed';
    };
    indexes: { 'by-status': string };
  };
}

let dbPromise: Promise<IDBPDatabase<CivicOSDB>> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<CivicOSDB>('civicos-db', 1, {
      upgrade(db) {
        const postStore = db.createObjectStore('posts', { keyPath: 'id' });
        postStore.createIndex('by-community', 'communityId');

        const matStore = db.createObjectStore('materials', { keyPath: 'id' });
        matStore.createIndex('by-community', 'communityId');

        db.createObjectStore('materialBlobs', { keyPath: 'id' });

        const eventStore = db.createObjectStore('events', { keyPath: 'id' });
        eventStore.createIndex('by-community', 'communityId');

        const opsStore = db.createObjectStore('pendingOps', { keyPath: 'id' });
        opsStore.createIndex('by-status', 'status');
      },
    });
  }
  return dbPromise;
}

// Generic cache helpers
export async function cacheData(store: 'posts' | 'materials' | 'events', communityId: string, id: string, data: unknown) {
  const db = await getDB();
  await db.put(store, {
    id,
    communityId,
    data: JSON.stringify(data),
    updatedAt: Date.now(),
  });
}

export async function getCachedData<T>(store: 'posts' | 'materials' | 'events', id: string): Promise<T | null> {
  const db = await getDB();
  const record = await db.get(store, id);
  return record ? (JSON.parse(record.data) as T) : null;
}

export async function getCachedByCommunity<T>(store: 'posts' | 'materials' | 'events', communityId: string): Promise<T[]> {
  const db = await getDB();
  const records = await db.getAllFromIndex(store, 'by-community', communityId);
  return records.map((r) => JSON.parse(r.data) as T);
}

// Material blob cache
export async function cacheMaterialBlob(materialId: string, encryptedBlob: string) {
  const db = await getDB();
  await db.put('materialBlobs', {
    id: materialId,
    materialId,
    encryptedBlob,
    cachedAt: Date.now(),
  });
}

export async function getCachedBlob(materialId: string): Promise<string | null> {
  const db = await getDB();
  const record = await db.get('materialBlobs', materialId);
  return record?.encryptedBlob ?? null;
}

