const STORAGE_KEY = "ent.sidebar-collapsed";
const listeners = new Set<() => void>();

let isCollapsed = false;
let isHydrated = false;

function readStorage(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function hydrate(): void {
  if (isHydrated) {
    return;
  }
  isHydrated = true;
  isCollapsed = readStorage();
}

export function subscribeSidebar(listener: () => void): () => void {
  hydrate();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getSidebarCollapsed(): boolean {
  hydrate();
  return isCollapsed;
}

export function getSidebarCollapsedServer(): boolean {
  return false;
}

export function toggleSidebar(): void {
  isCollapsed = !isCollapsed;
  try {
    window.localStorage.setItem(STORAGE_KEY, isCollapsed ? "1" : "0");
  } catch {
    return;
  } finally {
    listeners.forEach((listener) => listener());
  }
}
