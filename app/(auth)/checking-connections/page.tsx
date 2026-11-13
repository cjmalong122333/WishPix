import React, { Suspense } from "react";
import { ConnectionCheckCard } from "@/components/auth/connection-check-card";
import { StarLoader } from "@/components/layout/star-loader";

export default function CheckingConnectionsPage() {
  return (
    <div className="min-h-screen w-full bg-[#FAF8FF] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-[440px]">
        <Suspense fallback={<StarLoader fullScreen={false} />}>
          <ConnectionCheckCard />
        </Suspense>
      </div>
    </div>
  );
}
