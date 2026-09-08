import type { Metadata } from "next";

import { routes, safeNext } from "@/shared/config/routes";
import { SignInPage } from "@/views/sign-in";

export const metadata: Metadata = { title: "Вход в кабинет" };

type PageProps = {
  searchParams: Promise<{ next?: string | string[] }>;
};

export default async function Page({ searchParams }: PageProps) {
  const { next } = await searchParams;
  return <SignInPage next={safeNext(next, routes.examSetup)} />;
}
