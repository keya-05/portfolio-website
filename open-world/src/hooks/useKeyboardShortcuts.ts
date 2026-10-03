import { useEffect, useRef } from 'react';

type Bindings = Record<string, (e: KeyboardEvent) => void>;

function isTyping(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
}

/**
 * Global game-style shortcuts. Keys are matched on lowercase `event.key`
 * (e.g. 'p', 'm', 'escape', 'arrowleft'). Ignored while typing or with modifiers.
 */
export function useKeyboardShortcuts(bindings: Bindings, enabled = true) {
  const ref = useRef(bindings);
  ref.current = bindings;

  useEffect(() => {
    if (!enabled) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.repeat || isTyping(e.target)) return;
      const handler = ref.current[e.key.toLowerCase()];
      if (handler) {
        e.preventDefault();
        handler(e);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [enabled]);
}
