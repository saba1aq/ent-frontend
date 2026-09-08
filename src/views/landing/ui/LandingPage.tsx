import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { SessionNavLink } from "@/entities/session";
import { routes } from "@/shared/config/routes";
import { Button, SectionLabel, Surface } from "@/shared/ui";

const FACTS = [
  { value: "120", label: "вопросов в варианте" },
  { value: "4 часа", label: "как на настоящем ЕНТ" },
  { value: "5", label: "предметов: три обязательных и два профильных" },
];

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
        <span className="font-display text-xl font-medium tracking-[-0.4px] text-ink">Тренажёр ЕНТ</span>
        <SessionNavLink />
      </header>

      <section className="animate-enter flex flex-1 flex-col justify-center gap-10 py-16 lg:gap-12 lg:py-24">
        <div className="flex max-w-[760px] flex-col gap-5">
          <h1 className="font-display text-[40px]/[1.05] font-medium tracking-[-1px] text-ink sm:text-[56px]/[1.02] lg:text-[64px]/[1]">
            Реальные задания ЕНТ и разбор каждой вашей ошибки
          </h1>
          <p className="max-w-[560px] text-base/7 text-ink-muted sm:text-lg/8">
            Пробный экзамен в формате ЕНТ на телефоне или компьютере. Ошиблись — увидите, почему ответ неверный и как
            решать правильно.
          </p>
        </div>

        <div className="flex flex-col gap-9">
          <Button as={Link} href={routes.examSetup} size="lg" className="w-fit">
            Собрать вариант
            <ArrowRight className="size-4" aria-hidden />
          </Button>

          <dl className="flex flex-col gap-5 border-t border-line pt-6 sm:flex-row sm:gap-12">
            {FACTS.map((fact) => (
              <div key={fact.label} className="flex flex-col gap-1">
                <dt className="font-display text-2xl font-medium tracking-[-0.5px] text-ink">{fact.value}</dt>
                <dd className="max-w-[220px] text-[13px]/5 text-ink-muted">{fact.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="flex flex-col gap-4 pb-12">
        <SectionLabel as="h2">Как это работает</SectionLabel>
        <div className="stagger grid gap-3 sm:grid-cols-3">
          {STEPS.map((step) => (
            <Surface key={step.number} className="flex flex-col gap-3 p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <SectionLabel>{step.number}</SectionLabel>
                <span className="h-px flex-1 bg-line" />
              </div>
              <h3 className="font-display text-[17px] font-medium tracking-[-0.3px] text-ink">{step.title}</h3>
              <p className="text-[13px]/[21px] text-ink-muted">{step.text}</p>
            </Surface>
          ))}
        </div>
      </section>
    </main>
  );
}
