import { useEffect, useRef } from 'react';
import { writeHistory } from './navHistory';

// Makes the browser Back button close an open popup instead of leaving the page.
// Opening adds a history entry on the same URL; closing the popup from the UI
// removes it again, and pressing Back closes the popup.

let pending = null;
let counter = 0;

export default function useModalHistory(isOpen, onClose) {
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  });

  useEffect(() => {
    if (!isOpen) return undefined;

    let id;
    if (pending && window.history.state?.modal === pending.id) {
      // Closed and reopened in the same tick (React dev double-run): reuse the entry.
      clearTimeout(pending.timer);
      id = pending.id;
      pending = null;
    } else {
      id = `m${++counter}`;
      writeHistory(
        'pushState',
        { ...(window.history.state || {}), modal: id },
        window.location.pathname + window.location.search,
      );
    }

    let closedByBack = false;
    const onPop = () => {
      if (window.history.state?.modal !== id) {
        closedByBack = true;
        closeRef.current?.();
      }
    };
    window.addEventListener('popstate', onPop);

    return () => {
      window.removeEventListener('popstate', onPop);
      if (closedByBack || window.history.state?.modal !== id) return;
      // Closed from the UI: drop the extra entry. Deferred so a navigation that
      // happens in the same moment can push its own entry first.
      const timer = setTimeout(() => {
        if (pending?.id === id) pending = null;
        if (window.history.state?.modal === id) window.history.back();
      }, 0);
      pending = { id, timer };
    };
  }, [isOpen]);
}
