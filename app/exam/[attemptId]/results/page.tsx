import type { Metadata } from "next";

import { ExamResultsPage } from "@/views/exam-results";

export const metadata: Metadata = { title: "Результаты" };

type PageProps = {
  params: Promise<{ attemptId: string }>;
};

export default async function Page({ params }: PageProps) {
  const { attemptId } = await params;
  return (
      <ExamResultsPage attemptId={attemptId} />
  );
}
