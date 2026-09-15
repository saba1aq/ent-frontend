"use client";

import { useEffect } from "react";

import { captureReferralCode } from "@/shared/lib/referral";

export function ReferralCapture() {
  useEffect(() => {
    captureReferralCode();
  }, []);

  return null;
}
