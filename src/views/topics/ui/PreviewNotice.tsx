import Link from "next/link";

import { routes } from "@/shared/config/routes";
import { Button, SectionLabel } from "@/shared/ui";

export function PreviewNotice() {
  return (
    <div className="sticky top-4 z-30 flex w-full flex-col gap-4 rounded-xl bg-surface p-4 shadow-raised ring-1 ring-accent-line sm:flex-row sm:items-center sm:gap-5 sm:p-5">
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <SectionLabel tone="muted">Скоро</SectionLabel>
        <p className="font-display text-[17px] font-medium tracking-[-0.2px] text-ink-strong">Страница в разработке</p>
        <p className="max-w-[620px] text-[13px]/[20px] text-ink-muted">
          Так будет выглядеть подготовка по темам: разделы школьной программы, конспект по каждой теме и тест на 10
          вопросов. Раздел ещё не подключён — цифры ниже нулевые и пока не считаются.
        </p>
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <Button as={Link} href={routes.examSetup} size="sm">
          Новый пробник
        </Button>
        <Button as={Link} href={routes.exams} variant="quiet" size="sm">
          Мои пробники
        </Button>
      </div>
    </div>
  );
}
