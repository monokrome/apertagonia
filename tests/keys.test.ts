import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createContext, Mode, reactive, effect, type Expression } from 'gonia';
import { keys } from '../src/directives/keys.js';

function makeEl(): HTMLDivElement {
  const el = document.createElement('div');
  document.body.appendChild(el);
  return el;
}

function press(el: HTMLElement, key: string): KeyboardEvent {
  const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
  el.dispatchEvent(event);
  return event;
}

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('g-a11y:keys', () => {
  it('calls the handler for a matched key', () => {
    const handler = vi.fn();
    const state = reactive({ keyMap: { Enter: handler } });
    const ctx = createContext(Mode.CLIENT, state);
    const el = makeEl();

    keys('keyMap' as Expression, el, ctx.eval.bind(ctx));

    press(el, 'Enter');
    expect(handler).toHaveBeenCalledOnce();
  });

  it('does not call handler for unmatched keys', () => {
    const handler = vi.fn();
    const state = reactive({ keyMap: { Enter: handler } });
    const ctx = createContext(Mode.CLIENT, state);
    const el = makeEl();

    keys('keyMap' as Expression, el, ctx.eval.bind(ctx));

    press(el, 'Escape');
    expect(handler).not.toHaveBeenCalled();
  });

  it('calls preventDefault on matched keys by default', () => {
    const handler = vi.fn();
    const state = reactive({ keyMap: { Escape: handler } });
    const ctx = createContext(Mode.CLIENT, state);
    const el = makeEl();

    keys('keyMap' as Expression, el, ctx.eval.bind(ctx));

    const event = press(el, 'Escape');
    expect(event.defaultPrevented).toBe(true);
  });

  it('supports KeyEntry with preventDefault: false', () => {
    const handler = vi.fn();
    const state = reactive({
      keyMap: { Enter: { handler, preventDefault: false } },
    });
    const ctx = createContext(Mode.CLIENT, state);
    const el = makeEl();

    keys('keyMap' as Expression, el, ctx.eval.bind(ctx));

    const event = press(el, 'Enter');
    expect(handler).toHaveBeenCalledOnce();
    expect(event.defaultPrevented).toBe(false);
  });

  it('handles multiple keys', () => {
    const enterHandler = vi.fn();
    const escapeHandler = vi.fn();
    const state = reactive({
      keyMap: { Enter: enterHandler, Escape: escapeHandler },
    });
    const ctx = createContext(Mode.CLIENT, state);
    const el = makeEl();

    keys('keyMap' as Expression, el, ctx.eval.bind(ctx));

    press(el, 'Enter');
    press(el, 'Escape');
    expect(enterHandler).toHaveBeenCalledOnce();
    expect(escapeHandler).toHaveBeenCalledOnce();
  });

  it('passes the KeyboardEvent to the handler', () => {
    const handler = vi.fn();
    const state = reactive({ keyMap: { ' ': handler } });
    const ctx = createContext(Mode.CLIENT, state);
    const el = makeEl();

    keys('keyMap' as Expression, el, ctx.eval.bind(ctx));

    press(el, ' ');
    expect(handler).toHaveBeenCalledWith(expect.any(KeyboardEvent));
    expect(handler.mock.calls[0][0].key).toBe(' ');
  });
});
