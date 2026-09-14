"use client";

import { Pause, Play } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/shared/lib/cn";
import { SectionLabel } from "@/shared/ui";

type Chapter = {
  at: number;
  title: string;
  text: string;
};

const CHAPTERS: Chapter[] = [
  {
    at: 4.5,
    title: "Собираете вариант",
    text: "Три обязательных предмета уже внутри. Выбираете пару профильных, язык сдачи и регистрируетесь по номеру.",
  },
  {
    at: 24.3,
    title: "Решаете как на ЕНТ",
    text: "120 вопросов, 4 часа, без паузы. Ответы сохраняются сами, к отмеченным можно вернуться.",
  },
  {
    at: 32.2,
    title: "Получаете баллы и разбор",
    text: "Сразу после сдачи — балл по каждому блоку, карта ответов и объяснение к каждой ошибке.",
  },
  {
    at: 40.5,
    title: "Держите ритм",
    text: "Конспекты по темам, рейтинг среди тех, кто готовится, и серия дней, которая сгорает при пропуске.",
  },
];

const START_AT = CHAPTERS[0].at;

export function ProductTour() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const pausedByUserRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) {
          return;
        }
        if (!entry.isIntersecting) {
          video.pause();
          return;
        }
        if (pausedByUserRef.current) {
          return;
        }
        const startPlayback = () => {
          video
            .play()
            .then(() => setIsPlaying(true))
            .catch(() => undefined);
        };
        if (video.currentTime < START_AT) {
          video.addEventListener("seeked", startPlayback, { once: true });
          video.currentTime = START_AT;
          return;
        }
        startPlayback();
      },
      { threshold: 0.35 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const syncChapter = useCallback((second: number) => {
    const index = CHAPTERS.reduce((current, chapter, chapterIndex) => (second >= chapter.at ? chapterIndex : current), 0);
    setActiveIndex(index);
  }, []);

  const goTo = (index: number) => {
    const video = videoRef.current;
    if (!video) {
      return;
    }
    video.currentTime = CHAPTERS[index].at;
    setActiveIndex(index);
    pausedByUserRef.current = false;
    void video.play();
  };

  const toggle = () => {
    const video = videoRef.current;
    if (!video) {
      return;
    }
    if (video.paused) {
      pausedByUserRef.current = false;
      void video.play();
    } else {
      pausedByUserRef.current = true;
      video.pause();
    }
  };

  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <SectionLabel as="h2">Как это работает</SectionLabel>
        <p className="max-w-[560px] text-[15px]/[24px] text-ink-muted">
          Запись настоящего продукта — от регистрации до разбора ошибок. Нажмите на шаг, чтобы перейти к нему.
        </p>
      </div>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
        <div className="relative min-w-0 flex-1 overflow-hidden rounded-xl bg-sunken shadow-card ring-1 ring-line">
          <video
            ref={videoRef}
            src="/upstudy-demo.mp4"
            poster="/upstudy-demo-poster.jpg"
            autoPlay
            muted
            playsInline
            preload="metadata"
            className="w-full"
            onEnded={(event) => {
              const video = event.currentTarget;
              video.currentTime = START_AT;
              void video.play();
            }}
            onTimeUpdate={(event) => {
              const video = event.currentTarget;
              syncChapter(video.currentTime);
              setProgress(video.duration ? video.currentTime / video.duration : 0);
            }}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
          <button
            type="button"
            onClick={toggle}
            aria-label={isPlaying ? "Пауза" : "Смотреть"}
            className="press absolute bottom-4 left-4 flex size-10 cursor-pointer items-center justify-center rounded-full bg-surface/90 text-ink-strong shadow-card backdrop-blur"
          >
            {isPlaying ? <Pause className="size-4" aria-hidden /> : <Play className="size-4" aria-hidden />}
          </button>
          <span aria-hidden className="absolute inset-x-0 bottom-0 h-[3px] bg-line">
            <span className="block h-full bg-accent" style={{ width: `${progress * 100}%` }} />
          </span>
        </div>

        <ol className="flex w-full shrink-0 flex-col gap-1 lg:w-[360px]">
          {CHAPTERS.map((chapter, index) => {
            const isActive = index === activeIndex;
            return (
              <li key={chapter.title}>
                <button
                  type="button"
                  onClick={() => goTo(index)}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "press relative flex w-full cursor-pointer flex-col gap-1 rounded-md px-4 py-3.5 text-left transition-colors duration-150 ease-out",
                    isActive ? "bg-sunken" : "hover:bg-sunken/60",
                  )}
                >
                  {isActive ? (
                    <span aria-hidden className="absolute top-3 bottom-3 left-0 w-[3px] rounded-full bg-accent" />
                  ) : null}
                  <span className="flex items-baseline gap-2.5">
                    <span className={cn("text-[11px] font-semibold", isActive ? "text-accent-strong" : "text-ink-faint")}>
                      0{index + 1}
                    </span>
                    <span
                      className={cn(
                        "font-display text-[16px] tracking-[-0.2px]",
                        isActive ? "font-medium text-ink-strong" : "text-ink-soft",
                      )}
                    >
                      {chapter.title}
                    </span>
                  </span>
                  <span className={cn("text-[13px]/[20px]", isActive ? "text-ink-muted" : "text-ink-faint")}>
                    {chapter.text}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
