import { type Subject, SubjectIcon } from "@/entities/subject";
import type { Language } from "@/shared/config/language";
import { Surface } from "@/shared/ui";

import { formatQuestionCount } from "@/shared/lib/format";

type RequiredSubjectCardProps = {
  subject: Subject;
  uiLanguage: Language;
};

export function RequiredSubjectCard({ subject, uiLanguage }: RequiredSubjectCardProps) {
  return (
    <Surface className="flex items-center gap-3 p-4">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-sunken">
        <SubjectIcon name={subject.icon} className="size-[18px] text-ink-soft" aria-hidden />
      </span>
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="text-sm/[18px] font-medium text-ink">{subject.name[uiLanguage]}</span>
        <span className="text-xs text-ink-faint">{formatQuestionCount(subject.questionCount, uiLanguage)}</span>
      </span>
    </Surface>
  );
}
