import { ArrowRight, ArrowUpRight, CalendarDays } from "lucide-react";
import Link from "next/link";

import { SessionNavLink } from "@/entities/session";
import { IS_WAITLIST } from "@/shared/config/launch";
import { routes } from "@/shared/config/routes";
import { Button, Logo, PageContainer } from "@/shared/ui";

import { CONTACTS, FACTS, LAUNCH_NOTE } from "../model/content";
import { ErrorExample } from "./ErrorExample";
import { Faq } from "./Faq";
import { Pricing } from "./Pricing";
import { ProductTour } from "./ProductTour";
import { WaitlistForm } from "./WaitlistForm";

const WAITLIST_ANCHOR = "#waitlist";

function PrimaryAction() {
  if (IS_WAITLIST) {
    return (
      <Button as="a" href={WAITLIST_ANCHOR} size="lg">
        Записаться на запуск
        <ArrowRight className="size-4" aria-hidden />
      </Button>
    );
  }
  return (
    <Button as={Link} href={routes.examSetup} size="lg">
      Начать пробник
      <ArrowRight className="size-4" aria-hidden />
    </Button>
  );
}

export function LandingPage() {
  return (
    <PageContainer className="min-h-screen gap-24 lg:gap-32">
      <div className="flex flex-col">
        <header className="flex items-center justify-between gap-4">
          <Logo size="md" />
          {IS_WAITLIST ? (
            <Button as="a" href={WAITLIST_ANCHOR} variant="secondary" size="sm">
              Записаться на запуск
            </Button>
          ) : (
            <SessionNavLink />
          )}
        </header>

        <section className="stagger flex flex-col gap-10 pt-16 lg:gap-12 lg:pt-24">
          <p className="inline-flex w-fit items-center gap-2 rounded-full bg-surface py-1.5 pr-4 pl-3 text-[14px] font-semibold text-ink shadow-card ring-1 ring-line">
            <CalendarDays className="size-4 shrink-0 text-ink-muted" aria-hidden />
            {LAUNCH_NOTE}
          </p>
          <div className="flex max-w-[780px] flex-col gap-5">
            <h1 className="font-display text-[40px]/[1.05] font-medium tracking-[-1px] text-ink sm:text-[56px]/[1.02] lg:text-[64px]/[1]">
              Пробник ЕНТ, где AI разбирает каждую вашу ошибку
            </h1>
            <p className="max-w-[560px] text-base/7 text-ink-muted sm:text-lg/8">
              Полный вариант в формате ЕНТ на казахском или русском языке. Ошиблись — увидите, почему ответ неверный и
              как решать правильно.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <PrimaryAction />
            <Button as="a" href="#example" variant="ghost" size="lg">
              Как выглядит разбор
            </Button>
          </div>

          <dl className="flex flex-col gap-5 border-t border-line pt-6 sm:flex-row sm:gap-12">
            {FACTS.map((fact) => (
              <div key={fact.label} className="flex flex-col gap-1">
                <dt className="font-display text-2xl font-medium tracking-[-0.5px] text-ink">{fact.value}</dt>
                <dd className="max-w-[220px] text-[13px]/5 text-ink-muted">{fact.label}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      <ErrorExample />
      <ProductTour />
      <Pricing
        ctaHref={IS_WAITLIST ? WAITLIST_ANCHOR : routes.examSetup}
        ctaLabel={IS_WAITLIST ? "Записаться на запуск" : "Начать пробник"}
      />
      {IS_WAITLIST ? <WaitlistForm /> : null}
      <Faq />

      <footer className="mt-auto flex flex-col gap-4 border-t border-line py-7 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13px] text-ink-faint">upstudy</p>
        <nav className="flex items-center gap-6">
          {CONTACTS.map((contact) => (
            <a
              key={contact.href}
              href={contact.href}
              target="_blank"
              rel="noreferrer"
              className="press inline-flex items-center gap-1 text-[13px] text-ink-muted transition-colors duration-150 ease-out hover:text-ink"
            >
              {contact.label}
              <ArrowUpRight className="size-3.5" aria-hidden />
            </a>
          ))}
        </nav>
      </footer>
    </PageContainer>
  );
}
