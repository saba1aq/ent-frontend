import type { AttemptHistorySummary } from "@/entities/attempt";
import { formatHoursMinutes } from "@/shared/lib/format";
import { SectionLabel, Surface } from "@/shared/ui";

type HistorySummaryProps = {
  summary: AttemptHistorySummary;
};

export function HistorySummary({ summary }: HistorySummaryProps) {
  const dash = "—";
  const tiles = [
    { label: "Пробников сдано", value: String(summary.finishedCount) },
    {
      label: "Лучший балл",
      value: summary.bestScore === null ? dash : String(summary.bestScore),
      suffix: summary.maxScore === null ? undefined : `/ ${summary.maxScore}`,
    },
    {
      label: "Средний балл",
      value: summary.averageScore === null ? dash : String(summary.averageScore),
    },
    {
      label: "Средняя точность",
      value: summary.averageAccuracyPercent === null ? dash : `${summary.averageAccuracyPercent}%`,
    },
    {
      label: "Всего за тестами",
      value: summary.totalTimeSpentSeconds ? formatHoursMinutes(summary.totalTimeSpentSeconds) : dash,
    },
  ];

  return (
    <div className="animate-enter grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {tiles.map((tile) => (
        <Surface key={tile.label} className="flex flex-col gap-2 px-4 py-4">
          <p className="font-display text-[28px] leading-none font-medium tracking-[-0.8px] text-ink-strong">
            {tile.value}
            {tile.suffix ? <span className="text-[15px] tracking-[-0.2px] text-ink-faint"> {tile.suffix}</span> : null}
          </p>
          <SectionLabel>{tile.label}</SectionLabel>
        </Surface>
      ))}
    </div>
  );
}
