import { cn } from "@/shared/lib/cn";

type PageContainerWidth = "content" | "wide";

type PageContainerProps = {
  as?: "main" | "div" | "section";
  width?: PageContainerWidth;
  className?: string;
  children: React.ReactNode;
};

const WIDTH_CLASSES: Record<PageContainerWidth, string> = {
  content: "max-w-[1200px]",
  wide: "max-w-[1440px]",
};

export function PageContainer({ as = "main", width = "content", className, children }: PageContainerProps) {
  const Component = as;

  return (
    <Component
      className={cn(
        "mx-auto flex w-full flex-col gap-7 px-5 py-7 lg:px-10 lg:py-9",
        WIDTH_CLASSES[width],
        className,
      )}
    >
      {children}
    </Component>
  );
}
