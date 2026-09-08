export type ToastTone = "error" | "info";

export type Toast = {
  id: number;
  tone: ToastTone;
  message: string;
};

const listeners = new Set<() => void>();
const MAX_VISIBLE = 3;

let toasts: Toast[] = [];
let nextId = 1;

function notify(): void {
  listeners.forEach((listener) => listener());
}

export function subscribeToasts(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getToasts(): Toast[] {
  return toasts;
}

export function showToast(message: string, tone: ToastTone = "error"): number {
  const id = nextId;
  nextId += 1;
  const duplicate = toasts.find((toast) => toast.message === message && toast.tone === tone);
  if (duplicate) {
    return duplicate.id;
  }
  toasts = [...toasts, { id, tone, message }].slice(-MAX_VISIBLE);
  notify();
  return id;
}

export function dismissToast(id: number): void {
  const next = toasts.filter((toast) => toast.id !== id);
  if (next.length === toasts.length) {
    return;
  }
  toasts = next;
  notify();
}
