"use client";

import { Button, Surface } from "@/shared/ui";

type ErrorPageProps = {
  reset: () => void;
};

export default function ExamSetupError({ reset }: ErrorPageProps) {
  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center p-5">
      <Surface className="flex w-full flex-col gap-4 p-6">
        <h1 className="font-serif text-2xl font-medium tracking-[-0.5px] text-ink">Не удалось загрузить предметы</h1>
        <p className="text-sm text-ink-muted">Сервер не ответил. Проверьте, что бэкенд запущен, и попробуйте ещё раз.</p>
        <Button variant="secondary" onClick={reset}>
          Повторить
        </Button>
      </Surface>
    </main>
  );
}
