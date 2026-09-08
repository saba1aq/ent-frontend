import { type Subject, SubjectIcon } from "@/entities/subject";
import type { Language } from "@/shared/config/language";
import { cn } from "@/shared/lib/cn";
import { formatQuestionCount } from "@/shared/lib/format";
import { SelectBubble } from "@/shared/ui";

import type { SubjectAvailability } from "../model/types";

const BUBBLE_STATES = {
  selected: "selected",
  available: "idle",
  unavailable: "muted",
} as const satisfies Record<SubjectAvailability, string>;

type ProfileSubjectCardProps = {
  subject: Subject;
  uiLanguage: Language;
  availability: SubjectAvailability;
  onToggle: (code: string) => void;
};

export function ProfileSubjectCard({ subject, uiLanguage, availability, onToggle }: ProfileSubjectCardProps) {
  const isSelected = availability === "selected";
  const isUnavailable = availability === "unavailable";

  return (
    <button
      type="button"
      disabled={isUnavailable}
      aria-pressed={isSelected}
      onClick={() => onToggle(subject.code)}
      className={cn(
        "flex flex-col gap-3 rounded-lg p-4 text-left transition-colors duration-150 ease-out",
        isSelected && "press cursor-pointer bg-surface shadow-card ring-2 ring-accent",
        availability === "available" &&
          "press cursor-pointer bg-surface shadow-card ring-1 ring-line-strong hover:bg-canvas",
        isUnavailable && "cursor-not-allowed bg-transparent ring-1 ring-line",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <SubjectIcon
          name={subject.icon}
          className={cn("size-[18px]", isUnavailable ? "text-ink-faint" : "text-ink-muted")}
          aria-hidden
        />
        <SelectBubble state={BUBBLE_STATES[availability]} />
      </div>
      <div className="flex min-w-0 flex-col gap-0.5">
        <span
          className={cn(
            "text-sm/[18px]",
            isUnavailable ? "text-ink-faint" : isSelected ? "font-medium text-ink" : "text-ink",
          )}
        >
          {subject.name[uiLanguage]}
        </span>
        <span className="text-xs text-ink-faint">{formatQuestionCount(subject.questionCount, uiLanguage)}</span>
      </div>
    </button>
  );
}
