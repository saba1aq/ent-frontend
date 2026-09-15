export type PlanKind = "free" | "recurring" | "seasonal";

export type PlanOffer = {
  code: string;
  kind: PlanKind;
  name: string;
  description: string;
  amount: string | null;
  currency: string;
  periodDays: number | null;
  endsAt: string | null;
  examsPerMonth: number | null;
  paidNotes: boolean;
};

export type Entitlement = {
  planCode: string;
  planName: string;
  examsPerMonth: number | null;
  examsUsed: number;
  examsLeft: number | null;
  unlimited: boolean;
  paidNotes: boolean;
  expiresAt: string | null;
  autoRenew: boolean;
  canStartAttempt: boolean;
};

export type Quote = {
  planCode: string;
  planName: string;
  base: string;
  discount: string;
  total: string;
  currency: string;
  promoCode: string | null;
};

export type PaymentStatus = "created" | "pending" | "succeeded" | "failed" | "canceled" | "refunded";

export type Checkout = {
  paymentId: string;
  status: PaymentStatus;
  amount: string;
  currency: string;
  redirectUrl: string;
};

export type PaymentState = {
  paymentId: string;
  status: PaymentStatus;
  amount: string;
  currency: string;
  paidAt: string | null;
  failureMessage: string;
};

export type Referral = {
  code: string;
  link: string;
  bonusDaysPerInvite: number;
  maxBonusDays: number;
  bonusDaysEarned: number;
  bonusDaysLeft: number;
  invitedCount: number;
  rewardedCount: number;
  pendingCount: number;
  invitesLeft: number;
};
