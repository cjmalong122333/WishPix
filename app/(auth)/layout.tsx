import React, { Suspense } from "react";
import { StarLoader } from "@/components/layout/star-loader";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<StarLoader fullScreen />}>
      {children}
    </Suspense>
  );
}
