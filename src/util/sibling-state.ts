interface SavedState {
  ariaHidden: string | null;
  inert: boolean;
}

const saved = new WeakMap<Element, SavedState>();

function siblings(el: Element): Element[] {
  const parent = el.parentElement;
  if (!parent) {
    return [];
  }
  return Array.from(parent.children).filter((child) => child !== el);
}

export function hideOtherElements(el: Element): void {
  for (const sibling of siblings(el)) {
    if (!saved.has(sibling)) {
      saved.set(sibling, {
        ariaHidden: sibling.getAttribute('aria-hidden'),
        inert: (sibling as HTMLElement).inert ?? false,
      });
    }
    sibling.setAttribute('aria-hidden', 'true');
    (sibling as HTMLElement).inert = true;
  }
}

export function restoreOtherElements(el: Element): void {
  for (const sibling of siblings(el)) {
    const state = saved.get(sibling);
    if (!state) {
      continue;
    }

    if (state.ariaHidden === null) {
      sibling.removeAttribute('aria-hidden');
    } else {
      sibling.setAttribute('aria-hidden', state.ariaHidden);
    }

    (sibling as HTMLElement).inert = state.inert;
    saved.delete(sibling);
  }
}
