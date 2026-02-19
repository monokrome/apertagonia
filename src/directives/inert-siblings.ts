import { type Directive, directive, effect } from 'gonia';
import { hideOtherElements, restoreOtherElements } from '../util/sibling-state.js';

export const inertSiblings: Directive<['$expr', '$element', '$eval']> =
  function inertSiblings($expr, $element, $eval) {
    let active = false;

    effect(() => {
      const value = !!$eval($expr);

      if (value && !active) {
        hideOtherElements($element);
        active = true;
      } else if (!value && active) {
        restoreOtherElements($element);
        active = false;
      }
    });
  };

inertSiblings.$inject = ['$expr', '$element', '$eval'];
directive('g-a11y:inert-siblings', inertSiblings);
