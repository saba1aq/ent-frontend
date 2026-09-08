"use client";

import { X } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import { cn } from "@/shared/lib/cn";

const EXIT_DURATION_MS = 140;

type ModalProps = {
  title: string;
  subtitle?: React.ReactNode;
  onClose: () => void;
  footer?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
};

export function Modal({ title, subtitle, onClose, footer, className, children }: ModalProps) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeRequestedRef = useRef(false);
  const [isClosing, setIsClosing] = useState(false);

  const requestClose = useCallback(() => {
    if (closeRequestedRef.current) {
      return;
    }
    closeRequestedRef.current = true;
    setIsClosing(true);
    exitTimerRef.current = setTimeout(onClose, EXIT_DURATION_MS);
  }, [onClose]);

  useEffect(() => {
    closeRef.current?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
      if (exitTimerRef.current !== null) {
        clearTimeout(exitTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }
      event.stopPropagation();
      requestClose();
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [requestClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="Закрыть"
        tabIndex={-1}
        onClick={requestClose}
        data-motion
        className={cn(
          "absolute inset-0 cursor-default bg-ink/25 transition-opacity duration-[140ms] ease-out",
          isClosing ? "opacity-0" : "animate-fade opacity-100",
        )}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        data-motion
        className={cn(
          "relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-xl bg-surface shadow-raised transition-[opacity,scale] duration-[140ms] ease-out sm:max-w-[720px] sm:rounded-xl",
          isClosing ? "scale-[0.98] opacity-0" : "animate-panel scale-100 opacity-100",
          className,
        )}
      >
        <header className="flex items-start justify-between gap-6 border-b border-line px-6 py-5">
          <div className="flex flex-col gap-1">
            <h2 id={titleId} className="font-display text-[19px] font-medium tracking-[-0.3px] text-ink">
              {title}
            </h2>
            {subtitle ? <div className="text-[13px] text-ink-muted">{subtitle}</div> : null}
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={requestClose}
            aria-label="Закрыть"
            className="press-tight -mt-1 -mr-2 flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-md text-ink-faint transition-colors duration-150 ease-out hover:bg-sunken hover:text-ink"
          >
            <X className="size-[18px]" aria-hidden />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">{children}</div>

        {footer ? (
          <footer className="flex flex-col-reverse gap-2.5 border-t border-line px-6 py-4 sm:flex-row sm:justify-end">
            {footer}
          </footer>
        ) : null}
      </div>
    </div>
  );
}
