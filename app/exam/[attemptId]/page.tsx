import type { Metadata } from "next";

import { RequireSession } from "@/entities/session";
import { ExamRunPage } from "@/views/exam-run";

export const metadata: Metadata = { title: "Экзамен" };

type PageProps = {
  params: Promise<{ attemptId: string }>;
};

export default async function Page({ params }: PageProps) {
  const { attemptId } = await params;
  return (
    <RequireSession>
      <ExamRunPage attemptId={attemptId} />
    </RequireSession>
  );
}
