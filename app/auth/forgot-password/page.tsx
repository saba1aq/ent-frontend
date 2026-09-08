import type { Metadata } from "next";

import { ForgotPasswordPage } from "@/views/forgot-password";

export const metadata: Metadata = { title: "Восстановление пароля" };

export default function Page() {
  return <ForgotPasswordPage />;
}
