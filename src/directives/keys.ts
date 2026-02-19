import { type Directive, directive, effect } from 'gonia';
import type { KeyMap, KeyEntry } from '../types.js';

function isKeyEntry(value: unknown): value is KeyEntry {
  return typeof value === 'object' && value !== null && 'handler' in value;
}

export const keys: Directive<['$expr', '$element', '$eval']> = function keys(
  $expr,
  $element,
  $eval,
) {
  const el = $element as HTMLElement;
  let currentHandler: ((e: KeyboardEvent) => void) | null = null;

  effect(() => {
    const map = $eval<KeyMap>($expr);
    if (!map || typeof map !== 'object') {
      return;
    }

    if (currentHandler) {
      el.removeEventListener('keydown', currentHandler);
    }

    currentHandler = (event: KeyboardEvent) => {
      const entry = map[event.key];
      if (!entry) {
        return;
      }

      if (isKeyEntry(entry)) {
        if (entry.preventDefault !== false) {
          event.preventDefault();
        }
        entry.handler(event);
      } else {
        event.preventDefault();
        entry(event);
      }
    };

    el.addEventListener('keydown', currentHandler);
  });
};

keys.$inject = ['$expr', '$element', '$eval'];
directive('g-a11y:keys', keys);
