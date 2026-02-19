import { describe, it, expect, beforeEach } from 'vitest';
import { createContext, Mode, reactive, type Expression } from 'gonia';
import { focusTrap } from '../src/directives/focus-trap.js';

const TABBABLE_OPTS = { displayCheck: 'none' as const };

beforeEach(() => {
  document.body.innerHTML = '';
});

function makeContainer(): HTMLDivElement {
  const container = document.createElement('div');
  const input = document.createElement('input');
  const button = document.createElement('button');
  button.textContent = 'Click';
  container.appendChild(input);
  container.appendChild(button);
  document.body.appendChild(container);
  return container;
}

describe('g-a11y:focus-trap', () => {
  it('creates a focus trap instance on the element', () => {
    const container = makeContainer();
    const state = reactive({
      opts: { active: false, tabbableOptions: TABBABLE_OPTS },
    });
    const ctx = createContext(Mode.CLIENT, state);

    focusTrap('opts' as Expression, container, ctx.eval.bind(ctx));

    expect(container.__a11yFocusTrap).toBeDefined();
    expect(container.__a11yFocusTrap!.active).toBe(false);
  });

  it('activates the trap when value is truthy', () => {
    const container = makeContainer();
    const state = reactive({
      opts: { active: true, tabbableOptions: TABBABLE_OPTS },
    });
    const ctx = createContext(Mode.CLIENT, state);

    focusTrap('opts' as Expression, container, ctx.eval.bind(ctx));

    expect(container.__a11yFocusTrap!.active).toBe(true);
  });

  it('deactivates the trap reactively', () => {
    const container = makeContainer();
    const state = reactive({
      opts: { active: true, tabbableOptions: TABBABLE_OPTS },
    });
    const ctx = createContext(Mode.CLIENT, state);

    focusTrap('opts' as Expression, container, ctx.eval.bind(ctx));

    expect(container.__a11yFocusTrap!.active).toBe(true);

    state.opts = { active: false, tabbableOptions: TABBABLE_OPTS };

    expect(container.__a11yFocusTrap!.active).toBe(false);
  });

  it('accepts an options object with escapeDeactivates', () => {
    const container = makeContainer();
    const state = reactive({
      opts: {
        active: true,
        escapeDeactivates: false,
        tabbableOptions: TABBABLE_OPTS,
      },
    });
    const ctx = createContext(Mode.CLIENT, state);

    focusTrap('opts' as Expression, container, ctx.eval.bind(ctx));

    expect(container.__a11yFocusTrap!.active).toBe(true);
  });

  it('exposes the underlying FocusTrap on __a11yFocusTrap', () => {
    const container = makeContainer();
    const state = reactive({
      opts: { active: false, tabbableOptions: TABBABLE_OPTS },
    });
    const ctx = createContext(Mode.CLIENT, state);

    focusTrap('opts' as Expression, container, ctx.eval.bind(ctx));

    const trap = container.__a11yFocusTrap!;
    expect(typeof trap.activate).toBe('function');
    expect(typeof trap.deactivate).toBe('function');
    expect(typeof trap.pause).toBe('function');
    expect(typeof trap.unpause).toBe('function');
  });
});
