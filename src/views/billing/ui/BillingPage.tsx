"use client";

import { useEffect, useState } from "react";

import {
  cancelAutoRenew,
  fetchEntitlement,
  fetchPlans,
  fetchReferral,
  previewPromo,
  resumeAutoRenew,
  startCheckout,
  type Entitlement,
  type PlanOffer,
  type Quote,
  type Referral,
} from "@/entities/subscription";
import { describeError, NotAuthenticatedError } from "@/shared/api";
import { showToast } from "@/shared/lib/toast-store";
import { PageContainer, PageState, SectionLabel } from "@/shared/ui";

import { CurrentPlanCard } from "./CurrentPlanCard";
import { PlanCard } from "./PlanCard";
import { PromoField } from "./PromoField";
import { ReferralCard } from "./ReferralCard";

export function BillingPage() {
  const [plans, setPlans] = useState<PlanOffer[] | null>(null);
  const [entitlement, setEntitlement] = useState<Entitlement | null>(null);
  const [referral, setReferral] = useState<Referral | null>(null);
  const [hasFailed, setHasFailed] = useState(false);
  const [promoInput, setPromoInput] = useState("");
  const [quotes, setQuotes] = useState<Record<string, Quote>>({});
  const [promoError, setPromoError] = useState<string | null>(null);
  const [isCheckingPromo, setIsCheckingPromo] = useState(false);
  const [busyPlan, setBusyPlan] = useState<string | null>(null);
  const [isChangingRenewal, setIsChangingRenewal] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([fetchPlans(), fetchEntitlement(), fetchReferral()])
      .then(([loadedPlans, loadedEntitlement, loadedReferral]) => {
        if (!cancelled) {
          setPlans(loadedPlans.filter((plan) => plan.kind !== "free"));
          setEntitlement(loadedEntitlement);
          setReferral(loadedReferral);
        }
      })
      .catch((caught: unknown) => {
        if (cancelled || caught instanceof NotAuthenticatedError) {
          return;
        }
        setHasFailed(true);
        showToast(describeError(caught, "Не удалось загрузить тарифы."));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const applyPromo = async () => {
    const code = promoInput.trim();
    if (!code || !plans) {
      return;
    }

    setIsCheckingPromo(true);
    setPromoError(null);
    const applied: Record<string, Quote> = {};
    const failures: string[] = [];

    for (const plan of plans) {
      try {
        applied[plan.code] = await previewPromo(plan.code, code);
      } catch (caught) {
        failures.push(describeError(caught, "Промокод не подошёл."));
      }
    }

    setQuotes(applied);
    setPromoError(Object.keys(applied).length === 0 ? (failures[0] ?? "Промокод не подошёл.") : null);
    setIsCheckingPromo(false);
  };

  const buy = async (planCode: string) => {
    setBusyPlan(planCode);
    try {
      const checkout = await startCheckout(planCode, quotes[planCode]?.promoCode ?? null);
      if (checkout.redirectUrl) {
        window.location.assign(checkout.redirectUrl);
        return;
      }
      setEntitlement(await fetchEntitlement());
      showToast("Подписка активирована.", "info");
    } catch (caught) {
      showToast(describeError(caught, "Не удалось перейти к оплате."));
    } finally {
      setBusyPlan(null);
    }
  };

  const changeRenewal = async (resume: boolean) => {
    setIsChangingRenewal(true);
    try {
      setEntitlement(await (resume ? resumeAutoRenew() : cancelAutoRenew()));
      showToast(resume ? "Автопродление включено." : "Автопродление выключено.", "info");
    } catch (caught) {
      showToast(describeError(caught, "Не удалось изменить продление."));
    } finally {
      setIsChangingRenewal(false);
    }
  };

  if (hasFailed) {
    return <PageState tone="error" message="Не удалось загрузить тарифы. Обновите страницу." />;
  }

  if (!plans || !entitlement) {
    return <PageState message="Загружаем тарифы…" />;
  }

  const appliedQuote = Object.values(quotes)[0] ?? null;

  return (
    <PageContainer>
      <header className="flex flex-col gap-1.5">
        <h1 className="font-display text-2xl font-semibold text-ink-strong">Подписка</h1>
        <p className="text-sm text-ink-muted">
          На бесплатном тарифе доступен один пробник в месяц. Подписка снимает ограничение и открывает конспекты.
        </p>
      </header>

      <CurrentPlanCard
        entitlement={entitlement}
        isBusy={isChangingRenewal}
        onCancel={() => changeRenewal(false)}
        onResume={() => changeRenewal(true)}
      />

      <section className="flex flex-col gap-4">
        <SectionLabel as="h2">Тарифы</SectionLabel>
        <div className="grid gap-4 lg:grid-cols-2">
          {plans.map((plan) => (
            <PlanCard
              key={plan.code}
              plan={plan}
              isCurrent={plan.code === entitlement.planCode}
              quote={quotes[plan.code] ?? null}
              isBusy={busyPlan === plan.code}
              onSelect={() => buy(plan.code)}
            />
          ))}
        </div>
      </section>

      {referral ? <ReferralCard referral={referral} /> : null}

      <section className="flex max-w-md flex-col gap-3">
        <SectionLabel as="h2">Есть промокод?</SectionLabel>
        <PromoField
          value={promoInput}
          quote={appliedQuote}
          error={promoError}
          isChecking={isCheckingPromo}
          onChange={setPromoInput}
          onApply={applyPromo}
        />
      </section>
    </PageContainer>
  );
}
