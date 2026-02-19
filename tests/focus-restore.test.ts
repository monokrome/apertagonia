import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createContext, Mode, type Expression } from 'gonia';
import { focusRestore } from '../src/directives/focus-restore.js';

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('g-a11y:focus-restore', () => {
  it('restores focus to previously focused element on removal', async () => {
    const trigger = document.createElement('button');
    trigger.id = 'trigger';
    document.body.appendChild(trigger);
    trigger.focus();

    const modal = document.createElement('div');
    document.body.appendChild(modal);

    const ctx = createContext(Mode.CLIENT, {});
    focusRestore('' as Expression, modal, ctx.eval.bind(ctx));

    // Remove the modal
    document.body.removeChild(modal);

    // MutationObserver is async — flush microtasks
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(document.activeElement).toBe(trigger);
  });

  it('restores focus to a specific selector', async () => {
    const other = document.createElement('button');
    other.id = 'other';
    document.body.appendChild(other);

    const trigger = document.createElement('button');
    trigger.id = 'target-btn';
    document.body.appendChild(trigger);
    other.focus();

    const modal = document.createElement('div');
    document.body.appendChild(modal);

    const state = { selector: '#target-btn' };
    const ctx = createContext(Mode.CLIENT, state);
    focusRestore('selector' as Expression, modal, ctx.eval.bind(ctx));

    document.body.removeChild(modal);
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(document.activeElement).toBe(trigger);
  });
});
