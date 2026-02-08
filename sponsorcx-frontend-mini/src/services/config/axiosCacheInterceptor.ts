/**
 * Axios Cache Interceptor
 *
 * Provides automatic caching for GET requests with configurable TTL.
 * Caches responses in localStorage for persistence across page refreshes.
 */

import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

const showCacheLogs = import.meta.env.VITE_SHOW_CACHE_LOGS === 'true';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export interface CacheConfig {
  /**
   * Default TTL for cached responses in milliseconds
   * @default 5000 (5 seconds)
   */
  defaultTTL?: number;
  /**
   * Enable/disable caching
   * @default true
   */
  enabled?: boolean;
  /**
   * Methods to cache (only GET by default)
   * @default ['get']
   */
  methods?: string[];
  /**
   * Function to generate cache key from request config
   */
  keyGenerator?: (config: InternalAxiosRequestConfig) => string;
  /**
   * Debug logging
   * @default false
   */
  debug?: boolean;
  /**
   * Function to determine if a specific request should be cached.
   * Called after method check passes. Return true to cache, false to skip.
   * If not provided, all requests matching the method will be cached.
   */
  shouldCacheRequest?: (config: InternalAxiosRequestConfig) => boolean;
}

/**
 * Default cache key generator
 * Combines method, URL, and params to create unique cache key
 */
function defaultKeyGenerator(config: InternalAxiosRequestConfig): string {
  const method = config.method?.toUpperCase() || 'GET';
  const url = config.url || '';
  const params = config.params ? JSON.stringify(config.params) : '';
  const data = config.data ? JSON.stringify(config.data) : '';
  return `${method}:${url}:${params}:${data}`;
}

/**
 * Cache store for axios responses using localStorage
 */
class AxiosCache {
  private readonly storagePrefix = 'axios_cache_';
  private config: Required<CacheConfig>;

  constructor(config: CacheConfig = {}) {
    this.config = {
      defaultTTL: config.defaultTTL ?? 5000, // 5 seconds default
      enabled: config.enabled ?? true,
      methods: config.methods ?? ['get'],
      keyGenerator: config.keyGenerator ?? defaultKeyGenerator,
      debug: config.debug ?? false,
      shouldCacheRequest: config.shouldCacheRequest ?? (() => true),
    };

    if (showCacheLogs) {
      console.log('🔧 [AxiosCache] Initialized:', {
        defaultTTL: this.config.defaultTTL,
        methods: this.config.methods,
        localStorage: this.isLocalStorageAvailable(),
      });
    }
  }

