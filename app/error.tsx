"use client";

import Link from "next/link";
import { useEffect } from "react";

import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui";
import { ErrorScreen } from "@/views/error-screen";

type AppErrorProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

export default function AppError({ error, retry }: AppErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorScreen
      label="Ошибка"
      title="Что-то пошло не так"
      description="Страница не загрузилась. Обычно помогает повторить попытку — данные при этом не теряются."
      footnote={error.digest ? `Код ошибки: ${error.digest}` : null}
    >
      <Button variant="primary" size="lg" onClick={() => retry()}>
        Повторить
      </Button>
      <Button as={Link} href={routes.home} variant="secondary" size="lg">
        На главную
      </Button>
    </ErrorScreen>
  );
}
