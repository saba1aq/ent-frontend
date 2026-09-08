"use client";

import { FormError } from "@/shared/ui";

import { useExamRun } from "../model/use-exam-run";
import { AnswersOverviewModal } from "./AnswersOverviewModal";
import { NavPanel } from "./NavPanel";
import { QuestionPanel } from "./QuestionPanel";

type ExamRunPageProps = {
  attemptId: string;
};

export function ExamRunPage({ attemptId }: ExamRunPageProps) {
  const exam = useExamRun(attemptId);

  if (!exam.overview) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md items-center p-6">
        <p className="w-full text-center text-sm text-ink-faint">{exam.error ?? "Загружаем вариант…"}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 p-4 sm:p-6 lg:flex-row lg:items-stretch">
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        {exam.error ? (
          <button type="button" onClick={exam.dismissError} className="cursor-pointer text-left">
            <FormError message={exam.error} />
          </button>
        ) : null}
        <QuestionPanel
          detail={exam.currentDetail}
          hasPrevious={exam.previousId !== null}
          hasNext={exam.nextId !== null}
          isFinishing={exam.isFinishing}
          onSelect={exam.selectOption}
          onFlag={exam.flag}
          onPrevious={() => exam.previousId !== null && exam.goTo(exam.previousId)}
          onNext={() => exam.nextId !== null && exam.goTo(exam.nextId)}
          onFinish={exam.openFinish}
        />
      </div>
      <NavPanel
        overview={exam.overview}
        flat={exam.flat}
        currentSection={exam.currentSection}
        currentId={exam.currentDetail?.id ?? null}
        remainingSeconds={exam.remainingSeconds}
        onGoTo={exam.goTo}
        onOpenOverview={exam.openOverview}
        onRequestFinish={exam.openFinish}
      />
      {exam.overviewMode !== "closed" ? (
        <AnswersOverviewModal
          overview={exam.overview}
          flat={exam.flat}
          currentId={exam.currentDetail?.id ?? null}
          isFinishing={exam.isFinishing}
          withFinishActions={exam.overviewMode === "finish"}
          onClose={exam.closeOverview}
          onGoTo={exam.goTo}
          onFinish={exam.finish}
        />
      ) : null}
    </main>
  );
}