  /**
   * Check if localStorage is available
   */
  private isLocalStorageAvailable(): boolean {
    try {
      const testKey = '__localStorage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Generate localStorage key
   */
  private getStorageKey(key: string): string {
    return `${this.storagePrefix}${key}`;
  }

  /**
   * Get cached response if valid
   */
  get(key: string): AxiosResponse | null {
    if (!this.config.enabled) {
      return null;
    }

    try {
      const storageKey = this.getStorageKey(key);
      const stored = localStorage.getItem(storageKey);

      if (!stored) {
        if (showCacheLogs) {
          console.log('❌ [AxiosCache] Cache MISS for key:', key.slice(0, 100));
        }
        return null;
      }

      const entry: CacheEntry<AxiosResponse> = JSON.parse(stored);
      const now = Date.now();
      const age = now - entry.timestamp;

      // Check if entry has expired
      if (age > entry.ttl) {
        localStorage.removeItem(storageKey);
        if (showCacheLogs) {
          console.log(`🗑️ [AxiosCache] Cache EXPIRED (age: ${age}ms, ttl: ${entry.ttl}ms)`);
        }
        return null;
      }

      if (showCacheLogs) {
        console.log(`✅ [AxiosCache] Cache HIT (age: ${age}ms)`);
      }

      return entry.data;
    } catch (error) {
      // If localStorage fails, fail silently
      if (showCacheLogs) {
        console.error('❗ [AxiosCache] Cache read failed:', error);
      }
      return null;
    }
  }

  /**
   * Set response in cache with custom or default TTL
   */
  set(key: string, response: AxiosResponse, ttl?: number): void {
    if (!this.config.enabled) {
      return;
    }

    const cacheTTL = ttl ?? this.config.defaultTTL;

    try {
      const storageKey = this.getStorageKey(key);

      const entry: CacheEntry<AxiosResponse> = {
        data: response,
        timestamp: Date.now(),
        ttl: cacheTTL,
      };

      localStorage.setItem(storageKey, JSON.stringify(entry));

      if (showCacheLogs) {
        console.log(`💾 [AxiosCache] Cached (TTL: ${cacheTTL}ms) ${key.slice(0, 100)}`);
      }
    } catch (error) {
      // If localStorage fails, fail silently
      if (showCacheLogs) {
        console.error('❗ [AxiosCache] Cache write failed:', error);
      }
    }
  }

  /**
   * Check if method should be cached
   */
  shouldCacheMethod(method: string | undefined): boolean {
    if (!method) return false;
    return this.config.methods.includes(method.toLowerCase());
  }

  /**
   * Check if a specific request should be cached
   */
  shouldCacheRequest(config: InternalAxiosRequestConfig): boolean {
    return this.config.shouldCacheRequest(config);
  }

  /**
   * Generate cache key from request config
   */
  generateKey(config: InternalAxiosRequestConfig): string {
    return this.config.keyGenerator(config);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    try {
      // Clear all axios cache entries from localStorage
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(this.storagePrefix)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((key) => localStorage.removeItem(key));

      if (showCacheLogs) {
        console.log(`🧹 Cache cleared (${keysToRemove.length} entries removed)`);
      }
    } catch (error) {
      if (showCacheLogs) {
        console.warn('Cache clear failed:', error);
      }
    }
  }

  /**
   * Get number of cached entries
   */
  count(): number {
    try {
      let count = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(this.storagePrefix)) {
          count++;
        }
      }
      return count;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<CacheConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Get current default TTL
   */
  getDefaultTTL(): number {
    return this.config.defaultTTL;
  }

  /**
   * Set new default TTL
   */
  setDefaultTTL(ttl: number): void {
    this.config.defaultTTL = ttl;
  }
}

// Symbol to store cache instance on axios instance
const CACHE_SYMBOL = Symbol('axiosCache');

/**
 * Add caching interceptors to an axios instance
 *
 * @param axiosInstance - Axios instance to add caching to
 * @param config - Cache configuration
 * @returns The axios instance (for chaining)
 *
 * @example
 * ```typescript
 * // Default 5 second cache
 * setupAxiosCache(axiosInstance);
 *
 * // Custom 10 second cache
 * setupAxiosCache(axiosInstance, { defaultTTL: 10000 });
 *
 * // Per-request TTL override
 * axiosInstance.get('/api/data', {
 *   headers: { 'X-Cache-TTL': '30000' } // 30 seconds
 * });
 *
 * // Disable cache for specific request
 * axiosInstance.get('/api/fresh-data', {
 *   headers: { 'X-Cache-TTL': '0' }
 * });
 * ```
 */
export function setupAxiosCache(
  axiosInstance: AxiosInstance,
  config: CacheConfig = {}
): AxiosInstance {
  const cache = new AxiosCache(config);

  // Store cache instance on axios for external access
  (axiosInstance as typeof axiosInstance & { [CACHE_SYMBOL]: AxiosCache })[CACHE_SYMBOL] = cache;

  // Request interceptor - check cache before making request
  axiosInstance.interceptors.request.use(
    (requestConfig) => {
      const methodOk = cache.shouldCacheMethod(requestConfig.method);

      if (!methodOk) {
        return requestConfig;
      }

      const requestOk = cache.shouldCacheRequest(requestConfig);

      // Only cache configured methods and requests that pass the filter
      if (!requestOk) {
        return requestConfig;
      }

      const cacheKey = cache.generateKey(requestConfig);
      const cachedResponse = cache.get(cacheKey);
      
      if (cachedResponse) {
        // Mark response as coming from cache for debugging/monitoring
        const responseWithCacheFlag: AxiosResponse = {
          ...cachedResponse,
          config: requestConfig,
          headers: {
            ...cachedResponse.headers,
            'x-cache-hit': 'true',
          },
        };
        // Use adapter to return cached response directly
        // This is the clean ES6 way - no error flow, just resolve with cached data
        requestConfig.adapter = () => Promise.resolve(responseWithCacheFlag);
      } else {
        // Store cache key in config for response interceptor
        (requestConfig as typeof requestConfig & { __cacheKey?: string }).__cacheKey = cacheKey;
      }

      return requestConfig;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor - cache successful responses
  axiosInstance.interceptors.response.use(
    (response) => {
      const requestConfig = response.config as typeof response.config & { __cacheKey?: string };
      const cacheKey = requestConfig.__cacheKey;

      if (cacheKey && cache.shouldCacheMethod(requestConfig.method) && cache.shouldCacheRequest(requestConfig)) {
        // Check for custom TTL in request headers
        const customTTL = requestConfig.headers?.['X-Cache-TTL'];
        const ttl = customTTL ? parseInt(customTTL as string, 10) : undefined;

        // Only cache if TTL is not 0 (0 means skip cache)
        if (ttl !== 0) {
          cache.set(cacheKey, response, ttl);
        }
      }

      return response;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return axiosInstance;
}

/**
 * Get cache instance from axios instance
 * Useful for clearing cache or updating configuration
 */
export function getAxiosCache(axiosInstance: AxiosInstance): AxiosCache | undefined {
  return (axiosInstance as typeof axiosInstance & { [CACHE_SYMBOL]?: AxiosCache })[CACHE_SYMBOL];
}

/**
 * Clear cache for specific axios instance
 */
export function clearAxiosCache(axiosInstance: AxiosInstance): void {
  const cache = getAxiosCache(axiosInstance);
  cache?.clear();
}

/**
 * Update cache TTL for specific axios instance
 */
export function updateAxiosCacheTTL(axiosInstance: AxiosInstance, ttl: number): void {
  const cache = getAxiosCache(axiosInstance);
  cache?.setDefaultTTL(ttl);
}
