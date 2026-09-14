import type { Metadata } from "next";

import { TopicsPage } from "@/views/topics";

export const metadata: Metadata = {
  title: "Задания по темам",
};

export default function Page() {
  return <TopicsPage />;
}
