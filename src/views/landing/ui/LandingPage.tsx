import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { SessionNavLink } from "@/entities/session";
import { routes } from "@/shared/config/routes";
import { Surface } from "@/shared/ui";

const STEPS = [
  {
    number: "01",
    title: "Соберите вариант",
    text: "Три обязательных предмета уже в варианте. Выберите пару профильных и язык, на котором будете сдавать.",
  },
  {
    number: "02",
    title: "Решите как на ЕНТ",
    text: "120 вопросов, 4 часа, без паузы. Ответы сохраняются автоматически — можно вернуться к отмеченным.",
  },
  {
    number: "03",
    title: "Разберите ошибки",
    text: "После теста — баллы по блокам, карта ответов и объяснение к каждому вопросу, где вы ошиблись.",
  },
];

export function LandingPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[1200px] flex-col px-5 py-6 lg:px-10">
      <header className="flex items-center justify-between gap-4">
        <span className="font-serif text-xl font-medium tracking-[-0.4px] text-ink">Тренажёр ЕНТ</span>
        <SessionNavLink />
      </header>

      <section className="flex flex-1 flex-col justify-center gap-8 py-16 lg:py-24">
        <div className="flex max-w-[720px] flex-col gap-5">
          <h1 className="font-serif text-[40px]/[1.05] font-medium tracking-[-1px] text-ink sm:text-[56px]/[1.02]">
            Реальные задания ЕНТ и разбор каждой вашей ошибки
          </h1>
          <p className="max-w-[560px] text-base/7 text-ink-muted sm:text-lg/8">
            Пробный экзамен в формате ЕНТ на телефоне или компьютере. Ошиблись — увидите, почему ответ неверный и как
            решать правильно.
          </p>
        </div>
        <div>
          <Link
            href={routes.examSetup}
            className="inline-flex items-center gap-2 rounded-md bg-ink-soft px-6 py-3.5 text-sm font-medium text-surface transition-colors hover:bg-ink"
          >
            Собрать вариант
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </section>

      <section className="grid gap-3 pb-10 sm:grid-cols-3">
        {STEPS.map((step) => (
          <Surface key={step.number} className="flex flex-col gap-3 p-5">
            <span className="font-mono text-[11px] text-ink-faint">{step.number}</span>
            <h2 className="text-base font-medium text-ink">{step.title}</h2>
            <p className="text-[13px]/5 text-ink-muted">{step.text}</p>
          </Surface>
        ))}
      </section>
    </main>
  );
}
