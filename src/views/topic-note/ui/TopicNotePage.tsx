"use client";

import { ArrowLeft, ListChecks } from "lucide-react";
import Link from "next/link";

import { routes } from "@/shared/config/routes";
import { showToast } from "@/shared/lib/toast-store";
import { Button, PageContainer, SectionLabel, Surface } from "@/shared/ui";

import type { TopicNote } from "@/views/topics";

export function TopicNotePage({ note }: { note: TopicNote }) {
  return (
    <PageContainer>
      <Link
        href={routes.topics}
        className="press -mx-2.5 inline-flex w-fit items-center gap-2 rounded-md px-2.5 py-1.5 text-sm font-semibold text-ink transition-colors duration-150 ease-out hover:bg-sunken hover:text-ink-strong"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Задания по темам
      </Link>

      <header className="animate-enter flex flex-col gap-3">
        <SectionLabel>
          История Казахстана · {note.section}
        </SectionLabel>
        <h1 className="font-display text-[32px] leading-none font-medium tracking-[-0.9px] text-ink-strong lg:text-[38px]">
          {note.name}
        </h1>
        <p className="max-w-[720px] text-[15px]/[24px] text-ink-muted">{note.summary}</p>
        <p className="text-[13px] text-ink-faint">
          {note.readingMinutes} минут чтения · {note.questionCount} заданий в банке
        </p>
      </header>

      <article className="flex max-w-[760px] flex-col gap-8">
        {note.blocks.map((block) => (
          <section key={block.heading} className="flex flex-col gap-3">
            <h2 className="font-display text-[19px] font-medium tracking-[-0.3px] text-ink-strong">{block.heading}</h2>
            {block.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-[16px]/[26px] text-ink-soft">
                {paragraph}
              </p>
            ))}
          </section>
        ))}

        <div className="flex flex-col gap-3 rounded-lg bg-highlight p-5 ring-1 ring-flag/15 sm:p-6">
          <SectionLabel tone="muted">Запомните</SectionLabel>
          <ul className="flex flex-col gap-2">
            {note.keyFacts.map((fact) => (
              <li key={fact} className="flex gap-2.5 text-[15px]/[23px] text-ink">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                {fact}
              </li>
            ))}
          </ul>
        </div>
      </article>

      <Surface className="flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div className="flex flex-col gap-1">
          <p className="font-display text-[19px] font-medium tracking-[-0.3px] text-ink-strong">Проверьте себя</p>
          <p className="text-[14px] text-ink-muted">10 вопросов по теме, с разбором каждой ошибки</p>
        </div>
        <Button
          size="lg"
          onClick={() => showToast("Тесты по темам появятся в ближайшем обновлении.", "info")}
        >
          <ListChecks className="size-[18px]" aria-hidden />
          Пройти тест — 10 вопросов
        </Button>
      </Surface>
    </PageContainer>
  );
}
