import { Timer } from "lucide-react";

import type { Subject } from "@/entities/subject";
import type { Language } from "@/shared/config/language";
import { cn } from "@/shared/lib/cn";
import { formatDuration } from "@/shared/lib/format";
import { Button, FormError, SectionLabel, SelectBubble, Surface } from "@/shared/ui";

import type { ExamTotals } from "../model/types";

type SummaryTexts = {
  panelTitle: string;
  examLanguage: string;
  testLanguageNames: Record<Language, string>;
  totalQuestions: string;
  maxScore: string;
  examDuration: string;
  pauseWarning: string;
  startButton: string;
  hintPickTwo: string;
  hintPickSecond: string;
};

type SummaryPanelProps = {
  uiLanguage: Language;
  testLanguage: Language;
  texts: SummaryTexts;
  totals: ExamTotals;
  requiredSubjects: readonly Subject[];
  selectedSubjects: readonly Subject[];
  emptySlotSummaries: readonly string[];
  isReady: boolean;
  isStarting: boolean;
  startError: string | null;
  onStart: () => void;
};

export function SummaryPanel({
  uiLanguage,
  testLanguage,
  texts,
  totals,
  requiredSubjects,
  selectedSubjects,
  emptySlotSummaries,
  isReady,
  isStarting,
  startError,
  onStart,
}: SummaryPanelProps) {
  const rows = [
    { key: texts.examLanguage, value: texts.testLanguageNames[testLanguage] },
    { key: texts.totalQuestions, value: String(totals.questionCount) },
    { key: texts.maxScore, value: String(totals.maxScore) },
    { key: texts.examDuration, value: formatDuration(totals.durationMinutes, uiLanguage) },
  ];

  const hint = emptySlotSummaries.length === 1 ? texts.hintPickSecond : texts.hintPickTwo;

  return (
    <Surface as="aside" className="flex w-full flex-col gap-5 p-5 lg:sticky lg:top-8 lg:w-[336px] lg:shrink-0">
      <SectionLabel as="h2">{texts.panelTitle}</SectionLabel>

      <ul className="flex flex-col">
        {requiredSubjects.map((subject) => (
          <SummaryRow
            key={subject.code}
            state="fixed"
            name={subject.name[uiLanguage]}
            value={String(subject.questionCount)}
          />
        ))}

        {selectedSubjects.map((subject) => (
          <SummaryRow
            key={subject.code}
            state="selected"
            name={subject.name[uiLanguage]}
            value={String(subject.questionCount)}
          />
        ))}

        {emptySlotSummaries.map((summary, index) => (
          <SummaryRow key={`empty-${index}`} state="idle" name={summary} value="—" isMuted />
        ))}
      </ul>

      <dl className="flex flex-col gap-2.5 rounded-md bg-sunken px-4 py-3.5">
        {rows.map((row) => (
          <div key={row.key} className="flex items-baseline justify-between gap-4">
            <dt className="text-[13px] text-ink-muted">{row.key}</dt>
            <dd className="text-[13px] font-medium text-ink">{row.value}</dd>
          </div>
        ))}
      </dl>

      <p className="flex gap-2.5 text-xs/[18px] text-ink-muted">
        <Timer className="size-4 shrink-0 text-ink-faint" aria-hidden />
        {texts.pauseWarning}
      </p>

      <div className="flex flex-col gap-2.5">
        <FormError message={startError} />
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          loading={isStarting}
          disabled={!isReady}
          onClick={onStart}
        >
          {texts.startButton}
        </Button>
        {isReady ? null : <p className="text-center text-xs text-ink-faint">{hint}</p>}
      </div>
    </Surface>
  );
}

type SummaryRowProps = {
  state: "fixed" | "selected" | "idle";
  name: string;
  value: string;
  isMuted?: boolean;
};

function SummaryRow({ state, name, value, isMuted = false }: SummaryRowProps) {
  return (
    <li className="flex items-center justify-between gap-2.5 border-b border-line py-[11px] last:border-b-0">
      <span className="flex min-w-0 items-center gap-2.5">
        <SelectBubble state={state} />
        <span className={cn("truncate text-[13px]", isMuted ? "text-ink-faint" : "text-ink")}>{name}</span>
      </span>
      <span className={cn("text-xs", isMuted ? "text-ink-faint" : "text-ink-muted")}>{value}</span>
    </li>
  );
}
