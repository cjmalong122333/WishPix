"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { StarLoader } from "@/components/layout/star-loader";

export default function LoadingScreenPage() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const stayOnPage = params.get("stay") === "1";
    const nextParam = params.get("next");
    const targetPath =
      nextParam && nextParam.startsWith("/") && !nextParam.startsWith("//")
        ? nextParam
        : "/";

    try {
      window.sessionStorage.setItem("wishpix_initial_loaded", "1");
    } catch {
      // Ignore storage errors
    }

    router.prefetch(targetPath);

    let redirectTimer: ReturnType<typeof setTimeout> | undefined;
    let hardFallbackTimer: ReturnType<typeof setTimeout> | undefined;

    if (!stayOnPage) {
      redirectTimer = setTimeout(() => {
        router.replace(targetPath);
      }, 1100);

      hardFallbackTimer = setTimeout(() => {
        if (window.location.pathname.startsWith("/loading-screen")) {
          window.location.replace(targetPath);
        }
      }, 2200);
    }

    return () => {
      if (redirectTimer) clearTimeout(redirectTimer);
      if (hardFallbackTimer) clearTimeout(hardFallbackTimer);
    };
  }, [router]);

  return (
    <StarLoader
      fullScreen
      onClick={() => {
        try {
          window.sessionStorage.setItem("wishpix_initial_loaded", "1");
        } catch {
          // Ignore storage errors
        }
        router.replace("/");
      }}
    />
  );
}
