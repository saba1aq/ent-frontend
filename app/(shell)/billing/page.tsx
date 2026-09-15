import type { Metadata } from "next";

import { BillingPage } from "@/views/billing";

export const metadata: Metadata = { title: "Подписка" };

export default function Page() {
  return <BillingPage />;
}
