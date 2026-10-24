import React, { Suspense } from "react";
import { ConnectionCheckCard } from "@/components/auth/connection-check-card";

export default function CheckingConnectionsPage() {
  return (
    <Suspense
      fallback={
        <div className="h-[310px] rounded-[16px] bg-[#162F4D]/80 animate-pulse" />
      }
    >
      <ConnectionCheckCard />
    </Suspense>
  );
}
