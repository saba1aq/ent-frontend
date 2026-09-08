import { useId } from "react";

import { cn } from "@/shared/lib/cn";

type TextFieldProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "id" | "className"> & {
  label: string;
  hint?: string;
  error?: string | null;
  suffix?: React.ReactNode;
  className?: string;
};

export function TextField({ label, hint, error, suffix, className, ...inputProps }: TextFieldProps) {
  const id = useId();
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className={cn("flex flex-col gap-[7px]", className)}>
      <label htmlFor={id} className="text-[13px] font-medium text-ink">
        {label}
      </label>
      <div
        className={cn(
          "flex h-12 items-center gap-2.5 rounded-md bg-surface px-3.5 outline transition-colors focus-within:outline-ink",
          error ? "outline-ink-soft" : "outline-line-strong",
        )}
      >
        <input
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className="min-w-0 flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-faint"
          {...inputProps}
        />
        {suffix}
      </div>
      {error ? (
        <p id={`${id}-error`} className="text-xs text-ink-soft">
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
