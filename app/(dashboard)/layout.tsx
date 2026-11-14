import React, { Suspense } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex-1 bg-[#FAF8FF] p-4 animate-pulse" />
      }
    >
      <DashboardShell>{children}</DashboardShell>
    </Suspense>
  );
}
