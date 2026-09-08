import { cn } from "@/shared/lib/cn";

type SurfaceOwnProps<T extends React.ElementType> = {
  as?: T;
  className?: string;
  children?: React.ReactNode;
};

type SurfaceProps<T extends React.ElementType> = SurfaceOwnProps<T> &
  Omit<React.ComponentPropsWithoutRef<T>, keyof SurfaceOwnProps<T>>;

export function Surface<T extends React.ElementType = "div">({ as, className, children, ...rest }: SurfaceProps<T>) {
  const Component = (as ?? "div") as React.ElementType;

  return (
    <Component className={cn("rounded-lg bg-surface shadow-card ring-1 ring-line", className)} {...rest}>
      {children}
    </Component>
  );
}
