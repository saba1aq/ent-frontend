import { Check, Sparkles, X } from "lucide-react";

import { cn } from "@/shared/lib/cn";
import { SectionLabel, Surface } from "@/shared/ui";

import { EXAMPLE, type ExampleOption } from "../model/content";
import { SectionHeading } from "./SectionHeading";

const OPTION_STYLES: Record<ExampleOption["state"], string> = {
  picked: "bg-wrong-soft ring-wrong/25",
  correct: "bg-correct-soft ring-correct/25",
  idle: "bg-surface ring-line",
};

const OPTION_TAGS: Record<ExampleOption["state"], string | null> = {
  picked: "Ваш ответ",
  correct: "Верный ответ",
  idle: null,
};

function OptionRow({ option }: { option: ExampleOption }) {
  const tag = OPTION_TAGS[option.state];

  return (
    <li className={cn("flex items-center gap-3 rounded-md px-3.5 py-3 ring-1", OPTION_STYLES[option.state])}>
      <span
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold",
          option.state === "picked" && "bg-wrong text-white",
          option.state === "correct" && "bg-correct text-white",
          option.state === "idle" && "bg-sunken text-ink-muted",
        )}
      >
        {option.state === "picked" ? <X className="size-3.5" strokeWidth={3} aria-hidden /> : null}
        {option.state === "correct" ? <Check className="size-3.5" strokeWidth={3} aria-hidden /> : null}
        {option.state === "idle" ? option.letter : null}
      </span>
      <span className="flex-1 text-[15px] text-ink">{option.text}</span>
      {tag ? (
        <span
          className={cn(
            "text-[12px] font-medium",
            option.state === "picked" ? "text-wrong" : "text-correct",
          )}
        >
          {tag}
        </span>
      ) : null}
    </li>
  );
}

export function ErrorExample() {
  return (
    <section id="example" className="flex scroll-mt-6 flex-col gap-8">
      <SectionHeading
        label="AI-разбор"
        title="Не просто «неверно», а почему"
        text="Так выглядит разбор после пробника: по каждой ошибке и на том языке, на котором вы сдаёте."
      />

      <Surface className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1fr_1fr] lg:gap-8">
        <div className="flex flex-col gap-4">
          <p className="text-[12px] text-ink-faint">{EXAMPLE.meta}</p>
          <p className="font-display text-[20px]/[1.3] font-medium tracking-[-0.3px] text-ink-strong">
            {EXAMPLE.question}
          </p>
          <ul className="flex flex-col gap-2">
            {EXAMPLE.options.map((option) => (
              <OptionRow key={option.letter} option={option} />
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-4 rounded-lg bg-sunken p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-accent-strong" aria-hidden />
            <SectionLabel tone="soft">AI-разбор</SectionLabel>
          </div>
          <div className="flex flex-col gap-3 text-[15px]/[25px] text-ink-soft">
            {EXAMPLE.explanation.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <p className="mt-auto rounded-md bg-highlight px-4 py-3 text-[14px]/[22px] font-medium text-flag">
            {EXAMPLE.tip}
          </p>
        </div>
      </Surface>
    </section>
  );
}
