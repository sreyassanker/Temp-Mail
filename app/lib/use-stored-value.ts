"use client";

import { useCallback, useSyncExternalStore } from "react";

const listenersByKey = new Map<string, Set<() => void>>();

function getListeners(key: string): Set<() => void> {
  let set = listenersByKey.get(key);
  if (!set) {
    set = new Set();
    listenersByKey.set(key, set);
  }
  return set;
}

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function serverSnapshot(): string | null {
  return null;
}

export function useStoredValue(key: string): string | null {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const listeners = getListeners(key);
      listeners.add(onChange);
      return () => {
        listeners.delete(onChange);
      };
    },
    [key]
  );

  const getSnapshot = useCallback(() => read(key), [key]);

  return useSyncExternalStore(subscribe, getSnapshot, serverSnapshot);
}

export function setStoredValue(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // storage unavailable
  }
  getListeners(key).forEach((listener) => listener());
}