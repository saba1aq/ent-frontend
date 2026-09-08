import type { Metadata } from "next";

import { routes, safeNext } from "@/shared/config/routes";
import { SignUpPage } from "@/views/sign-up";

export const metadata: Metadata = { title: "Регистрация" };

type PageProps = {
  searchParams: Promise<{ next?: string | string[] }>;
};

export default async function Page({ searchParams }: PageProps) {
  const { next } = await searchParams;
  return <SignUpPage next={safeNext(next, routes.examSetup)} />;
}
