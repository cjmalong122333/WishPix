import React from "react";
import { WishPixHero } from "@/components/auth/wishpix-hero";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex-1 min-h-screen w-full flex flex-col justify-between bg-gradient-to-b from-[#C7D6E8] via-[#A6BEDB] to-[#8AA6C7] overflow-hidden">
      {/* Decorative Curved Arcs in Top-Right (Responsive from mobile to desktop) */}
      <svg
        viewBox="0 0 600 540"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="pointer-events-none absolute top-0 right-0 w-[340px] sm:w-[480px] lg:w-[680px] h-auto"
      >
        <path
          d="M180 -30 C230 210, 360 355, 620 420 L620 -30 Z"
          fill="white"
          fillOpacity="0.22"
        />
        <path
          d="M295 -30 C330 145, 425 260, 620 305 L620 -30 Z"
          fill="#BACCE2"
          fillOpacity="0.45"
        />
      </svg>

      {/* Responsive Content Container: Stacked on Mobile/Tablet, Split 2-Column on Desktop */}
      <div className="relative z-10 flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-10 lg:py-14 flex flex-col lg:grid lg:grid-cols-12 lg:items-center lg:gap-12 justify-center">
        {/* Left / Top Column: WishPix Hero & Illustration */}
        <div className="w-full lg:col-span-6 flex flex-col items-center justify-center">
          <WishPixHero />
        </div>

        {/* Right / Bottom Column: White Card (Login or Checking Connections) */}
        <main className="w-full max-w-[440px] lg:max-w-[470px] mx-auto lg:col-span-6 mt-2 sm:mt-4 lg:mt-0">
          {children}
        </main>
      </div>

      {/* Subtle Bottom Accent Bar matching mockup */}
      <div
        aria-hidden="true"
        className="h-4 sm:h-5 w-full bg-gradient-to-b from-[#96AAC2]/60 to-[#9CA3AF]/85 shrink-0"
      />
    </div>
  );
}
