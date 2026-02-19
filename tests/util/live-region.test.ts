import { describe, it, expect, afterEach } from 'vitest';
import { announce, clearRegions } from '../../src/util/live-region.js';

afterEach(() => {
  clearRegions();
});

describe('announce', () => {
  it('creates a polite live region by default', () => {
    announce('Hello');
    const region = document.querySelector('[aria-live="polite"]');
    expect(region).not.toBeNull();
    expect(region!.textContent).toBe('Hello');
    expect(region!.getAttribute('aria-atomic')).toBe('true');
    expect(region!.getAttribute('role')).toBe('status');
  });

  it('creates an assertive live region', () => {
    announce('Error!', 'assertive');
    const region = document.querySelector('[aria-live="assertive"]');
    expect(region).not.toBeNull();
    expect(region!.textContent).toBe('Error!');
    expect(region!.getAttribute('role')).toBe('alert');
  });

  it('reuses the same region for repeated announcements', () => {
    announce('First');
    announce('Second');
    const regions = document.querySelectorAll('[aria-live="polite"]');
    expect(regions.length).toBe(1);
    expect(regions[0].textContent).toBe('Second');
  });

  it('creates separate regions for different politeness levels', () => {
    announce('Info', 'polite');
    announce('Alert', 'assertive');
    expect(document.querySelectorAll('[aria-live="polite"]').length).toBe(1);
    expect(document.querySelectorAll('[aria-live="assertive"]').length).toBe(1);
  });

  it('is visually hidden', () => {
    announce('Hidden');
    const region = document.querySelector('[aria-live="polite"]') as HTMLElement;
    expect(region.style.position).toBe('absolute');
    expect(region.style.width).toBe('1px');
    expect(region.style.height).toBe('1px');
    expect(region.style.overflow).toBe('hidden');
  });
});

describe('clearRegions', () => {
  it('removes all live regions from the DOM', () => {
    announce('A', 'polite');
    announce('B', 'assertive');
    clearRegions();
    expect(document.querySelector('[aria-live]')).toBeNull();
  });

  it('recreates regions after clearing', () => {
    announce('Before');
    clearRegions();
    announce('After');
    const region = document.querySelector('[aria-live="polite"]');
    expect(region).not.toBeNull();
    expect(region!.textContent).toBe('After');
  });
});
