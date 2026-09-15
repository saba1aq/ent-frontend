import type { Metadata } from "next";

import { BillingReturnPage } from "@/views/billing";

export const metadata: Metadata = { title: "Проверяем оплату" };

type PageProps = {
  searchParams: Promise<{ payment?: string | string[] }>;
};

export default async function Page({ searchParams }: PageProps) {
  const { payment } = await searchParams;
  const paymentId = Array.isArray(payment) ? payment[0] : payment;
  return <BillingReturnPage paymentId={paymentId ?? null} />;
}
