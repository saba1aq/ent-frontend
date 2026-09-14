import { RedirectWhenSignedIn } from "@/entities/session";
import { routes } from "@/shared/config/routes";
import { LandingPage } from "@/views/landing";

export default function Page() {
  return (
    <>
      <RedirectWhenSignedIn to={routes.exams} />
      <LandingPage />
    </>
  );
}
