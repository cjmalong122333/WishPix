import React from "react";
import { WandSparkles } from "lucide-react";
import { WishPixHero } from "@/components/auth/wishpix-hero";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex-1 min-h-screen w-full flex flex-col justify-center bg-gradient-to-b from-[#C7D6EB] via-[#A9BCD4] to-[#8F969E] overflow-x-hidden">
      {/* Responsive Container: Stacked on Mobile/Tablet, Split 2-Column on Desktop (lg+) */}
      <div className="relative z-10 flex-1 w-full max-w-[440px] sm:max-w-[480px] lg:max-w-5xl mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12 flex flex-col lg:grid lg:grid-cols-12 lg:items-center lg:gap-12 justify-center">
        {/* Left Column on Desktop / Top on Mobile: Hero & Illustration */}
        <div className="w-full lg:col-span-6 flex flex-col items-center justify-center">
          <WishPixHero />

          {/* Desktop Brand Footer under Hero */}
          <div className="hidden lg:flex mt-6 items-center justify-center gap-2 select-none">
            <span className="w-5 h-5 rounded-[5px] bg-[#0B1F35] text-[#38BDF8] flex items-center justify-center shadow-xs">
              <WandSparkles className="w-3 h-3 stroke-[2.5]" aria-hidden="true" />
            </span>
            <span className="text-[13.5px] font-bold text-[#0077C8] tracking-tight">
              WishPix
            </span>
          </div>
        </div>

        {/* Right Column on Desktop / Bottom on Mobile: Dark Navy Card */}
        <div className="w-full max-w-[420px] lg:max-w-[450px] mx-auto lg:col-span-6 mt-4 sm:mt-5 lg:mt-0 flex flex-col items-center">
          <main className="w-full">{children}</main>

          {/* Mobile/Tablet Brand Mark below Card */}
          <div className="mt-4 flex lg:hidden items-center justify-center gap-1.5 select-none">
            <span className="w-4 h-4 rounded-[4px] bg-[#0B1F35] text-[#38BDF8] flex items-center justify-center shadow-xs">
              <WandSparkles
                className="w-2.5 h-2.5 stroke-[2.5]"
                aria-hidden="true"
              />
            </span>
            <span className="text-[12px] font-bold text-[#0077C8] tracking-tight">
              WishPix
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
