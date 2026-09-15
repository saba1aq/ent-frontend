import { apiRequest, authorizedRequest } from "@/shared/api";
import { camelizeKeys } from "@/shared/lib/camelize";

import type { Checkout, Entitlement, PaymentState, PlanOffer, Quote, Referral } from "../model/types";

const BASE = "/api/v1/billing";

export async function fetchPlans(): Promise<PlanOffer[]> {
  return camelizeKeys<PlanOffer[]>(await apiRequest<unknown>(`${BASE}/plans/`));
}

export async function fetchEntitlement(): Promise<Entitlement> {
  return camelizeKeys<Entitlement>(await authorizedRequest<unknown>(`${BASE}/me/`));
}

export async function previewPromo(planCode: string, promoCode: string): Promise<Quote> {
  const dto = await authorizedRequest<unknown>(`${BASE}/promo/preview/`, {
    method: "POST",
    body: { plan_code: planCode, promo_code: promoCode },
  });
  return camelizeKeys<Quote>(dto);
}

export async function startCheckout(planCode: string, promoCode?: string | null): Promise<Checkout> {
  const dto = await authorizedRequest<unknown>(`${BASE}/checkout/`, {
    method: "POST",
    body: promoCode ? { plan_code: planCode, promo_code: promoCode } : { plan_code: planCode },
  });
  return camelizeKeys<Checkout>(dto);
}

export async function fetchPayment(paymentId: string): Promise<PaymentState> {
  return camelizeKeys<PaymentState>(await authorizedRequest<unknown>(`${BASE}/payments/${paymentId}/`));
}

export async function cancelAutoRenew(): Promise<Entitlement> {
  const dto = await authorizedRequest<unknown>(`${BASE}/subscription/cancel/`, { method: "POST" });
  return camelizeKeys<Entitlement>(dto);
}

export async function resumeAutoRenew(): Promise<Entitlement> {
  const dto = await authorizedRequest<unknown>(`${BASE}/subscription/resume/`, { method: "POST" });
  return camelizeKeys<Entitlement>(dto);
}

export async function fetchReferral(): Promise<Referral> {
  return camelizeKeys<Referral>(await authorizedRequest<unknown>(`${BASE}/referral/`));
}
