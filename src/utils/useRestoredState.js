import { useState, useEffect, useRef } from 'react';
import { currentKey } from './navHistory';

// Like useState, but the value is remembered for the current browser history
// entry: coming back with Back/Forward restores it, a fresh visit starts clean.
export default function useRestoredState(name, initial) {
  const [readKey] = useState(() => `ui:${currentKey()}:${name}`);
  const mounted = useRef(false);

  const [value, setValue] = useState(() => {
    try {
      const raw = sessionStorage.getItem(readKey);
      if (raw !== null) return JSON.parse(raw);
    } catch { /* ignore */ }
    return typeof initial === 'function' ? initial() : initial;
  });

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    try {
      sessionStorage.setItem(`ui:${currentKey()}:${name}`, JSON.stringify(value));
    } catch { /* ignore */ }
  }, [name, value]);

  return [value, setValue];
}
