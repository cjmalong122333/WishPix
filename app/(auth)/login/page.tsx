import React, { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { StarLoader } from "@/components/layout/star-loader";
import { PixiMascot } from "@/components/public/pixi-mascot";
import { PublicShell } from "@/components/public/public-shell";

export default function LoginPage() {
  return (
    <PublicShell footerText="A little support from you. A world of discovery for them.">
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 items-stretch">
        {/* Left Card: Welcome to Your Imagination Station + Pixi */}
        <section
          aria-labelledby="login-welcome-heading"
          className="lg:col-span-6 rounded-[24px] sm:rounded-[28px] bg-[#EFE9FC] px-6 sm:px-9 lg:px-10 py-6 sm:py-8 lg:py-[clamp(22px,3.2vh,38px)] flex flex-col justify-between shadow-[0_8px_28px_rgba(109,72,223,0.05)]"
        >
          <div className="text-center sm:text-left">
            <p className="text-[10.5px] sm:text-[11.5px] lg:text-[12px] font-extrabold tracking-[0.06em] text-[#6D48DF] uppercase">
              WELCOME TO YOUR IMAGINATION STATION
            </p>

            <h1
              id="login-welcome-heading"
              className="mt-2.5 sm:mt-3 text-[clamp(25px,3vw,37px)] font-extrabold text-[#231B3B] leading-[1.15] tracking-tight"
            >
              A little idea.
              <br />
              A whole new adventure.
            </h1>

            <p className="mt-2.5 sm:mt-3.5 text-[clamp(14px,1.4vw,17px)] text-[#766F8E] leading-[1.55]">
              Help your child turn spoken ideas
              <br className="hidden sm:inline" /> into hands-on learning.
            </p>
          </div>

          <div className="my-3 sm:my-4 flex items-center justify-center">
            <PixiMascot className="w-[clamp(140px,16vw,200px)] h-[clamp(140px,16vw,200px)]" />
          </div>

          <p className="text-center text-[14px] sm:text-[15.5px] lg:text-[16px] font-bold text-[#6D48DF]">
            Pixi is ready when you are.
          </p>
        </section>

        {/* Right Card: Log in Form */}
        <div className="lg:col-span-6 flex">
          <Suspense fallback={<StarLoader fullScreen={false} />}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </PublicShell>
  );
}
