import { type Subject, SubjectIcon } from "@/entities/subject";
import type { Language } from "@/shared/config/language";
import { cn } from "@/shared/lib/cn";

import type { SubjectAvailability } from "../model/types";

type ProfileSubjectCardProps = {
  subject: Subject;
  uiLanguage: Language;
  availability: SubjectAvailability;
  onToggle: (code: string) => void;
};

export function ProfileSubjectCard({ subject, uiLanguage, availability, onToggle }: ProfileSubjectCardProps) {
  const isUnavailable = availability === "unavailable";

  return (
    <button
      type="button"
      disabled={isUnavailable}
      aria-pressed={availability === "selected"}
      onClick={() => onToggle(subject.code)}
      className={cn(
        "flex h-22 flex-col items-center justify-center gap-2.5 rounded-md px-2 text-center transition-colors",
        availability === "selected" && "cursor-pointer bg-sunken outline-2 outline-ink-soft",
        availability === "available" && "cursor-pointer bg-surface outline-[1.5px] outline-ink-faint hover:bg-sunken/60",
        isUnavailable && "cursor-not-allowed bg-canvas outline outline-line-strong",
      )}
    >
      <SubjectIcon
        name={subject.icon}
        className={cn(
          "size-[21px]",
          availability === "selected" && "text-ink-soft",
          availability === "available" && "text-ink",
          isUnavailable && "text-ink-faint opacity-45",
        )}
        aria-hidden
      />
      <span
        className={cn(
          "text-sm",
          isUnavailable
            ? "text-ink-faint opacity-55"
            : availability === "selected"
              ? "font-medium text-ink-soft"
              : "font-medium text-ink",
        )}
      >
        {subject.name[uiLanguage]}
      </span>
    </button>
  );
}
