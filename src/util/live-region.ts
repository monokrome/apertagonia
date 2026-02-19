type Politeness = 'polite' | 'assertive';

const VISUALLY_HIDDEN_STYLE =
  'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0';

const regions = new Map<Politeness, HTMLElement>();

function getOrCreateRegion(politeness: Politeness): HTMLElement {
  const existing = regions.get(politeness);
  if (existing && existing.isConnected) {
    return existing;
  }

  const el = document.createElement('div');
  el.setAttribute('aria-live', politeness);
  el.setAttribute('aria-atomic', 'true');
  el.setAttribute('role', politeness === 'assertive' ? 'alert' : 'status');
  el.setAttribute('style', VISUALLY_HIDDEN_STYLE);
  document.body.appendChild(el);
  regions.set(politeness, el);
  return el;
}

export function announce(message: string, politeness: Politeness = 'polite'): void {
  const region = getOrCreateRegion(politeness);
  region.textContent = '';
  // Force a DOM reflow so screen readers detect the change even if the
  // message is the same as the previous one.
  void region.offsetHeight;
  region.textContent = message;
}

export function clearRegions(): void {
  for (const el of regions.values()) {
    el.remove();
  }
  regions.clear();
}
