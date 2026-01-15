import { Suspense } from "react";
import ResetPasswordPageClient from "./components/reset-password-client";
import { ResetPasswordLoading } from "./components/reset-password-loading";

export default function Page() {
  return (
    <Suspense fallback={<ResetPasswordLoading />}>
      <ResetPasswordPageClient />
    </Suspense>
  );
}
