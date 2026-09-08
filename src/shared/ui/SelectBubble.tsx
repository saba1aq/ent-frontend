import { Check } from "lucide-react";

import { cn } from "@/shared/lib/cn";

type SelectBubbleState = "selected" | "idle" | "muted" | "fixed";

type SelectBubbleProps = {
  state: SelectBubbleState;
  className?: string;
};

const STATE_CLASSES: Record<SelectBubbleState, string> = {
  selected: "bg-accent ring-accent text-white",
  idle: "bg-surface ring-line-strong text-transparent",
  muted: "bg-transparent ring-line text-transparent",
  fixed: "bg-ink-faint ring-ink-faint text-white",
};

export function SelectBubble({ state, className }: SelectBubbleProps) {
  const isChecked = state === "selected" || state === "fixed";

  return (
    <span
      aria-hidden
      className={cn(
        "flex size-[18px] shrink-0 items-center justify-center rounded-full ring-[1.5px] transition-colors duration-150 ease-out",
        STATE_CLASSES[state],
        className,
      )}
    >
      <Check
        className={cn(
          "size-3 transition-[opacity,transform] duration-150 ease-out",
          isChecked ? "scale-100 opacity-100" : "scale-60 opacity-0",
        )}
        strokeWidth={3}
      />
    </span>
  );
}
