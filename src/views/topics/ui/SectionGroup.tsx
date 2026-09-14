import { ChevronDown, ChevronRight } from "lucide-react";

import { Surface } from "@/shared/ui";

import type { DemoSection } from "../model/demo";
import { TopicRow } from "./TopicRow";

export function SectionGroup({ section }: { section: DemoSection }) {
  const isOpen = section.topics.length > 0;

  return (
    <section className="flex flex-col gap-2.5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {isOpen ? (
            <ChevronDown className="size-4 text-ink-faint" aria-hidden />
          ) : (
            <ChevronRight className="size-4 text-ink-faint" aria-hidden />
          )}
          <h2 className="font-display text-[15px] font-medium tracking-[-0.2px] text-ink-strong">{section.name}</h2>
          <span className="text-[11px] text-ink-faint">{section.topicCount} тем · освоено 0</span>
        </div>
        <span className="text-[13px] font-medium text-ink-muted">Пройти раздел целиком →</span>
      </header>

      {isOpen ? (
        <Surface as="ul" className="flex flex-col divide-y divide-line overflow-hidden">
          {section.topics.map((topic) => (
            <TopicRow key={topic.name} topic={topic} />
          ))}
        </Surface>
      ) : null}
    </section>
  );
}
