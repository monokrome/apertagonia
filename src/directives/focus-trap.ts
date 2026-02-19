import { type Directive, directive, effect } from 'gonia';
import { createFocusTrap, type FocusTrap, type Options } from 'focus-trap';
import type { FocusTrapDirectiveValue, FocusTrapOptions } from '../types.js';

declare global {
  interface HTMLElement {
    __a11yFocusTrap?: FocusTrap;
  }
}

function parse(value: FocusTrapDirectiveValue): { active: boolean; options: Options } {
  if (typeof value === 'boolean') {
    return { active: value, options: {} };
  }

  const { active, ...rest } = value;
  return { active, options: rest };
}

export const focusTrap: Directive<['$expr', '$element', '$eval']> =
  function focusTrap($expr, $element, $eval) {
    const el = $element as HTMLElement;
    let trap: FocusTrap | null = null;

    effect(() => {
      const value = $eval<FocusTrapDirectiveValue>($expr);
      const { active, options } = parse(value);

      if (!trap) {
        trap = createFocusTrap(el, {
          ...options,
          // Don't auto-activate; we control activation via the reactive value
          returnFocusOnDeactivate: options.returnFocusOnDeactivate ?? true,
        });
        el.__a11yFocusTrap = trap;
      }

      if (active && !trap.active) {
        trap.activate();
      } else if (!active && trap.active) {
        trap.deactivate();
      }
    });
  };

focusTrap.$inject = ['$expr', '$element', '$eval'];
directive('g-a11y:focus-trap', focusTrap);
