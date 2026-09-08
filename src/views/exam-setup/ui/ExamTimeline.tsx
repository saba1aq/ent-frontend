import type { Subject } from "@/entities/subject";
import type { Language } from "@/shared/config/language";
import { cn } from "@/shared/lib/cn";

import { formatMinutes } from "@/shared/lib/format";

const REQUIRED_TONES = [
  "bg-timeline-1",
  "bg-timeline-2",
  "bg-timeline-3",
] as const;

type TimelineSegment = {
  key: string;
  label: string;
  minutes: number;
  tone: string;
  isEmpty: boolean;
};

type ExamTimelineProps = {
  uiLanguage: Language;
  requiredSubjects: readonly Subject[];
  selectedSubjects: readonly Subject[];
  emptySlotLabels: readonly string[];
  emptySlotMinutes: number;
};

export function ExamTimeline({
  uiLanguage,
  requiredSubjects,
  selectedSubjects,
  emptySlotLabels,
  emptySlotMinutes,
}: ExamTimelineProps) {
  const segments: TimelineSegment[] = [
    ...requiredSubjects.map((subject, index) => ({
      key: subject.code,
      label: subject.shortName[uiLanguage],
      minutes: subject.durationMinutes,
      tone: REQUIRED_TONES[index % REQUIRED_TONES.length],
      isEmpty: false,
    })),
    ...selectedSubjects.map((subject) => ({
      key: subject.code,
      label: subject.shortName[uiLanguage],
      minutes: subject.durationMinutes,
      tone: "bg-timeline-profile",
      isEmpty: false,
    })),
    ...emptySlotLabels.map((label, index) => ({
      key: `empty-${index}`,
      label,
      minutes: emptySlotMinutes,
      tone: "bg-timeline-empty",
      isEmpty: true,
    })),
  ];

  const totalMinutes =
    segments.reduce((sum, segment) => sum + segment.minutes, 0) || 1;

  return (
    <div className="w-full border-t border-line pt-6">
      <ul className="flex flex-col gap-3 sm:hidden">
        {segments.map((segment) => (
          <li key={segment.key} className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between gap-3">
              <span
                className={cn(
                  "text-xs/4 font-medium",
                  segment.isEmpty ? "text-ink-faint" : "text-ink",
                )}
              >
                {segment.label}
              </span>
              <span className="font-mono text-[11px] text-ink-faint">
                {formatMinutes(segment.minutes, uiLanguage)}
              </span>
            </div>
            <div
              className={cn("h-2 rounded-sm", segment.tone)}
              style={{
                width: `${Math.max(4, (segment.minutes / totalMinutes) * 100)}%`,
              }}
            />
          </li>
        ))}
      </ul>

      <div className="hidden gap-1 sm:flex">
        {segments.map((segment) => (
          <div
            key={segment.key}
            className="flex min-w-0 flex-col gap-2"
            style={{ flexGrow: segment.minutes, flexBasis: 0 }}
          >
            <div className={cn("h-2 rounded-sm", segment.tone)} />
            <span
              className={cn(
                "line-clamp-2 min-h-8 text-xs/4 font-medium",
                segment.isEmpty ? "text-ink-faint" : "text-ink",
              )}
            >
              {segment.label}
            </span>
            <span className="font-mono text-[11px] text-ink-faint">
              {formatMinutes(segment.minutes, uiLanguage)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
