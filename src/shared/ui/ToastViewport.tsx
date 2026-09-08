"use client";

import { AlertTriangle, Info, X } from "lucide-react";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

import { cn } from "@/shared/lib/cn";
import { dismissToast, getToasts, subscribeToasts, type Toast } from "@/shared/lib/toast-store";

const VISIBLE_MS = 6000;
const EXIT_MS = 140;

const EMPTY: Toast[] = [];

export function ToastViewport() {
  const toasts = useSyncExternalStore(subscribeToasts, getToasts, () => EMPTY);

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed top-4 right-4 z-[100] flex w-[min(380px,calc(100vw-2rem))] flex-col gap-2">
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} />
      ))}
    </div>
  );
}

function ToastCard({ toast }: { toast: Toast }) {
  const [isLeaving, setIsLeaving] = useState(false);

  const close = useCallback(() => {
    setIsLeaving(true);
    window.setTimeout(() => dismissToast(toast.id), EXIT_MS);
  }, [toast.id]);

  useEffect(() => {
    const timer = window.setTimeout(close, VISIBLE_MS);
    return () => window.clearTimeout(timer);
  }, [close]);

  const isError = toast.tone === "error";

  return (
    <output
      role={isError ? "alert" : "status"}
      data-motion
      className={cn(
        "pointer-events-auto flex items-start gap-3 rounded-lg bg-surface px-4 py-3.5 shadow-raised ring-1 transition-[opacity,scale,translate] duration-[140ms] ease-out",
        isError ? "ring-wrong/25" : "ring-line",
        isLeaving ? "translate-x-2 scale-[0.98] opacity-0" : "animate-panel translate-x-0 scale-100 opacity-100",
      )}
    >
      {isError ? (
        <AlertTriangle className="mt-0.5 size-[17px] shrink-0 text-wrong" aria-hidden />
      ) : (
        <Info className="mt-0.5 size-[17px] shrink-0 text-ink-muted" aria-hidden />
      )}
      <p className="flex-1 text-[13px]/[19px] text-ink">{toast.message}</p>
      <button
        type="button"
        onClick={close}
        aria-label="Закрыть"
        className="press-tight -mt-1 -mr-2 flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-ink-faint hover:bg-sunken hover:text-ink"
      >
        <X className="size-4" aria-hidden />
      </button>
    </output>
  );
}
