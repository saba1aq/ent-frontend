"use client";

import type { ExamConfig } from "@/entities/subject";
import { UI_LANGUAGE } from "@/shared/config/language";
import { SectionLabel } from "@/shared/ui";

import { PROFILE_SUBJECT_SLOTS } from "../model/exam-totals";
import { EXAM_SETUP_TEXTS } from "../model/i18n";
import { useExamSetup } from "../model/use-exam-setup";
import { useStartExam } from "../model/use-start-exam";
import { ExamTimeline } from "./ExamTimeline";
import { LanguageSwitch } from "./LanguageSwitch";
import { ProfileSubjectCard } from "./ProfileSubjectCard";
import { RequiredSubjectCard } from "./RequiredSubjectCard";
import { SummaryPanel } from "./SummaryPanel";

type ExamSetupPageProps = {
  config: ExamConfig;
};

export function ExamSetupPage({ config }: ExamSetupPageProps) {
  const {
    testLanguage,
    setTestLanguage,
    requiredSubjects,
    profileSubjects,
    selectedSubjects,
    availability,
    toggleSubject,
    totals,
    emptySlotCount,
    isReady,
  } = useExamSetup(config);

  const texts = EXAM_SETUP_TEXTS[UI_LANGUAGE];
  const { start, isStarting, error: startError } = useStartExam(
    testLanguage,
    selectedSubjects.map((subject) => subject.code),
  );

  const buildSlotLabels = (template: string) =>
    Array.from({ length: emptySlotCount }, (_, index) =>
      template.replace("{n}", String(selectedSubjects.length + index + 1)),
    );

  return (
    <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-5 py-6 lg:flex-row lg:items-start lg:gap-8 lg:px-10 lg:py-8">
      <div className="flex min-w-0 flex-1 flex-col gap-7">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between sm:gap-10">
          <h1 className="font-display text-[28px]/[1.1] font-medium tracking-[-0.8px] text-ink lg:text-[34px]/[1.08]">
            {texts.title}
          </h1>
          <LanguageSwitch value={testLanguage} label={texts.examLanguage} onChange={setTestLanguage} />
        </header>

        <section className="flex flex-col gap-3">
          <SectionLabel as="h2">{texts.requiredSectionLabel}</SectionLabel>
          <div className="grid gap-3 sm:grid-cols-3">
            {requiredSubjects.map((subject) => (
              <RequiredSubjectCard key={subject.code} subject={subject} uiLanguage={UI_LANGUAGE} />
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between gap-3">
            <SectionLabel as="h2">{texts.profileSectionLabel}</SectionLabel>
            <SectionLabel as="span">
              {selectedSubjects.length} / {PROFILE_SUBJECT_SLOTS}
            </SectionLabel>
          </div>
          <div className="stagger grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {profileSubjects.map((subject) => (
              <ProfileSubjectCard
                key={subject.code}
                subject={subject}
                uiLanguage={UI_LANGUAGE}
                availability={availability.get(subject.code) ?? "available"}
                onToggle={toggleSubject}
              />
            ))}
          </div>
        </section>

        <ExamTimeline
          uiLanguage={UI_LANGUAGE}
          requiredSubjects={requiredSubjects}
          selectedSubjects={selectedSubjects}
          emptySlotLabels={buildSlotLabels(texts.emptySlotLabel)}
          emptySlotMinutes={totals.emptySlotMinutes}
        />
      </div>

      <SummaryPanel
        uiLanguage={UI_LANGUAGE}
        testLanguage={testLanguage}
        texts={texts}
        totals={totals}
        requiredSubjects={requiredSubjects}
        selectedSubjects={selectedSubjects}
        emptySlotSummaries={buildSlotLabels(texts.emptySlotSummary)}
        isReady={isReady}
        isStarting={isStarting}
        startError={startError}
        onStart={start}
      />
    </main>
  );
}
