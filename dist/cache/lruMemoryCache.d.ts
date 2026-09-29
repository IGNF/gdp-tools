/** Cache mémoire LRU simple (clé → valeur). */
export declare class LruMemoryCache<T> {
    private readonly maxEntries;
    private readonly onEvict?;
    private readonly store;
    constructor(maxEntries?: number, onEvict?: (value: T, key: string) => void);
    get(key: string): T | undefined;
    has(key: string): boolean;
    set(key: string, value: T): void;
    delete(key: string): void;
    forEach(callback: (value: T, key: string) => void): void;
    get entryCount(): number;
    clear(): void;
}
//# sourceMappingURL=lruMemoryCache.d.ts.map