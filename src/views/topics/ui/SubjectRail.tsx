import { SectionLabel } from "@/shared/ui";

import { DEMO_SUBJECT, DEMO_SUBJECTS } from "../model/demo";

export function SubjectRail() {
  return (
    <aside className="flex w-full shrink-0 flex-col gap-2.5 lg:w-[236px]">
      <SectionLabel>Предметы</SectionLabel>
      <ul className="flex flex-col gap-0.5">
        {DEMO_SUBJECTS.map((subject) => {
          const isActive = subject.name === DEMO_SUBJECT.name;
          return (
            <li
              key={subject.name}
              className={`flex flex-col gap-2 rounded-md px-3 py-2.5 ${isActive ? "bg-sunken" : ""}`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className={`text-[13px] ${isActive ? "font-medium text-ink" : "text-ink-muted"}`}>
                  {subject.name}
                </span>
                <span className="text-[11px] text-ink-faint">0%</span>
              </div>
              <span className="h-1 w-full rounded-full bg-line" />
            </li>
          );
        })}
      </ul>
      <p className="px-3 text-[12px]/[18px] text-ink-faint">Остальные предметы появятся вместе с банком заданий.</p>
    </aside>
  );
}
