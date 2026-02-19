import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createContext, Mode, reactive, effect, type Expression } from 'gonia';
import { live } from '../src/directives/live.js';
import { clearRegions } from '../src/util/live-region.js';

beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(() => {
  clearRegions();
});

describe('g-a11y:live (client)', () => {
  it('announces a string message', () => {
    const state = reactive({ msg: 'Hello world' });
    const ctx = createContext(Mode.CLIENT, state);
    const el = document.createElement('div');

    live('msg' as Expression, el, ctx.eval.bind(ctx), Mode.CLIENT);

    const region = document.querySelector('[aria-live="polite"]');
    expect(region).not.toBeNull();
    expect(region!.textContent).toBe('Hello world');
  });

  it('announces with assertive politeness', () => {
    const state = reactive({
      alert: { message: 'Error!', politeness: 'assertive' },
    });
    const ctx = createContext(Mode.CLIENT, state);
    const el = document.createElement('div');

    live('alert' as Expression, el, ctx.eval.bind(ctx), Mode.CLIENT);

    const region = document.querySelector('[aria-live="assertive"]');
    expect(region).not.toBeNull();
    expect(region!.textContent).toBe('Error!');
  });

  it('reactively updates announcements', () => {
    const state = reactive({ msg: 'First' });
    const ctx = createContext(Mode.CLIENT, state);
    const el = document.createElement('div');

    live('msg' as Expression, el, ctx.eval.bind(ctx), Mode.CLIENT);

    expect(document.querySelector('[aria-live="polite"]')!.textContent).toBe('First');

    state.msg = 'Second';

    expect(document.querySelector('[aria-live="polite"]')!.textContent).toBe('Second');
  });

  it('does not announce empty messages', () => {
    const state = reactive({ msg: '' });
    const ctx = createContext(Mode.CLIENT, state);
    const el = document.createElement('div');

    live('msg' as Expression, el, ctx.eval.bind(ctx), Mode.CLIENT);

    expect(document.querySelector('[aria-live="polite"]')).toBeNull();
  });
});

describe('g-a11y:live (server)', () => {
  it('sets aria-live and aria-atomic on the element', () => {
    const state = reactive({ msg: 'Status update' });
    const ctx = createContext(Mode.SERVER, state);
    const el = document.createElement('div');

    live('msg' as Expression, el, ctx.eval.bind(ctx), Mode.SERVER);

    expect(el.getAttribute('aria-live')).toBe('polite');
    expect(el.getAttribute('aria-atomic')).toBe('true');
  });

  it('uses assertive politeness on server when specified', () => {
    const state = reactive({
      alert: { message: 'Error!', politeness: 'assertive' },
    });
    const ctx = createContext(Mode.SERVER, state);
    const el = document.createElement('div');

    live('alert' as Expression, el, ctx.eval.bind(ctx), Mode.SERVER);

    expect(el.getAttribute('aria-live')).toBe('assertive');
  });

  it('does not create live regions in the DOM during SSR', () => {
    const state = reactive({ msg: 'Server message' });
    const ctx = createContext(Mode.SERVER, state);
    const el = document.createElement('div');

    live('msg' as Expression, el, ctx.eval.bind(ctx), Mode.SERVER);

    expect(document.querySelector('[aria-live="polite"][role="status"]')).toBeNull();
  });
});
