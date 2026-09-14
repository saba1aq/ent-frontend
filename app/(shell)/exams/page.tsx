import type { Metadata } from "next";

import { ExamHistoryPage } from "@/views/exam-history";

export const metadata: Metadata = { title: "Мои пробники" };

export default function Page() {
  return (
      <ExamHistoryPage />
  );
}
