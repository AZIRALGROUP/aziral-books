// Web Storage polyfill — jsdom@28 + vitest@4 stopped exposing window.localStorage
// / window.sessionStorage as globals in the jsdom test environment. The tests
// (and most of the app code under test) rely on the standard Web Storage API,
// so we install a minimal in-memory implementation when it's missing. This
// must run before any test module's top-level `localStorage.*` calls.
class MemoryStorage implements Storage {
  private store = new Map<string, string>();
  get length(): number {
    return this.store.size;
  }
  clear(): void {
    this.store.clear();
  }
  getItem(key: string): string | null {
    return this.store.has(key) ? (this.store.get(key) as string) : null;
  }
  key(index: number): string | null {
    return Array.from(this.store.keys())[index] ?? null;
  }
  removeItem(key: string): void {
    this.store.delete(key);
  }
  setItem(key: string, value: string): void {
    this.store.set(key, String(value));
  }
}

function installStorage(name: 'localStorage' | 'sessionStorage'): void {
  // jsdom@28 declares a Web Storage prototype on window but the underlying
  // value is undefined inside vitest@4 — so we check the actual value, not
  // mere property existence. We force-override on both window and globalThis
  // so module-level `localStorage.*` calls in tests resolve correctly.
  const storage = new MemoryStorage();
  const targets: Array<Record<string, unknown>> = [];
  if (typeof window !== 'undefined') targets.push(window as unknown as Record<string, unknown>);
  if (
    typeof globalThis !== 'undefined' &&
    globalThis !== (typeof window !== 'undefined' ? window : undefined)
  ) {
    targets.push(globalThis as Record<string, unknown>);
  }
  for (const target of targets) {
    const current = target[name];
    if (current && typeof (current as Storage).getItem === 'function') continue;
    Object.defineProperty(target, name, {
      value: storage,
      configurable: true,
      writable: false,
    });
  }
}

installStorage('localStorage');
installStorage('sessionStorage');

// matchMedia mock
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
}
