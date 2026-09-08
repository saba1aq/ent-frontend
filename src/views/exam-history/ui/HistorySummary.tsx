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
      value:
        summary.averageScore === null ? dash : String(summary.averageScore),
    },
    {
      label: "Средняя точность",
      value:
        summary.averageAccuracyPercent === null
          ? dash
          : `${summary.averageAccuracyPercent}%`,
    },
    {
      label: "Всего за тестами",
      value: summary.totalTimeSpentSeconds
        ? formatHoursMinutes(summary.totalTimeSpentSeconds)
        : dash,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {tiles.map((tile) => (
        <Surface key={tile.label} className="flex flex-col gap-2 px-4 py-3.5">
          <SectionLabel>{tile.label}</SectionLabel>
          <p className="font-mono text-2xl text-ink">
            {tile.value}
            {tile.suffix ? (
              <span className="ml-1.5 text-base text-ink-faint">
                {tile.suffix}
              </span>
            ) : null}
          </p>
        </Surface>
      ))}
    </div>
  );
}
