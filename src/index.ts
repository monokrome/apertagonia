export type {
  FocusTrapOptions,
  FocusTrapDirectiveValue,
  Orientation,
  RovingOptions,
  LiveOptions,
  LiveDirectiveValue,
  KeyHandler,
  KeyEntry,
  KeyMap,
} from './types.js';

export { announce, clearRegions } from './util/live-region.js';
export { hideOtherElements, restoreOtherElements } from './util/sibling-state.js';
export { tabbable, focusable, isTabbable, isFocusable } from './util/tabbable.js';

// Side-effect: registers all g-a11y:* directives
export {
  keys,
  inertSiblings,
  live,
  focusRestore,
  focusTrap,
  rovingTabindex,
} from './directives/index.js';
