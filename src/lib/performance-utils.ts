/**
 * Performance Optimization Utilities
 * Advanced patterns for React optimization
 */

import { useMemo, useCallback, useRef, useEffect, useState } from 'react';

// Debounce hook for search inputs
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Throttle hook for scroll/resize events
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastCall = useRef<number>(0);

  return useCallback((...args: any[]) => {
    const now = Date.now();
    if (now - lastCall.current >= delay) {
      lastCall.current = now;
      return callback(...args);
    }
  }, [callback, delay]) as T;
}

// Memoized calculation hook
export function useMemoizedCalculation<T>(
  calculateFn: () => T,
  dependencies: any[]
): T {
  return useMemo(calculateFn, [calculateFn, ...dependencies]);
}

// Virtual scrolling hook for large lists
export function useVirtualScrolling(
  items: any[],
  itemHeight: number,
  containerHeight: number
) {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleStartIndex = useMemo(
    () => Math.floor(scrollTop / itemHeight),
    [scrollTop, itemHeight]
  );

  const visibleEndIndex = useMemo(
    () => Math.min(
      visibleStartIndex + Math.ceil(containerHeight / itemHeight),
      items.length - 1
    ),
    [visibleStartIndex, containerHeight, itemHeight, items.length]
  );

  const visibleItems = useMemo(
    () => items.slice(visibleStartIndex, visibleEndIndex + 1),
    [items, visibleStartIndex, visibleEndIndex]
  );

  return {
    visibleItems,
    visibleStartIndex,
    totalHeight: items.length * itemHeight,
    setScrollTop,
  };
}

// Optimized form state management
export function useOptimizedForm<T>(
  initialValues: T,
  onSubmit: (values: T) => void
) {
  const [values, setValues] = useState<T>(initialValues);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const setValue = useCallback(
    (field: keyof T, value: any) => {
      setValues(prev => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  const setFieldTouched = useCallback(
    (field: keyof T) => {
      setTouched(prev => ({
        ...prev,
        [field]: true,
      }));
    },
    [setTouched]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(values);
    },
    [values, onSubmit]
  );

  return {
    values,
    touched,
    setValue,
    setTouched: setFieldTouched,
    handleSubmit,
  };
}

// Performance monitoring hook
export function usePerformanceMonitor(componentName: string) {
  const renderCount = useRef(0);
  const mountTime = useRef(Date.now());

  useEffect(() => {
    renderCount.current++;
  });

  useEffect(() => {
    const cleanup = () => {
      const totalTime = Date.now() - mountTime.current;
      if (process.env.NODE_ENV === 'development') {
        console.log(`${componentName} Performance:`, {
          renderCount: renderCount.current,
          totalMountTime: `${totalTime}ms`,
        });
      }
    };

    return cleanup;
  }, [componentName]);
}

