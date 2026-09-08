import { cn } from "@/shared/lib/cn";

type SpinnerProps = {
  className?: string;
};

export function Spinner({ className }: SpinnerProps) {
  return (
    <span
      role="presentation"
      className={cn(
        "size-4 shrink-0 animate-spin-fast rounded-full border-2 border-current border-t-transparent",
        className,
      )}
    />
  );
}
