/**
 * Caching utilities for Cube API responses
 *
 * Provides in-memory caching with TTL (time-to-live) support.
 * Helps reduce API calls for frequently accessed data.
 */

import { CacheEntry } from '../types';

/**
 * In-memory cache store
 */
class CacheStore {
  private cache: Map<string, CacheEntry<unknown>> = new Map();

  /**
   * Get value from cache if it exists and hasn't expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if entry has expired
    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Set value in cache with TTL
   */
  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  /**
   * Delete specific cache entry
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size;
  }
}

// Singleton cache instance
const cacheStore = new CacheStore();

/**
 * Get cached value or execute function and cache result
 *
 * @param key - Cache key
 * @param fetchFn - Function to execute if cache miss
 * @param ttl - Time to live in milliseconds (default 5 minutes)
 * @returns Cached or freshly fetched data
 */
export async function getCached<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl: number = 5 * 60 * 1000
): Promise<T> {
  // Try to get from cache
  const cached = cacheStore.get<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Cache miss - fetch and store
  const data = await fetchFn();
  cacheStore.set(key, data, ttl);
  return data;
}

/**
 * Manually set cache value
 */
export function setCache<T>(key: string, data: T, ttl?: number): void {
  cacheStore.set(key, data, ttl);
}

/**
 * Delete specific cache entry
 */
export function deleteCache(key: string): void {
  cacheStore.delete(key);
}

/**
 * Clear all cache
 */
export function clearCache(): void {
  cacheStore.clear();
}

/**
 * Get cache statistics
 */
export function getCacheStats(): { size: number } {
  return {
    size: cacheStore.size(),
  };
}
