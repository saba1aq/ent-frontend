import { Circle, CircleCheck, Lock, Timer } from "lucide-react";

import type { Subject } from "@/entities/subject";
import type { Language } from "@/shared/config/language";
import { cn } from "@/shared/lib/cn";
import { Button, SectionLabel, Surface } from "@/shared/ui";

import { formatDuration } from "@/shared/lib/format";
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
    <Surface as="aside" className="flex w-full flex-col gap-5 p-6 lg:w-[340px] lg:shrink-0">
      <SectionLabel as="h2">{texts.panelTitle}</SectionLabel>

      <ul className="flex flex-col">
        {requiredSubjects.map((subject) => (
          <SummaryRow
            key={subject.code}
            icon={<Lock className="size-3.5 text-ink-faint" aria-hidden />}
            name={subject.name[uiLanguage]}
            value={String(subject.questionCount)}
          />
        ))}

        {selectedSubjects.map((subject) => (
          <SummaryRow
            key={subject.code}
            icon={<CircleCheck className="size-3.5 text-ink-soft" aria-hidden />}
            name={subject.name[uiLanguage]}
            value={String(subject.questionCount)}
          />
        ))}

        {emptySlotSummaries.map((summary, index) => (
          <SummaryRow
            key={`empty-${index}`}
            icon={<Circle className="size-3.5 text-ink-faint" aria-hidden />}
            name={summary}
            value="—"
            isMuted
          />
        ))}
      </ul>

      <dl className="flex flex-col gap-2.5">
        {rows.map((row) => (
          <div key={row.key} className="flex items-center justify-between gap-4">
            <dt className="text-[13px] text-ink-muted">{row.key}</dt>
            <dd className="text-[13px] font-medium text-ink">{row.value}</dd>
          </div>
        ))}
      </dl>

      <p className="flex gap-2.5 rounded-md bg-sunken p-3.5 text-xs/[18px] text-ink-soft">
        <Timer className="size-4 shrink-0 text-ink-soft" aria-hidden />
        {texts.pauseWarning}
      </p>

      <Button disabled={!isReady || isStarting} onClick={onStart} className="w-full py-3.5">
        {texts.startButton}
      </Button>

      {startError ? <p role="alert" className="text-center text-xs text-ink-soft">{startError}</p> : null}
      {isReady ? null : <p className="text-center text-xs text-ink-faint">{hint}</p>}
    </Surface>
  );
}

type SummaryRowProps = {
  icon: React.ReactNode;
  name: string;
  value: string;
  isMuted?: boolean;
};

function SummaryRow({ icon, name, value, isMuted = false }: SummaryRowProps) {
  return (
    <li className="flex items-center justify-between gap-2.5 border-b border-line py-[11px] last:border-b-0">
      <span className="flex min-w-0 items-center gap-2">
        {icon}
        <span className={cn("truncate text-[13px]", isMuted ? "text-ink-faint" : "text-ink")}>{name}</span>
      </span>
      <span className="font-mono text-xs text-ink-muted">{value}</span>
    </li>
  );
}
