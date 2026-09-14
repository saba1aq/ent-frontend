import { AppShell } from "@/widgets/app-shell";

export default function Layout(props: LayoutProps<"/exam/[attemptId]/results">) {
  return <AppShell>{props.children}</AppShell>;
}
