import { Check } from "lucide-react";
import { useId } from "react";

import { cn } from "@/shared/lib/cn";

type CheckboxProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
};

export function Checkbox({ label, checked, onChange, className }: CheckboxProps) {
  const id = useId();

  return (
    <label htmlFor={id} className={cn("flex cursor-pointer items-center gap-2 text-[13px] text-ink-muted", className)}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="peer sr-only"
      />
      <span
        className={cn(
          "flex size-4 items-center justify-center rounded-[3px] outline transition-colors peer-focus-visible:outline-2",
          checked ? "bg-ink-soft outline-ink-soft" : "bg-surface outline-line-strong",
        )}
        aria-hidden
      >
        {checked ? <Check className="size-3 text-surface" /> : null}
      </span>
      {label}
    </label>
  );
}
