import { PageContainer, SectionLabel, Surface } from "@/shared/ui";

import { DEMO_SECTIONS, DEMO_SUBJECT, DEMO_TOTALS } from "../model/demo";
import { PreviewNotice } from "./PreviewNotice";
import { SectionGroup } from "./SectionGroup";
import { SubjectRail } from "./SubjectRail";

const LEGEND = [
  { name: "Освоено", value: "0 тем" },
  { name: "В работе", value: "0 тем" },
  { name: "Не начато", value: `${DEMO_TOTALS.topicCount} тем` },
];

export function TopicsPage() {
  return (
    <div className="relative">
      <PageContainer width="wide" className="select-none">
        <PreviewNotice />

        <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
          <SubjectRail />

          <div className="flex min-w-0 flex-1 flex-col gap-6">
            <header className="flex flex-wrap items-end justify-between gap-5">
              <div className="flex flex-col gap-1.5">
                <SectionLabel>Задания по темам</SectionLabel>
                <h1 className="font-display text-[30px] leading-none font-medium tracking-[-0.7px] text-ink-strong">
                  {DEMO_SUBJECT.name}
                </h1>
                <p className="text-[14px] text-ink-muted">
                  {DEMO_TOTALS.sectionCount} разделов · {DEMO_TOTALS.topicCount} тем ·{" "}
                  {DEMO_TOTALS.questionCount.toLocaleString("ru-RU")} заданий с разбором
                </p>
              </div>
            </header>

            <Surface className="flex flex-col gap-3 p-5 sm:px-6">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-medium text-ink">Освоено 0 из {DEMO_TOTALS.topicCount} тем</p>
                <p className="text-[13px] text-ink-muted">0%</p>
              </div>
              <span className="h-2.5 w-full rounded-full bg-sunken" />
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                {LEGEND.map((item) => (
                  <span key={item.name} className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-line-strong" />
                    <span className="text-[12px] text-ink-muted">{item.name}</span>
                    <span className="text-[12px] text-ink-faint">{item.value}</span>
                  </span>
                ))}
              </div>
            </Surface>

            <div className="flex flex-col gap-6">
              {DEMO_SECTIONS.map((section) => (
                <SectionGroup key={section.name} section={section} />
              ))}
            </div>
          </div>
        </div>
      </PageContainer>

      <div className="absolute inset-0 z-20 bg-canvas/45" />
    </div>
  );
}
