import type { Metadata } from "next";

import { fetchExamConfig } from "@/entities/subject";
import { ExamSetupPage } from "@/views/exam-setup";

export const metadata: Metadata = {
  title: "Соберите свой вариант ЕНТ",
};

export default async function Page() {
  const config = await fetchExamConfig();
  return <ExamSetupPage config={config} />;
}
