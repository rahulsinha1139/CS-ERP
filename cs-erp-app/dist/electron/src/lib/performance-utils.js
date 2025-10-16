"use strict";
/**
 * Performance Optimization Utilities
 * Advanced patterns for React optimization
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDebounce = useDebounce;
exports.useThrottle = useThrottle;
exports.useMemoizedCalculation = useMemoizedCalculation;
exports.useVirtualScrolling = useVirtualScrolling;
exports.useOptimizedForm = useOptimizedForm;
exports.usePerformanceMonitor = usePerformanceMonitor;
const react_1 = require("react");
// Debounce hook for search inputs
function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = (0, react_1.useState)(value);
    (0, react_1.useEffect)(() => {
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
function useThrottle(callback, delay) {
    const lastCall = (0, react_1.useRef)(0);
    return (0, react_1.useCallback)((...args) => {
        const now = Date.now();
        if (now - lastCall.current >= delay) {
            lastCall.current = now;
            return callback(...args);
        }
    }, [callback, delay]);
}
// Memoized calculation hook
function useMemoizedCalculation(calculateFn, dependencies) {
    return (0, react_1.useMemo)(calculateFn, [calculateFn, ...dependencies]);
}
// Virtual scrolling hook for large lists
function useVirtualScrolling(items, itemHeight, containerHeight) {
    const [scrollTop, setScrollTop] = (0, react_1.useState)(0);
    const visibleStartIndex = (0, react_1.useMemo)(() => Math.floor(scrollTop / itemHeight), [scrollTop, itemHeight]);
    const visibleEndIndex = (0, react_1.useMemo)(() => Math.min(visibleStartIndex + Math.ceil(containerHeight / itemHeight), items.length - 1), [visibleStartIndex, containerHeight, itemHeight, items.length]);
    const visibleItems = (0, react_1.useMemo)(() => items.slice(visibleStartIndex, visibleEndIndex + 1), [items, visibleStartIndex, visibleEndIndex]);
    return {
        visibleItems,
        visibleStartIndex,
        totalHeight: items.length * itemHeight,
        setScrollTop,
    };
}
// Optimized form state management
function useOptimizedForm(initialValues, onSubmit) {
    const [values, setValues] = (0, react_1.useState)(initialValues);
    const [touched, setTouched] = (0, react_1.useState)({});
    const setValue = (0, react_1.useCallback)((field, value) => {
        setValues(prev => ({
            ...prev,
            [field]: value,
        }));
    }, []);
    const setFieldTouched = (0, react_1.useCallback)((field) => {
        setTouched(prev => ({
            ...prev,
            [field]: true,
        }));
    }, [setTouched]);
    const handleSubmit = (0, react_1.useCallback)((e) => {
        e.preventDefault();
        onSubmit(values);
    }, [values, onSubmit]);
    return {
        values,
        touched,
        setValue,
        setTouched: setFieldTouched,
        handleSubmit,
    };
}
// Performance monitoring hook
function usePerformanceMonitor(componentName) {
    const renderCount = (0, react_1.useRef)(0);
    const mountTime = (0, react_1.useRef)(Date.now());
    (0, react_1.useEffect)(() => {
        renderCount.current++;
    });
    (0, react_1.useEffect)(() => {
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
