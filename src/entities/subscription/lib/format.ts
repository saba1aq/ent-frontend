import type { PlanOffer } from "../model/types";

const MONEY = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 });
const DATE = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric" });

export function formatMoney(amount: string | number | null, currency = "KZT"): string {
  if (amount === null) {
    return "—";
  }
  const value = typeof amount === "string" ? Number(amount) : amount;
  if (Number.isNaN(value)) {
    return "—";
  }
  return `${MONEY.format(value)} ${currency === "KZT" ? "₸" : currency}`;
}

export function formatPlanPeriod(plan: PlanOffer): string {
  if (plan.endsAt) {
    return `до ${DATE.format(new Date(plan.endsAt))}`;
  }
  if (plan.periodDays) {
    return `${plan.periodDays} дней`;
  }
  return "бессрочно";
}

export function formatDate(value: string | null): string {
  return value ? DATE.format(new Date(value)) : "—";
}
