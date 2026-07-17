import { useEffect, useState } from "react";

/**
 * Trails `value` by `delayMs`, so query keys built from free-typed input only
 * change once the user pauses instead of firing a request per keystroke.
 */
export function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
