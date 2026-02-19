import { type Directive, directive, effect } from 'gonia';
import type { RovingOptions, Orientation } from '../types.js';

function getItems(container: Element, selector: string): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(selector));
}

function matchesOrientation(key: string, orientation: Orientation): boolean {
  if (orientation === 'both') {
    return true;
  }
  if (orientation === 'vertical') {
    return key === 'ArrowUp' || key === 'ArrowDown';
  }
  return key === 'ArrowLeft' || key === 'ArrowRight';
}

function isForward(key: string): boolean {
  return key === 'ArrowDown' || key === 'ArrowRight';
}

export const rovingTabindex: Directive<['$expr', '$element', '$eval']> =
  function rovingTabindex($expr, $element, $eval) {
    const el = $element as HTMLElement;
    let currentHandler: ((e: KeyboardEvent) => void) | null = null;

    effect(() => {
      const opts = $eval<RovingOptions>($expr);
      if (!opts || !opts.selector) {
        return;
      }

      const { selector, orientation = 'vertical', wrap = true } = opts;

      // Initialize tabindex values
      const items = getItems(el, selector);
      for (let i = 0; i < items.length; i++) {
        items[i].setAttribute('tabindex', i === 0 ? '0' : '-1');
      }

      if (currentHandler) {
        el.removeEventListener('keydown', currentHandler);
      }

      currentHandler = (event: KeyboardEvent) => {
        const { key } = event;

        const currentItems = getItems(el, selector);
        if (currentItems.length === 0) {
          return;
        }

        const currentIndex = currentItems.findIndex(
          (item) => item.getAttribute('tabindex') === '0',
        );

        let nextIndex: number | null = null;

        if (key === 'Home') {
          nextIndex = 0;
        } else if (key === 'End') {
          nextIndex = currentItems.length - 1;
        } else if (matchesOrientation(key, orientation)) {
          const delta = isForward(key) ? 1 : -1;
          const candidate = currentIndex + delta;

          if (wrap) {
            nextIndex = (candidate + currentItems.length) % currentItems.length;
          } else if (candidate >= 0 && candidate < currentItems.length) {
            nextIndex = candidate;
          }
        }

        if (nextIndex === null || nextIndex === currentIndex) {
          return;
        }

        event.preventDefault();
        currentItems[currentIndex]?.setAttribute('tabindex', '-1');
        currentItems[nextIndex].setAttribute('tabindex', '0');
        currentItems[nextIndex].focus();
      };

      el.addEventListener('keydown', currentHandler);
    });
  };

rovingTabindex.$inject = ['$expr', '$element', '$eval'];
directive('g-a11y:roving-tabindex', rovingTabindex);
