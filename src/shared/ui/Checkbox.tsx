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
    <label
      htmlFor={id}
      className={cn(
        "flex cursor-pointer items-center gap-2.5 text-[13px] text-ink-muted transition-colors duration-150 ease-out hover:text-ink-soft",
        className,
      )}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden
        className={cn(
          "flex size-[18px] items-center justify-center rounded-[5px] ring-[1.5px] transition-colors duration-150 ease-out peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent",
          checked ? "bg-accent text-white ring-accent" : "bg-surface text-transparent ring-line-strong",
        )}
      >
        <Check
          className={cn(
            "size-3 transition-[opacity,transform] duration-150 ease-out",
            checked ? "scale-100 opacity-100" : "scale-60 opacity-0",
          )}
          strokeWidth={3}
        />
      </span>
      {label}
    </label>
  );
}
