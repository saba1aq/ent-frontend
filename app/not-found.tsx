import type { Metadata } from "next";
import Link from "next/link";

import { SessionNavLink } from "@/entities/session";
import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui";
import { ErrorScreen } from "@/views/error-screen";

export const metadata: Metadata = { title: "Страница не найдена" };

export default function NotFound() {
  return (
    <ErrorScreen
      label="Ошибка 404"
      title="Такой страницы нет"
      description="Возможно, в адресе опечатка или ссылка устарела. Всё остальное на месте — начните с главной."
    >
      <Button as={Link} href={routes.home} variant="primary" size="lg">
        На главную
      </Button>
      <SessionNavLink className="mx-0 px-4 py-3" />
    </ErrorScreen>
  );
}
