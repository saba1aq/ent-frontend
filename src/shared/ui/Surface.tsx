import { cn } from "@/shared/lib/cn";

type SurfaceProps<T extends React.ElementType> = {
  as?: T;
  className?: string;
  children: React.ReactNode;
};

export function Surface<T extends React.ElementType = "div">({ as, className, children }: SurfaceProps<T>) {
  const Component = as ?? "div";
  return <Component className={cn("rounded-md bg-surface outline outline-line", className)}>{children}</Component>;
}
