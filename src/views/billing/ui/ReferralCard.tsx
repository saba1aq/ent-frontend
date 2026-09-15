import { Check, Copy, Gift } from "lucide-react";
import { useState } from "react";

import type { Referral } from "@/entities/subscription";
import { cn } from "@/shared/lib/cn";
import { pluralize } from "@/shared/lib/format";
import { showToast } from "@/shared/lib/toast-store";
import { Button, SectionLabel, Surface } from "@/shared/ui";

const COPIED_RESET_MS = 2000;

function days(count: number): string {
  return `${count} ${pluralize(count, ["день", "дня", "дней"])}`;
}

export function ReferralCard({ referral }: { referral: Referral }) {
  const [isCopied, setIsCopied] = useState(false);
  const total = referral.maxBonusDays - (referral.maxBonusDays % referral.bonusDaysPerInvite);
  const slots = Math.floor(total / referral.bonusDaysPerInvite);
  const filled = Math.floor(referral.bonusDaysEarned / referral.bonusDaysPerInvite);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(referral.link);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), COPIED_RESET_MS);
    } catch {
      showToast("Не удалось скопировать — выделите ссылку вручную.");
    }
  };

  return (
    <Surface className="flex flex-col gap-5 p-6">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <Gift className="size-[18px] text-accent-strong" aria-hidden />
          <h2 className="font-display text-lg font-semibold text-ink-strong">Приглашайте друзей</h2>
        </div>
        <p className="text-sm text-ink-muted">
          Друг проходит первый пробник — и вы оба получаете {days(referral.bonusDaysPerInvite)} подписки. Приглашайте до{" "}
          {slots} {pluralize(slots, ["друга", "друзей", "друзей"])} — это {days(total)}.
        </p>
      </div>

      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
        <code className="min-w-0 flex-1 truncate rounded-md bg-sunken px-3.5 py-3 text-[13px] text-ink-soft">
          {referral.link}
        </code>
        <Button variant="secondary" size="lg" className="shrink-0" onClick={copy}>
          {isCopied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
          {isCopied ? "Скопировано" : "Копировать"}
        </Button>
      </div>

      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between gap-3">
          <SectionLabel>Получено дней</SectionLabel>
          <span className="text-[13px] font-medium text-ink-soft">
            {referral.bonusDaysEarned} из {total}
          </span>
        </div>
        <div className="flex gap-1.5">
          {Array.from({ length: slots }, (_, index) => (
            <span
              key={index}
              className={cn("h-2 flex-1 rounded-full", index < filled ? "bg-accent" : "bg-line")}
              aria-hidden
            />
          ))}
        </div>
        <p className="text-[13px] text-ink-faint">
          {referral.invitesLeft === 0
            ? "Вы получили максимум бонусных дней."
            : `Осталось приглашений с бонусом: ${referral.invitesLeft}.`}
          {referral.pendingCount > 0
            ? ` ${referral.pendingCount} ${pluralize(referral.pendingCount, ["друг ещё не прошёл", "друга ещё не прошли", "друзей ещё не прошли"])} первый пробник.`
            : ""}
        </p>
      </div>
    </Surface>
  );
}
