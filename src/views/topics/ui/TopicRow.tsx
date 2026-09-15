import { ArrowRight, Circle, Lock } from "lucide-react";
import Link from "next/link";

import { routes } from "@/shared/config/routes";
import { cn } from "@/shared/lib/cn";
import { pluralize } from "@/shared/lib/format";

import type { DemoTopic } from "../model/demo";
import { findNote } from "../model/notes";

const MASTERY_SLOTS = [0, 1, 2, 3, 4];

export function TopicRow({ topic }: { topic: DemoTopic }) {
  const isLocked = Boolean(topic.slug) && findNote(topic.slug!)?.isFree === false;
  const content = (
    <>
      <Circle className="size-4 shrink-0 text-ink-faint" aria-hidden />
      <span className={cn("min-w-0 flex-1 truncate text-sm", topic.slug ? "text-ink" : "text-ink-soft")}>{topic.name}</span>
      <span className="hidden w-[104px] shrink-0 text-[12px] text-ink-faint sm:block">
        {topic.questionCount} {pluralize(topic.questionCount, ["задание", "задания", "заданий"])}
      </span>
      <span className="hidden shrink-0 items-center gap-[3px] md:flex">
        {MASTERY_SLOTS.map((slot) => (
          <span key={slot} className="h-1.5 w-3.5 rounded-[2px] bg-line" />
        ))}
      </span>
      <span className="w-10 shrink-0 text-right text-[12px] text-ink-faint">—</span>
      <span
        className={cn(
          "hidden w-[110px] shrink-0 items-center justify-end gap-1 text-[13px] font-medium sm:flex",
          isLocked ? "text-ink-faint" : topic.slug ? "text-accent-strong" : "text-ink-muted",
        )}
      >
        {isLocked ? (
          <>
            <Lock className="size-3.5" aria-hidden />
            По подписке
          </>
        ) : (
          <>
            {topic.slug ? "Конспект" : "Начать"}
            <ArrowRight className="size-3.5" aria-hidden />
          </>
        )}
      </span>
    </>
  );

  if (!topic.slug) {
    return <li className="flex items-center gap-4 px-4 py-3.5 sm:px-6">{content}</li>;
  }

  return (
    <li>
      <Link
        href={isLocked ? routes.billing : routes.topic(topic.slug)}
        className="press flex items-center gap-4 px-4 py-3.5 transition-colors duration-150 ease-out hover:bg-sunken sm:px-6"
      >
        {content}
      </Link>
    </li>
  );
}
