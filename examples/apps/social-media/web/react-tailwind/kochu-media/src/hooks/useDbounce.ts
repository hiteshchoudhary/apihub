import { useEffect, useState } from "react";

// https://codesandbox.io/s/react-query-debounce-ted8o?file=/src/useDebounce.js
export default function useDebounce<T>(value: T, delay: number): T {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Update debounced value after delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cancel the timeout if value changes (also on delay change or unmount)
    // This is how we prevent debounced value from updating if value is changed ...
    // .. within the delay period. Timeout gets cleared and restarted.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Only re-call effect if value or delay changes

  return debouncedValue;
}