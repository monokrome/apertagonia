import { describe, it, expect, beforeEach } from 'vitest';
import { createContext, Mode, reactive, effect, type Expression } from 'gonia';
import { inertSiblings } from '../src/directives/inert-siblings.js';

let container: HTMLElement;
let target: HTMLElement;
let siblingA: HTMLElement;
let siblingB: HTMLElement;

beforeEach(() => {
  document.body.innerHTML = '';
  container = document.createElement('div');
  siblingA = document.createElement('div');
  target = document.createElement('div');
  siblingB = document.createElement('div');
  container.appendChild(siblingA);
  container.appendChild(target);
  container.appendChild(siblingB);
  document.body.appendChild(container);
});

describe('g-a11y:inert-siblings', () => {
  it('hides siblings when value is truthy', () => {
    const state = reactive({ open: true });
    const ctx = createContext(Mode.CLIENT, state);

    inertSiblings('open' as Expression, target, ctx.eval.bind(ctx));

    expect(siblingA.getAttribute('aria-hidden')).toBe('true');
    expect(siblingA.inert).toBe(true);
    expect(siblingB.getAttribute('aria-hidden')).toBe('true');
    expect(siblingB.inert).toBe(true);
  });

  it('does not hide siblings when value is falsy', () => {
    const state = reactive({ open: false });
    const ctx = createContext(Mode.CLIENT, state);

    inertSiblings('open' as Expression, target, ctx.eval.bind(ctx));

    expect(siblingA.hasAttribute('aria-hidden')).toBe(false);
    expect(siblingA.inert).toBe(false);
  });

  it('restores siblings when value changes from truthy to falsy', () => {
    const state = reactive({ open: true });
    const ctx = createContext(Mode.CLIENT, state);

    inertSiblings('open' as Expression, target, ctx.eval.bind(ctx));

    expect(siblingA.getAttribute('aria-hidden')).toBe('true');

    state.open = false;

    expect(siblingA.hasAttribute('aria-hidden')).toBe(false);
    expect(siblingA.inert).toBe(false);
  });

  it('does not affect the target element', () => {
    const state = reactive({ open: true });
    const ctx = createContext(Mode.CLIENT, state);

    inertSiblings('open' as Expression, target, ctx.eval.bind(ctx));

    expect(target.hasAttribute('aria-hidden')).toBe(false);
    expect(target.inert).toBe(false);
  });

  it('preserves existing aria-hidden on siblings', () => {
    siblingA.setAttribute('aria-hidden', 'false');
    const state = reactive({ open: true });
    const ctx = createContext(Mode.CLIENT, state);

    inertSiblings('open' as Expression, target, ctx.eval.bind(ctx));

    expect(siblingA.getAttribute('aria-hidden')).toBe('true');

    state.open = false;
    expect(siblingA.getAttribute('aria-hidden')).toBe('false');
  });
});
