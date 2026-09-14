import { cn } from "@/shared/lib/cn";

import { Spinner } from "./Spinner";

type PageStateProps = {
  tone?: "loading" | "error";
  message: string;
  className?: string;
};

export function PageState({ tone = "loading", message, className }: PageStateProps) {
  const isError = tone === "error";

  return (
    <main className={cn("mx-auto flex min-h-[60vh] w-full max-w-md items-center justify-center px-5 py-10", className)}>
      {isError ? (
        <p role="alert" className="text-center text-sm text-wrong">
          {message}
        </p>
      ) : (
        <p className="flex items-center gap-2.5 text-sm text-ink-muted">
          <Spinner className="text-ink-faint" />
          {message}
        </p>
      )}
    </main>
  );
}
