import type { Options as FocusTrapLibOptions } from 'focus-trap';

export interface FocusTrapOptions {
  active: boolean;
  escapeDeactivates?: FocusTrapLibOptions['escapeDeactivates'];
  clickOutsideDeactivates?: FocusTrapLibOptions['clickOutsideDeactivates'];
  allowOutsideClick?: FocusTrapLibOptions['allowOutsideClick'];
  returnFocusOnDeactivate?: FocusTrapLibOptions['returnFocusOnDeactivate'];
  initialFocus?: FocusTrapLibOptions['initialFocus'];
  fallbackFocus?: FocusTrapLibOptions['fallbackFocus'];
  preventScroll?: FocusTrapLibOptions['preventScroll'];
  delayInitialFocus?: FocusTrapLibOptions['delayInitialFocus'];
  tabbableOptions?: FocusTrapLibOptions['tabbableOptions'];
}

export type FocusTrapDirectiveValue = boolean | FocusTrapOptions;

export type Orientation = 'vertical' | 'horizontal' | 'both';

export interface RovingOptions {
  selector: string;
  orientation?: Orientation;
  wrap?: boolean;
}

export interface LiveOptions {
  message: string;
  politeness?: 'polite' | 'assertive';
}

export type LiveDirectiveValue = string | LiveOptions;

export type KeyHandler = (event: KeyboardEvent) => void;

export interface KeyEntry {
  handler: KeyHandler;
  preventDefault?: boolean;
}

export type KeyMap = Record<string, KeyHandler | KeyEntry>;
