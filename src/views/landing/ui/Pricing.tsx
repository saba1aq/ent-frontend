import { Check } from "lucide-react";

import { Button, SectionLabel, Surface } from "@/shared/ui";

import { PRICE_TIERS, type PriceTier } from "../model/content";
import { SectionHeading } from "./SectionHeading";

type PricingProps = {
  ctaHref: string;
  ctaLabel: string;
};

function TierCard({ tier, ctaHref, ctaLabel }: PricingProps & { tier: PriceTier }) {
  return (
    <Surface className="flex flex-col gap-6 p-6 sm:p-7">
      <div className="flex flex-col gap-3">
        <SectionLabel tone="muted">{tier.name}</SectionLabel>
        <p className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
          <span className="font-display text-[36px]/[1] font-medium tracking-[-0.8px] text-ink">{tier.price}</span>
          <span className="text-[14px] text-ink-muted">{tier.period}</span>
        </p>
      </div>

      <ul className="flex flex-col gap-2.5">
        {tier.perks.map((perk) => (
          <li key={perk} className="flex items-start gap-2.5 text-[15px]/[22px] text-ink-soft">
            <Check className="mt-[3px] size-4 shrink-0 text-correct" strokeWidth={2.5} aria-hidden />
            {perk}
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-col gap-3 pt-2">
        {tier.note ? (
          <p className="w-fit rounded-md bg-highlight px-3 py-1.5 text-[13px] font-medium text-flag">{tier.note}</p>
        ) : null}
        <Button as="a" href={ctaHref} variant={tier.featured ? "primary" : "secondary"} size="lg" className="w-full">
          {ctaLabel}
        </Button>
      </div>
    </Surface>
  );
}

export function Pricing({ ctaHref, ctaLabel }: PricingProps) {
  return (
    <section id="pricing" className="flex scroll-mt-6 flex-col gap-8">
      <SectionHeading
        label="Цены"
        title="Первый пробник — бесплатно"
        text="Попробуйте полный вариант с разбором. Если подойдёт — подписка до конца сезона, без ежемесячных списаний."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {PRICE_TIERS.map((tier) => (
          <TierCard key={tier.name} tier={tier} ctaHref={ctaHref} ctaLabel={ctaLabel} />
        ))}
      </div>
    </section>
  );
}
