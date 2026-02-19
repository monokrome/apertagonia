import { type Directive, directive } from 'gonia';
import type { Expression } from 'gonia';

export const focusRestore: Directive<['$expr', '$element', '$eval']> =
  function focusRestore($expr, $element, $eval) {
    const previouslyFocused = document.activeElement as HTMLElement | null;

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const removed of mutation.removedNodes) {
          if (removed !== $element && !removed.contains($element)) {
            continue;
          }

          observer.disconnect();
          const target = resolveTarget($expr, $eval, previouslyFocused);
          target?.focus();
          return;
        }
      }
    });

    const parent = $element.parentNode;
    if (parent) {
      observer.observe(parent, { childList: true });
    }
  };

function resolveTarget(
  $expr: Expression,
  $eval: <T>(e: Expression) => T,
  fallback: HTMLElement | null,
): HTMLElement | null {
  if ($expr && String($expr).trim()) {
    const selector = $eval<string>($expr);
    if (selector) {
      return document.querySelector<HTMLElement>(selector);
    }
  }
  return fallback;
}

focusRestore.$inject = ['$expr', '$element', '$eval'];
directive('g-a11y:focus-restore', focusRestore);
