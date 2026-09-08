import type { Metadata } from "next";

import { RequireSession } from "@/entities/session";
import { ExamReviewPage } from "@/views/exam-review";

export const metadata: Metadata = { title: "Разбор вопроса" };

type PageProps = {
  params: Promise<{ attemptId: string; questionId: string }>;
};

export default async function Page({ params }: PageProps) {
  const { attemptId, questionId } = await params;
  return (
    <RequireSession>
      <ExamReviewPage attemptId={attemptId} questionId={questionId} />
    </RequireSession>
  );
}
