import { Check } from "lucide-react";

import { formatMoney, formatPlanPeriod, type PlanOffer, type Quote } from "@/entities/subscription";
import { cn } from "@/shared/lib/cn";
import { Button, SectionLabel, Surface } from "@/shared/ui";

type PlanCardProps = {
  plan: PlanOffer;
  isCurrent: boolean;
  quote: Quote | null;
  isBusy: boolean;
  onSelect: () => void;
};

function benefits(plan: PlanOffer): string[] {
  const rows = [
    plan.examsPerMonth === null ? "Пробники без ограничений" : `${plan.examsPerMonth} пробник в месяц`,
    "Разбор всех ошибок",
  ];
  if (plan.paidNotes) {
    rows.push("Все конспекты по темам");
  }
  return rows;
}

export function PlanCard({ plan, isCurrent, quote, isBusy, onSelect }: PlanCardProps) {
  const hasDiscount = quote !== null && quote.discount !== "0.00";

  return (
    <Surface className={cn("flex flex-col gap-5 p-6", isCurrent && "bg-accent-soft")}>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-display text-lg font-semibold text-ink-strong">{plan.name}</h2>
          {isCurrent ? <SectionLabel tone="soft">Ваш тариф</SectionLabel> : null}
        </div>
        <p className="text-[13px] text-ink-muted">{plan.description}</p>
      </div>

      <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
        <span className="font-display text-[32px] leading-none font-semibold text-ink-strong">
          {formatMoney(hasDiscount ? quote.total : plan.amount, plan.currency)}
        </span>
        {hasDiscount ? (
          <span className="text-sm text-ink-faint line-through">{formatMoney(plan.amount, plan.currency)}</span>
        ) : null}
        <span className="text-[13px] text-ink-muted">{formatPlanPeriod(plan)}</span>
      </div>

      <ul className="flex flex-col gap-2.5">
        {benefits(plan).map((row) => (
          <li key={row} className="flex items-start gap-2.5 text-sm text-ink-soft">
            <Check className="mt-0.5 size-4 shrink-0 text-correct" aria-hidden />
            {row}
          </li>
        ))}
      </ul>

      <Button
        variant="primary"
        size="lg"
        className="mt-auto w-full"
        loading={isBusy}
        disabled={isCurrent}
        onClick={onSelect}
      >
        {isCurrent ? "Подключён" : "Оформить"}
      </Button>
    </Surface>
  );
}
