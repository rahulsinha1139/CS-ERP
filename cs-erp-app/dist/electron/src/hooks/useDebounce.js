"use strict";
/**
 * useDebounce Hook
 * Delays updating a value until after a specified delay
 * Perfect for live calculations without performance lag
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDebounce = useDebounce;
const react_1 = require("react");
function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = (0, react_1.useState)(value);
    (0, react_1.useEffect)(() => {
        // Set up the timeout
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        // Clean up the timeout if value changes before delay completes
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}
