import { type Directive, Mode, directive, effect } from 'gonia';
import { announce } from '../util/live-region.js';
import type { LiveDirectiveValue } from '../types.js';

type Politeness = 'polite' | 'assertive';
interface Parsed {
  message: string;
  politeness: Politeness;
}

function parse(value: LiveDirectiveValue): Parsed {
  if (typeof value === 'string') {
    return { message: value, politeness: 'polite' };
  }
  return { message: value.message, politeness: value.politeness ?? 'polite' };
}

export const live: Directive<['$expr', '$element', '$eval', '$mode']> =
  function live($expr, $element, $eval, $mode) {
    if ($mode === Mode.SERVER) {
      const value = $eval<LiveDirectiveValue>($expr);
      const { politeness } = parse(value);
      $element.setAttribute('aria-live', politeness);
      $element.setAttribute('aria-atomic', 'true');
      return;
    }

    effect(() => {
      const value = $eval<LiveDirectiveValue>($expr);
      if (!value) {
        return;
      }
      const { message, politeness } = parse(value);
      if (message) {
        announce(message, politeness);
      }
    });
  };

live.$inject = ['$expr', '$element', '$eval', '$mode'];
directive('g-a11y:live', live);
