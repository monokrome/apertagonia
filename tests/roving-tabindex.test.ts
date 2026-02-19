import { describe, it, expect, beforeEach } from 'vitest';
import { createContext, Mode, reactive, effect, type Expression } from 'gonia';
import { rovingTabindex } from '../src/directives/roving-tabindex.js';

function makeList(count: number): HTMLUListElement {
  const ul = document.createElement('ul');
  for (let i = 0; i < count; i++) {
    const li = document.createElement('li');
    li.setAttribute('role', 'option');
    li.textContent = `Item ${i}`;
    ul.appendChild(li);
  }
  document.body.appendChild(ul);
  return ul;
}

function press(el: HTMLElement, key: string): KeyboardEvent {
  const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
  el.dispatchEvent(event);
  return event;
}

function getTabindexValues(ul: HTMLElement): string[] {
  return Array.from(ul.querySelectorAll('[role=option]')).map(
    (el) => el.getAttribute('tabindex') ?? '',
  );
}

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('g-a11y:roving-tabindex', () => {
  it('initializes tabindex: first item 0, rest -1', () => {
    const ul = makeList(3);
    const state = reactive({
      opts: { selector: '[role=option]', orientation: 'vertical' },
    });
    const ctx = createContext(Mode.CLIENT, state);

    rovingTabindex('opts' as Expression, ul, ctx.eval.bind(ctx));

    expect(getTabindexValues(ul)).toEqual(['0', '-1', '-1']);
  });

  it('moves focus down with ArrowDown', () => {
    const ul = makeList(3);
    const state = reactive({
      opts: { selector: '[role=option]', orientation: 'vertical' },
    });
    const ctx = createContext(Mode.CLIENT, state);

    rovingTabindex('opts' as Expression, ul, ctx.eval.bind(ctx));

    press(ul, 'ArrowDown');
    expect(getTabindexValues(ul)).toEqual(['-1', '0', '-1']);
  });

  it('moves focus up with ArrowUp', () => {
    const ul = makeList(3);
    const state = reactive({
      opts: { selector: '[role=option]', orientation: 'vertical' },
    });
    const ctx = createContext(Mode.CLIENT, state);

    rovingTabindex('opts' as Expression, ul, ctx.eval.bind(ctx));

    press(ul, 'ArrowDown');
    press(ul, 'ArrowUp');
    expect(getTabindexValues(ul)).toEqual(['0', '-1', '-1']);
  });

  it('wraps around at the end', () => {
    const ul = makeList(3);
    const state = reactive({
      opts: { selector: '[role=option]', orientation: 'vertical', wrap: true },
    });
    const ctx = createContext(Mode.CLIENT, state);

    rovingTabindex('opts' as Expression, ul, ctx.eval.bind(ctx));

    press(ul, 'ArrowDown');
    press(ul, 'ArrowDown');
    press(ul, 'ArrowDown');
    expect(getTabindexValues(ul)).toEqual(['0', '-1', '-1']);
  });

  it('wraps around at the beginning', () => {
    const ul = makeList(3);
    const state = reactive({
      opts: { selector: '[role=option]', orientation: 'vertical', wrap: true },
    });
    const ctx = createContext(Mode.CLIENT, state);

    rovingTabindex('opts' as Expression, ul, ctx.eval.bind(ctx));

    press(ul, 'ArrowUp');
    expect(getTabindexValues(ul)).toEqual(['-1', '-1', '0']);
  });

  it('does not wrap when wrap is false', () => {
    const ul = makeList(3);
    const state = reactive({
      opts: { selector: '[role=option]', orientation: 'vertical', wrap: false },
    });
    const ctx = createContext(Mode.CLIENT, state);

    rovingTabindex('opts' as Expression, ul, ctx.eval.bind(ctx));

    press(ul, 'ArrowUp');
    expect(getTabindexValues(ul)).toEqual(['0', '-1', '-1']);
  });

  it('Home jumps to first item', () => {
    const ul = makeList(3);
    const state = reactive({
      opts: { selector: '[role=option]', orientation: 'vertical' },
    });
    const ctx = createContext(Mode.CLIENT, state);

    rovingTabindex('opts' as Expression, ul, ctx.eval.bind(ctx));

    press(ul, 'ArrowDown');
    press(ul, 'ArrowDown');
    press(ul, 'Home');
    expect(getTabindexValues(ul)).toEqual(['0', '-1', '-1']);
  });

  it('End jumps to last item', () => {
    const ul = makeList(3);
    const state = reactive({
      opts: { selector: '[role=option]', orientation: 'vertical' },
    });
    const ctx = createContext(Mode.CLIENT, state);

    rovingTabindex('opts' as Expression, ul, ctx.eval.bind(ctx));

    press(ul, 'End');
    expect(getTabindexValues(ul)).toEqual(['-1', '-1', '0']);
  });

  it('ignores ArrowLeft/Right in vertical orientation', () => {
    const ul = makeList(3);
    const state = reactive({
      opts: { selector: '[role=option]', orientation: 'vertical' },
    });
    const ctx = createContext(Mode.CLIENT, state);

    rovingTabindex('opts' as Expression, ul, ctx.eval.bind(ctx));

    press(ul, 'ArrowRight');
    expect(getTabindexValues(ul)).toEqual(['0', '-1', '-1']);
  });

  it('uses ArrowLeft/Right in horizontal orientation', () => {
    const ul = makeList(3);
    const state = reactive({
      opts: { selector: '[role=option]', orientation: 'horizontal' },
    });
    const ctx = createContext(Mode.CLIENT, state);

    rovingTabindex('opts' as Expression, ul, ctx.eval.bind(ctx));

    press(ul, 'ArrowRight');
    expect(getTabindexValues(ul)).toEqual(['-1', '0', '-1']);

    press(ul, 'ArrowLeft');
    expect(getTabindexValues(ul)).toEqual(['0', '-1', '-1']);
  });

  it('responds to both axes when orientation is both', () => {
    const ul = makeList(3);
    const state = reactive({
      opts: { selector: '[role=option]', orientation: 'both' },
    });
    const ctx = createContext(Mode.CLIENT, state);

    rovingTabindex('opts' as Expression, ul, ctx.eval.bind(ctx));

    press(ul, 'ArrowDown');
    expect(getTabindexValues(ul)).toEqual(['-1', '0', '-1']);

    press(ul, 'ArrowLeft');
    expect(getTabindexValues(ul)).toEqual(['0', '-1', '-1']);
  });

  it('preventDefault on handled keys', () => {
    const ul = makeList(3);
    const state = reactive({
      opts: { selector: '[role=option]', orientation: 'vertical' },
    });
    const ctx = createContext(Mode.CLIENT, state);

    rovingTabindex('opts' as Expression, ul, ctx.eval.bind(ctx));

    const event = press(ul, 'ArrowDown');
    expect(event.defaultPrevented).toBe(true);
  });
});
