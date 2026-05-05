import { useState, useEffect, useCallback, useRef } from 'react';
import { COORDINATOR_RESET_EVENT } from '../common/storage';

const readPersistedValue = <T,>(key: string, initial: T): T => {
  try {
    const raw = localStorage.getItem(key);                // read saved JSON string
    if (raw === null) return initial;                     // nothing saved yet -> use default

    const parsed = JSON.parse(raw) as T;                  // parse the stored value

    if (initial && typeof initial === 'object' && !Array.isArray(initial)) {
      return { ...initial, ...parsed };                  // merge: stored values win
    }

    return parsed;                                       // primitives / arrays returned as-is
  } catch {
    return initial;                                      // corrupt data -> fall back to default
  }
};

/**
 * Drop-in replacement for useState that persists the value in localStorage.
 * On page refresh the last saved value is restored automatically.
 *
 * - `key`     — unique localStorage key (use the page/component name)
 * - `initial` — default value used when nothing is stored yet
 *
 * Non-serialisable values (File, Blob, functions) are silently skipped
 * during save and fall back to their `initial` counterparts on load.
 */
function usePersistedState<T>(key: string, initial: T) {
  /* ---- hydrate from localStorage on first render ---- */
  const [state, setState] = useState<T>(() => readPersistedValue(key, initial));

  /* ---- keep a ref so the effect always sees latest state ---- */
  const stateRef = useRef(state);
  stateRef.current = state;

  /* ---- persist to localStorage whenever state changes ---- */
  useEffect(() => {
    try {
      const value = stateRef.current;

      /* For objects: strip out File / Blob values before saving */
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        const clean: Record<string, unknown> = {};          // build a serialisable copy
        for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
          if (v instanceof File || v instanceof Blob) continue; // skip binary data
          clean[k] = v;                                     // keep everything else
        }
        localStorage.setItem(key, JSON.stringify(clean));   // save cleaned object
      } else {
        localStorage.setItem(key, JSON.stringify(value));   // save primitives / arrays directly
      }
    } catch { /* quota exceeded or private browsing — silently ignore */ }
  }, [key, state]);                                         // re-run on every state change

  /* ---- re-sync when storage changes or page is restored from bfcache ---- */
  useEffect(() => {
    const syncFromStorage = () => {
      setState(readPersistedValue(key, initial));
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== null && event.key !== key) return;
      syncFromStorage();
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('pageshow', syncFromStorage);
    window.addEventListener(COORDINATOR_RESET_EVENT, syncFromStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('pageshow', syncFromStorage);
      window.removeEventListener(COORDINATOR_RESET_EVENT, syncFromStorage);
    };
  }, [initial, key]);

  /* ---- wrapped setter that also updates the ref ---- */
  const setPersistedState = useCallback(
    (action: T | ((prev: T) => T)) => {
      setState(action);                                     // delegate to React's setState
    },
    [],
  );

  return [state, setPersistedState] as const;               // return same tuple shape as useState
}

export default usePersistedState;
