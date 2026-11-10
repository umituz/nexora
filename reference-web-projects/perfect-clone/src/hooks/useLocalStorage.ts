import { useState, useCallback } from "react";
import { getFromStorage, setToStorage } from "@/utils/storage";

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => getFromStorage(key, initialValue));

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const next = value instanceof Function ? value(prev) : value;
        setToStorage(key, next);
        return next;
      });
    },
    [key],
  );

  return [storedValue, setValue];
}
