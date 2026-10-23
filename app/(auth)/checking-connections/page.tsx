import React, { Suspense } from "react";
import { ConnectionCheckCard } from "@/components/auth/connection-check-card";

export default function CheckingConnectionsPage() {
  return (
    <Suspense fallback={<div className="h-[360px] rounded-[26px] bg-white/80 animate-pulse" />}>
      <ConnectionCheckCard />
    </Suspense>
  );
}
