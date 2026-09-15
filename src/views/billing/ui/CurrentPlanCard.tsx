import { CalendarClock, Infinity as InfinityIcon } from "lucide-react";

import { formatDate, type Entitlement } from "@/entities/subscription";
import { pluralize } from "@/shared/lib/format";
import { Button, SectionLabel, Surface } from "@/shared/ui";

type CurrentPlanCardProps = {
  entitlement: Entitlement;
  isBusy: boolean;
  onCancel: () => void;
  onResume: () => void;
};

export function CurrentPlanCard({ entitlement, isBusy, onCancel, onResume }: CurrentPlanCardProps) {
  const hasSubscription = entitlement.expiresAt !== null;

  return (
    <Surface className="flex flex-col gap-5 p-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-col gap-2">
        <SectionLabel>Сейчас у вас</SectionLabel>
        <p className="font-display text-xl font-semibold text-ink-strong">{entitlement.planName}</p>
        <p className="flex items-center gap-2 text-sm text-ink-muted">
          {entitlement.unlimited ? (
            <>
              <InfinityIcon className="size-4 text-ink-faint" aria-hidden />
              Пробники без ограничений
            </>
          ) : (
            <>
              <CalendarClock className="size-4 text-ink-faint" aria-hidden />
              {entitlement.examsLeft === 0
                ? "Пробники на этот месяц закончились"
                : `Осталось ${entitlement.examsLeft} ${pluralize(entitlement.examsLeft ?? 0, ["пробник", "пробника", "пробников"])} в этом месяце`}
            </>
          )}
        </p>
        {hasSubscription ? (
          <p className="text-[13px] text-ink-faint">
            {entitlement.autoRenew
              ? `Продлится ${formatDate(entitlement.expiresAt)}`
              : `Действует до ${formatDate(entitlement.expiresAt)}, продление выключено`}
          </p>
        ) : null}
      </div>

      {hasSubscription ? (
        <Button variant="quiet" size="sm" loading={isBusy} onClick={entitlement.autoRenew ? onCancel : onResume}>
          {entitlement.autoRenew ? "Отключить продление" : "Включить продление"}
        </Button>
      ) : null}
    </Surface>
  );
}
