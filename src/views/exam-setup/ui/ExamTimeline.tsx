import type { Subject } from "@/entities/subject";
import type { Language } from "@/shared/config/language";
import { cn } from "@/shared/lib/cn";
import { formatMinutes } from "@/shared/lib/format";

const REQUIRED_TONES = ["bg-timeline-1", "bg-timeline-2", "bg-timeline-3"] as const;

const EMPTY_SEGMENT_CLASSES = "bg-timeline-empty border border-dashed border-line-strong";

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
      tone: EMPTY_SEGMENT_CLASSES,
      isEmpty: true,
    })),
  ];

  const totalMinutes = segments.reduce((sum, segment) => sum + segment.minutes, 0) || 1;

  return (
    <div className="flex w-full flex-col gap-2.5 border-t border-line pt-6">
      <ul className="flex flex-col gap-3 sm:hidden">
        {segments.map((segment) => (
          <li key={segment.key} className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between gap-3">
              <span className={cn("text-xs/4 font-medium", segment.isEmpty ? "text-ink-faint" : "text-ink-soft")}>
                {segment.label}
              </span>
              <span className="text-[11px] text-ink-faint">{formatMinutes(segment.minutes, uiLanguage)}</span>
            </div>
            <div className="h-2 rounded-full bg-sunken">
              <div
                className={cn("h-2 rounded-full transition-colors duration-150 ease-out", segment.tone)}
                style={{ width: `${Math.max(4, (segment.minutes / totalMinutes) * 100)}%` }}
              />
            </div>
          </li>
        ))}
      </ul>

      <div className="hidden gap-1 rounded-full bg-sunken p-1 sm:flex">
        {segments.map((segment) => (
          <div
            key={segment.key}
            className={cn("h-2 rounded-full transition-colors duration-150 ease-out", segment.tone)}
            style={{ flexGrow: segment.minutes, flexBasis: 0 }}
          />
        ))}
      </div>

      <div className="hidden gap-1 px-1 sm:flex">
        {segments.map((segment) => (
          <div
            key={segment.key}
            className="flex min-w-0 flex-col gap-0.5"
            style={{ flexGrow: segment.minutes, flexBasis: 0 }}
          >
            <span className={cn("truncate text-[11px]/4", segment.isEmpty ? "text-ink-faint" : "text-ink-soft")}>
              {segment.label}
            </span>
            <span className="text-[11px]/4 text-ink-faint">{formatMinutes(segment.minutes, uiLanguage)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
