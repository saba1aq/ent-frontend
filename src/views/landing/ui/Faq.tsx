import { ChevronDown } from "lucide-react";

import { Surface } from "@/shared/ui";

import { FAQ } from "../model/content";
import { SectionHeading } from "./SectionHeading";

export function Faq() {
  return (
    <section id="faq" className="flex scroll-mt-6 flex-col gap-8">
      <SectionHeading label="Вопросы" title="Частые вопросы" />
      <Surface className="flex flex-col divide-y divide-line px-5 sm:px-7">
        {FAQ.map((item) => (
          <details key={item.question} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-[16px] font-medium text-ink transition-colors duration-150 ease-out hover:text-ink-soft [&::-webkit-details-marker]:hidden">
              {item.question}
              <ChevronDown
                className="size-4 shrink-0 text-ink-faint transition-transform duration-200 ease-out group-open:rotate-180"
                aria-hidden
              />
            </summary>
            <p className="max-w-[640px] pb-5 text-[15px]/[24px] text-ink-muted">{item.answer}</p>
          </details>
        ))}
      </Surface>
    </section>
  );
}
