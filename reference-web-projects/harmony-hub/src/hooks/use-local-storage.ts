import { useState, useCallback, useRef } from "react";
import { getStorageItem, setStorageItem } from "@/lib/storage";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() =>
    getStorageItem(key, initialValue)
  );
  const keyRef = useRef(key);
  keyRef.current = key;

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      setStoredValue((prev) => {
        const valueToStore = value instanceof Function ? value(prev) : value;
        setStorageItem(keyRef.current, valueToStore);
        return valueToStore;
      });
    },
    []
  );

  return [storedValue, setValue] as const;
}
