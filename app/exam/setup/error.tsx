"use client";

import { Button, Surface } from "@/shared/ui";

type ErrorPageProps = {
  reset: () => void;
};

export default function ExamSetupError({ reset }: ErrorPageProps) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center justify-center p-5">
      <div data-motion className="animate-enter w-full">
        <Surface className="flex w-full flex-col gap-4 p-6">
          <h1 className="font-display text-[22px]/[1.2] font-medium tracking-[-0.5px] text-ink">
            Не удалось загрузить предметы
          </h1>
          <p className="text-[13px]/5 text-ink-muted">
            Сервер не ответил. Проверьте, что бэкенд запущен, и попробуйте ещё раз.
          </p>
          <Button variant="secondary" onClick={reset} className="self-start">
            Повторить
          </Button>
        </Surface>
      </div>
    </main>
  );
}
