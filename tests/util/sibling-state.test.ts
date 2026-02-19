import { describe, it, expect, beforeEach } from 'vitest';
import { hideOtherElements, restoreOtherElements } from '../../src/util/sibling-state.js';

let container: HTMLElement;
let target: HTMLElement;
let siblingA: HTMLElement;
let siblingB: HTMLElement;

beforeEach(() => {
  document.body.innerHTML = '';
  container = document.createElement('div');
  target = document.createElement('div');
  siblingA = document.createElement('div');
  siblingB = document.createElement('div');
  container.appendChild(siblingA);
  container.appendChild(target);
  container.appendChild(siblingB);
  document.body.appendChild(container);
});

describe('hideOtherElements', () => {
  it('sets aria-hidden and inert on siblings', () => {
    hideOtherElements(target);
    expect(siblingA.getAttribute('aria-hidden')).toBe('true');
    expect(siblingA.inert).toBe(true);
    expect(siblingB.getAttribute('aria-hidden')).toBe('true');
    expect(siblingB.inert).toBe(true);
  });

  it('does not affect the target element', () => {
    hideOtherElements(target);
    expect(target.hasAttribute('aria-hidden')).toBe(false);
    expect(target.inert).toBe(false);
  });

  it('preserves existing aria-hidden values for later restore', () => {
    siblingA.setAttribute('aria-hidden', 'false');
    hideOtherElements(target);
    expect(siblingA.getAttribute('aria-hidden')).toBe('true');
    restoreOtherElements(target);
    expect(siblingA.getAttribute('aria-hidden')).toBe('false');
  });
});

describe('restoreOtherElements', () => {
  it('removes aria-hidden if it was not set before', () => {
    hideOtherElements(target);
    restoreOtherElements(target);
    expect(siblingA.hasAttribute('aria-hidden')).toBe(false);
    expect(siblingA.inert).toBe(false);
  });

  it('restores inert to its original value', () => {
    siblingA.inert = true;
    hideOtherElements(target);
    restoreOtherElements(target);
    expect(siblingA.inert).toBe(true);
  });

  it('is safe to call without a prior hide', () => {
    expect(() => restoreOtherElements(target)).not.toThrow();
    expect(siblingA.hasAttribute('aria-hidden')).toBe(false);
  });

  it('does not double-save state on repeated hide calls', () => {
    hideOtherElements(target);
    siblingA.setAttribute('aria-hidden', 'modified');
    hideOtherElements(target);
    restoreOtherElements(target);
    // Should restore to original (no attribute), not the modified value
    expect(siblingA.hasAttribute('aria-hidden')).toBe(false);
  });
});
