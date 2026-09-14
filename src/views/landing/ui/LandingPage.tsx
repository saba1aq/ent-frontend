import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { SessionNavLink } from "@/entities/session";
import { routes } from "@/shared/config/routes";

import { ProductTour } from "./ProductTour";
import { Button, Logo, PageContainer } from "@/shared/ui";

const FACTS = [
  { value: "120", label: "вопросов в варианте" },
  { value: "4 часа", label: "как на настоящем ЕНТ" },
  { value: "5", label: "предметов: три обязательных и два профильных" },
];


const CONTACTS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/nurym-zhanserik/" },
  { label: "Telegram", href: "https://t.me/saba1aq" },
];

export function LandingPage() {
  return (
    <PageContainer className="min-h-screen">
      <header className="flex items-center justify-between gap-4">
        <Logo size="md" />
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
            Начать пробник
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

      <ProductTour />

      <footer className="mt-auto flex flex-col gap-4 border-t border-line py-7 sm:flex-row sm:items-center sm:justify-between">
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
