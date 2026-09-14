import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { findNote, TOPIC_NOTES } from "@/views/topics";
import { TopicNotePage } from "@/views/topic-note";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return TOPIC_NOTES.map((note) => ({ slug: note.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return { title: findNote(slug)?.name ?? "Конспект" };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const note = findNote(slug);
  if (!note) {
    notFound();
  }
  return <TopicNotePage note={note} />;
}
