"use client";

import { Suspense } from "react";
import VerifyEmailPage from "./verifyEmailClient";

export default function PageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailPage />
    </Suspense>
  );
}
