"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { fetchPayment, formatMoney, type PaymentState } from "@/entities/subscription";
import { describeError, NotAuthenticatedError } from "@/shared/api";
import { routes } from "@/shared/config/routes";
import { showToast } from "@/shared/lib/toast-store";
import { PageState } from "@/shared/ui";

const POLL_INTERVAL_MS = 1500;
const POLL_LIMIT = 20;

type BillingReturnPageProps = {
  paymentId: string | null;
};

const PENDING_STATUSES = new Set(["created", "pending"]);

export function BillingReturnPage({ paymentId }: BillingReturnPageProps) {
  const router = useRouter();
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (!paymentId) {
      router.replace(routes.billing);
      return;
    }

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const finish = (payment: PaymentState | null) => {
      if (payment?.status === "succeeded") {
        showToast(`Оплата ${formatMoney(payment.amount, payment.currency)} прошла. Подписка активна.`, "info");
      } else if (payment?.status === "failed") {
        showToast(payment.failureMessage || "Оплата не прошла. Попробуйте ещё раз.");
      } else {
        showToast("Оплата ещё обрабатывается. Мы включим подписку, как только банк подтвердит платёж.", "info");
      }
      router.replace(routes.billing);
    };

    const poll = async (round: number) => {
      try {
        const payment = await fetchPayment(paymentId);
        if (cancelled) {
          return;
        }
        if (!PENDING_STATUSES.has(payment.status)) {
          finish(payment);
          return;
        }
        if (round >= POLL_LIMIT) {
          finish(payment);
          return;
        }
        setAttempts(round + 1);
        timer = setTimeout(() => void poll(round + 1), POLL_INTERVAL_MS);
      } catch (caught) {
        if (cancelled || caught instanceof NotAuthenticatedError) {
          return;
        }
        showToast(describeError(caught, "Не удалось проверить платёж."));
        router.replace(routes.billing);
      }
    };

    void poll(0);

    return () => {
      cancelled = true;
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [paymentId, router]);

  return (
    <PageState
      message={attempts > 6 ? "Банк ещё думает, это может занять до минуты…" : "Проверяем оплату…"}
    />
  );
}
