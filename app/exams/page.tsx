import type { Metadata } from "next";

import { RequireSession } from "@/entities/session";
import { ExamHistoryPage } from "@/views/exam-history";

export const metadata: Metadata = { title: "Мои пробники" };

export default function Page() {
  return (
    <RequireSession>
      <ExamHistoryPage />
    </RequireSession>
  );
}
