/** Cache mémoire LRU simple (clé → valeur). */
export class LruMemoryCache<T> {
  private readonly maxEntries: number;
  private readonly onEvict?: (value: T, key: string) => void;
  private readonly store = new Map<string, T>();

  constructor(maxEntries = 256, onEvict?: (value: T, key: string) => void) {
    this.maxEntries = maxEntries;
    this.onEvict = onEvict;
  }

  get(key: string): T | undefined {
    const value = this.store.get(key);
    if (value === undefined) {
      return undefined;
    }

    this.store.delete(key);
    this.store.set(key, value);
    return value;
  }

  has(key: string): boolean {
    return this.store.has(key);
  }

  set(key: string, value: T): void {
    if (this.store.has(key)) {
      this.store.delete(key);
    } else if (this.store.size >= this.maxEntries) {
      const oldestKey = this.store.keys().next().value;
      if (oldestKey !== undefined) {
        const evictedValue = this.store.get(oldestKey);
        this.store.delete(oldestKey);
        if (evictedValue !== undefined) {
          this.onEvict?.(evictedValue, oldestKey);
        }
      }
    }

    this.store.set(key, value);
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  forEach(callback: (value: T, key: string) => void): void {
    for (const [key, value] of this.store.entries()) {
      callback(value, key);
    }
  }

  get entryCount(): number {
    return this.store.size;
  }

  clear(): void {
    this.store.clear();
  }
}
