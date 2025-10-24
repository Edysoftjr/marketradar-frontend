"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { apiCache } from "@/lib/api-cache";

interface UseApiOptions<T> {
  cacheKey?: string;
  cacheTTL?: number;
  enabled?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export function useApi<T>(
  fetcher: () => Promise<T>,
  options: UseApiOptions<T> = {}
) {
  const { cacheKey, cacheTTL, enabled = true, onSuccess, onError } = options;

  const [data, setData] = useState<T | null>(() => {
    if (cacheKey) {
      return apiCache.get<T>(cacheKey);
    }
    return null;
  });
  const [loading, setLoading] = useState<boolean>(!data);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    // Check cache first
    if (cacheKey) {
      const cached = apiCache.get<T>(cacheKey);
      if (cached) {
        setData(cached);
        setLoading(false);
        return;
      }
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      setData(result);

      // Cache the result
      if (cacheKey) {
        apiCache.set(cacheKey, result, cacheTTL);
      }

      onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error");
      setError(error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [fetcher, cacheKey, cacheTTL, onSuccess, onError]);

  const refetch = useCallback(() => {
    if (cacheKey) {
      apiCache.invalidate(cacheKey);
    }
    return fetchData();
  }, [fetchData, cacheKey]);

  useEffect(() => {
    if (enabled) {
      fetchData();
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [enabled, fetchData]);

  return {
    data,
    loading,
    error,
    refetch,
  };
}

// Re-export apiCache for convenience
export { apiCache };
