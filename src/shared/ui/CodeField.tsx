"use client";

import { useId, useRef } from "react";

import { cn } from "@/shared/lib/cn";

const LENGTH = 6;
const SLOTS = Array.from({ length: LENGTH }, (_, index) => index);

type CodeFieldProps = {
  label: string;
  value: string;
  onChange: (code: string) => void;
  hint?: string;
  error?: string | null;
  className?: string;
};

export function CodeField({ label, value, onChange, hint, error, className }: CodeFieldProps) {
  const id = useId();
  const boxes = useRef<(HTMLInputElement | null)[]>([]);
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  const focusSlot = (index: number) => {
    const box = boxes.current[Math.max(0, Math.min(LENGTH - 1, index))];
    box?.focus();
    box?.select();
  };

  const fill = (index: number, raw: string) => {
    const digits = raw.replace(/\D/g, "");
    if (!digits) {
      return;
    }
    const next = (value.slice(0, index) + digits + value.slice(index + digits.length)).slice(0, LENGTH);
    onChange(next);
    focusSlot(index + digits.length);
  };

  const keyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace") {
      event.preventDefault();
      if (value[index]) {
        onChange(value.slice(0, index) + value.slice(index + 1));
        focusSlot(index);
      } else if (index > 0) {
        onChange(value.slice(0, index - 1) + value.slice(index));
        focusSlot(index - 1);
      }
      return;
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusSlot(index - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      focusSlot(index + 1);
    }
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <span id={`${id}-label`} className="text-[13px] font-medium text-ink-soft">
        {label}
      </span>
      <div role="group" aria-labelledby={`${id}-label`} aria-describedby={describedBy} className="flex gap-2">
        {SLOTS.map((index) => (
          <input
            key={index}
            ref={(box) => {
              boxes.current[index] = box;
            }}
            type="text"
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            aria-label={`Цифра ${index + 1} из ${LENGTH}`}
            value={value[index] ?? ""}
            onChange={(event) => fill(index, event.target.value)}
            onKeyDown={(event) => keyDown(index, event)}
            onFocus={(event) => event.target.select()}
            className={cn(
              "h-14 w-full min-w-0 rounded-md bg-surface text-center font-display text-[22px] font-medium text-ink ring-1 transition-[box-shadow,background-color] duration-150 ease-out focus:ring-2",
              error ? "ring-wrong focus:ring-wrong" : "ring-line-strong focus:ring-accent",
            )}
          />
        ))}
      </div>
      {error ? (
        <p id={`${id}-error`} className="text-xs text-wrong">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-ink-faint">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
