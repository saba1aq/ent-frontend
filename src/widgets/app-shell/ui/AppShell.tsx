import { RequireSession } from "@/entities/session";

import { AppSidebar } from "./AppSidebar";
import { MobileTabs } from "./MobileTabs";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <RequireSession>
      <div className="flex min-h-screen">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col pb-[68px] lg:pb-0">{children}</div>
        <MobileTabs />
      </div>
    </RequireSession>
  );
}
