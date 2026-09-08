import { cn } from "@/shared/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-ink-soft text-surface hover:bg-ink",
  secondary: "bg-surface text-ink outline outline-line-strong hover:bg-canvas",
  ghost: "text-ink-soft hover:bg-canvas",
};

export function Button({ variant = "primary", className, type = "button", disabled, ...props }: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-medium transition-colors",
        disabled ? "cursor-not-allowed bg-canvas text-ink-faint" : cn("cursor-pointer", VARIANT_CLASSES[variant]),
        className,
      )}
      {...props}
    />
  );
}
