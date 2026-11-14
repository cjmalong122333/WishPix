import React from "react";
import { PixiMascot } from "@/components/public/pixi-mascot";
import { PublicShell } from "@/components/public/public-shell";
import { RevealOnShow } from "@/components/public/reveal-on-show";

const ABOUT_PROCESS_STEPS = [
  {
    badge: "01 · SPEAK",
    description: "A child shares an idea in their own words.",
  },
  {
    badge: "02 · GENERATE",
    description: "WishPix turns speech into a prompt for AI.",
  },
  {
    badge: "03 · PRINT",
    description: "AI creates materials for learning off-screen.",
  },
];

export default function AboutPage() {
  return (
    <PublicShell footerText="A little imagination can open a whole world of learning.">
      <div className="w-full space-y-5 sm:space-y-7 lg:space-y-[clamp(18px,3.2vh,34px)]">
        {/* Top Row: About Copy Left + Pixi Lavender Card Right */}
        <section
          aria-labelledby="about-heading"
          className="grid grid-cols-1 md:grid-cols-12 items-center gap-6 sm:gap-8 lg:gap-10"
        >
          {/* Left Column */}
          <div className="md:col-span-7 flex flex-col items-center md:items-start text-center md:text-left">
            <RevealOnShow
              as="p"
              variant="fade-down"
              delayMs={40}
              className="text-[11px] sm:text-[12px] lg:text-[12.5px] font-extrabold tracking-[0.06em] text-[#6D48DF] uppercase"
            >
              ABOUT WISHPIX
            </RevealOnShow>

            <RevealOnShow
              as="h1"
              id="about-heading"
              variant="fade-up"
              delayMs={100}
              className="mt-2.5 sm:mt-3 text-[clamp(28px,4vw,50px)] font-extrabold text-[#231B3B] leading-[1.12] tracking-tight"
            >
              Their curiosity.
              <br />
              A new way to learn.
            </RevealOnShow>

            <RevealOnShow
              as="p"
              variant="fade-up"
              delayMs={160}
              className="mt-3.5 sm:mt-5 text-[clamp(14.5px,1.5vw,18.5px)] text-[#766F8E] leading-[1.6] max-w-[540px]"
            >
              Every child has a world of ideas. WishPix helps turn those spoken
              ideas into printable learning materials, connecting imagination
              with hands-on discovery.
            </RevealOnShow>
          </div>

          {/* Right Column: Soft Lavender Pixi Card */}
          <RevealOnShow
            variant="pop-scale"
            delayMs={130}
            className="md:col-span-5 flex justify-center md:justify-end w-full"
          >
            <div className="wishpix-public-card-hover w-full md:max-w-[410px] rounded-[24px] sm:rounded-[28px] bg-[#EFE9FC] px-5 sm:px-6 py-5 sm:py-6 lg:py-[clamp(18px,2.8vh,28px)] flex flex-col items-center text-center shadow-[0_8px_28px_rgba(109,72,223,0.06)]">
              <RevealOnShow variant="pop-scale" delayMs={180}>
                <PixiMascot className="w-[clamp(145px,16vw,200px)] h-[clamp(145px,16vw,200px)]" />
              </RevealOnShow>
              <RevealOnShow
                as="p"
                variant="blur-in"
                delayMs={230}
                className="mt-2.5 sm:mt-3 text-[clamp(14px,1.3vw,16px)] font-bold text-[#6D48DF]"
              >
                “What would you like to learn today?”
              </RevealOnShow>
            </div>
          </RevealOnShow>
        </section>

        {/* Bottom Row: Purple Purpose Card + White Process Card */}
        <section
          aria-label="Our purpose and process"
          className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 lg:gap-6 items-stretch"
        >
          {/* Left Solid Purple Card */}
          <RevealOnShow
            variant="slide-left"
            delayMs={220}
            className="lg:col-span-5 flex"
          >
            <div className="wishpix-public-card-hover w-full rounded-[22px] sm:rounded-[26px] bg-[#6D48DF] text-white px-6 sm:px-8 py-6 sm:py-7 lg:py-[clamp(20px,2.8vh,32px)] flex flex-col justify-center shadow-[0_10px_28px_rgba(109,72,223,0.22)]">
              <RevealOnShow
                as="p"
                variant="fade-down"
                delayMs={270}
                className="text-[10.5px] sm:text-[11.5px] font-extrabold tracking-[0.08em] text-white/90 uppercase"
              >
                OUR PURPOSE
              </RevealOnShow>

              <RevealOnShow
                as="h2"
                variant="fade-up"
                delayMs={320}
                className="mt-2 text-[clamp(22px,2.3vw,29px)] font-extrabold text-white leading-[1.2] tracking-tight"
              >
                More wonder.
                <br />
                More ways to learn.
              </RevealOnShow>

              <RevealOnShow
                as="p"
                variant="blur-in"
                delayMs={370}
                className="mt-3 text-[13.5px] sm:text-[14.5px] lg:text-[15px] font-medium text-white/90"
              >
                Let children&apos;s interests lead the way.
              </RevealOnShow>
            </div>
          </RevealOnShow>

          {/* Right White Process Card */}
          <RevealOnShow
            variant="slide-right"
            delayMs={270}
            className="lg:col-span-7 flex"
          >
            <div className="wishpix-public-card-hover w-full rounded-[22px] sm:rounded-[26px] bg-white border border-[#F2EEFB] shadow-[0_6px_24px_rgba(109,72,223,0.04)] px-6 sm:px-8 lg:px-9 py-6 sm:py-7 lg:py-[clamp(20px,2.8vh,32px)] flex flex-col justify-center">
              <RevealOnShow
                as="h2"
                variant="fade-up"
                delayMs={320}
                className="text-[clamp(18px,1.9vw,23px)] font-extrabold text-[#231B3B] tracking-tight"
              >
                From a spoken wish to a printed page
              </RevealOnShow>

              <div className="mt-4 sm:mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                {ABOUT_PROCESS_STEPS.map((item, index) => {
                  const stepDelay = 360 + index * 65;
                  return (
                    <div key={item.badge}>
                      <RevealOnShow
                        as="p"
                        variant="pop-scale"
                        delayMs={stepDelay}
                        className="text-[11px] sm:text-[12px] font-extrabold tracking-[0.04em] text-[#6D48DF] uppercase"
                      >
                        {item.badge}
                      </RevealOnShow>
                      <RevealOnShow
                        as="p"
                        variant="blur-in"
                        delayMs={stepDelay + 35}
                        className="mt-1.5 sm:mt-2 text-[13px] sm:text-[13.5px] lg:text-[14px] text-[#766F8E] leading-relaxed"
                      >
                        {item.description}
                      </RevealOnShow>
                    </div>
                  );
                })}
              </div>
            </div>
          </RevealOnShow>
        </section>
      </div>
    </PublicShell>
  );
}
