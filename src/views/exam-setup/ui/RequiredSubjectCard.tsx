import { type Subject, SubjectIcon } from "@/entities/subject";
import type { Language } from "@/shared/config/language";
import { formatQuestionCount } from "@/shared/lib/format";
import { SelectBubble } from "@/shared/ui";

type RequiredSubjectCardProps = {
  subject: Subject;
  uiLanguage: Language;
};

export function RequiredSubjectCard({ subject, uiLanguage }: RequiredSubjectCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg bg-sunken p-4 ring-1 ring-line">
      <div className="flex items-start justify-between gap-3">
        <SubjectIcon name={subject.icon} className="size-[18px] text-ink-faint" aria-hidden />
        <SelectBubble state="fixed" />
      </div>
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="text-sm/[18px] font-medium text-ink-soft">{subject.name[uiLanguage]}</span>
        <span className="text-xs text-ink-faint">{formatQuestionCount(subject.questionCount, uiLanguage)}</span>
      </div>
    </div>
  );
}
