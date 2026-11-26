/**
 * Converts between the backend's snake_case JSON and the frontend's camelCase objects.
 * Applied once in the Axios client, so components only ever see camelCase.
 */

export function toCamelKey(key: string): string {
  return key.replace(/_([a-z0-9])/g, (_, char: string) => char.toUpperCase());
}

export function toSnakeKey(key: string): string {
  return key.replace(/[A-Z]/g, (char) => `_${char.toLowerCase()}`);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

function mapKeys(value: unknown, mapKey: (key: string) => string): unknown {
  if (Array.isArray(value)) return value.map((item) => mapKeys(item, mapKey));
  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [mapKey(key), mapKeys(item, mapKey)]),
    );
  }
  // Primitives, FormData, Blobs and other non-plain values pass through untouched.
  return value;
}

export function camelizeKeys<T = unknown>(value: unknown): T {
  return mapKeys(value, toCamelKey) as T;
}

export function snakeizeKeys(value: unknown): unknown {
  return mapKeys(value, toSnakeKey);
}
