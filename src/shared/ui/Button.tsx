import { cn } from "@/shared/lib/cn";

import { Spinner } from "./Spinner";

type ButtonVariant = "primary" | "secondary" | "ghost" | "quiet";
type ButtonSize = "sm" | "md" | "lg";

type ButtonOwnProps<T extends React.ElementType> = {
  as?: T;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
};

type ButtonProps<T extends React.ElementType> = ButtonOwnProps<T> &
  Omit<React.ComponentPropsWithoutRef<T>, keyof ButtonOwnProps<T>>;

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-accent text-white shadow-card hover:bg-accent-hover",
  secondary: "bg-surface text-ink shadow-card ring-1 ring-line-strong hover:bg-sunken",
  ghost: "text-ink-soft ring-1 ring-transparent hover:bg-sunken",
  quiet: "text-ink-muted hover:text-ink",
};

const DISABLED_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-sunken text-ink-faint",
  secondary: "bg-sunken text-ink-faint ring-1 ring-line",
  ghost: "text-ink-faint",
  quiet: "text-ink-faint",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "h-9 gap-1.5 px-3 text-[13px]",
  md: "h-11 gap-2 px-4 text-sm",
  lg: "h-12 gap-2 px-5 text-[15px]",
};

export function Button<T extends React.ElementType = "button">({
  as,
  variant = "primary",
  size = "md",
  loading = false,
  className,
  disabled,
  children,
  ...rest
}: ButtonProps<T>) {
  const Component = (as ?? "button") as React.ElementType;
  const isNativeButton = Component === "button";
  const isInert = Boolean(disabled) || loading;

  const stateProps = isNativeButton
    ? { type: (rest as { type?: string }).type ?? "button", disabled: isInert }
    : { "aria-disabled": isInert || undefined };

  return (
    <Component
      aria-busy={loading || undefined}
      className={cn(
        "press inline-flex items-center justify-center rounded-md font-medium",
        SIZE_CLASSES[size],
        isInert ? cn("cursor-not-allowed", DISABLED_CLASSES[variant]) : cn("cursor-pointer", VARIANT_CLASSES[variant]),
        className,
      )}
      {...stateProps}
      {...rest}
    >
      {loading ? <Spinner className={variant === "primary" ? "text-ink-faint" : "text-ink-muted"} /> : null}
      {children}
    </Component>
  );
}
