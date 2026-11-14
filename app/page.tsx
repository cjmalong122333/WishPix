import React from "react";
import { PixiMascot } from "@/components/public/pixi-mascot";
import { PublicShell } from "@/components/public/public-shell";
import { RevealOnShow } from "@/components/public/reveal-on-show";

const HOME_STEPS = [
  {
    number: "01",
    title: "Say it",
    description: "Tell Pixi what you want to learn about.",
  },
  {
    number: "02",
    title: "Create it",
    description: "AI turns your words into learning materials.",
  },
  {
    number: "03",
    title: "Print it",
    description: "Bring your creation to life, one page at a time.",
  },
];

export default function HomePage() {
  return (
    <PublicShell footerText="Made for curious children and the grown-ups who help them learn.">
      <div className="w-full space-y-6 sm:space-y-8 lg:space-y-[clamp(20px,3.6vh,40px)]">
        {/* Hero Section */}
        <section
          aria-labelledby="home-hero-heading"
          className="grid grid-cols-1 md:grid-cols-12 items-center gap-6 sm:gap-8 lg:gap-10"
        >
          {/* Left Column: Pixi Mascot in Soft Lavender Circle */}
          <div className="md:col-span-5 flex flex-col items-center text-center">
            <RevealOnShow variant="pop-scale" delayMs={40}>
              <div className="wishpix-public-card-hover w-[clamp(185px,44vw,240px)] h-[clamp(185px,44vw,240px)] md:w-[clamp(210px,24vw,290px)] md:h-[clamp(210px,24vw,290px)] rounded-full bg-[#EFE9FC] flex items-center justify-center p-5 sm:p-6 shadow-[0_8px_30px_rgba(109,72,223,0.06)]">
                <PixiMascot className="w-[82%] h-[82%]" />
              </div>
            </RevealOnShow>

            <RevealOnShow
              as="h2"
              variant="fade-up"
              delayMs={100}
              className="mt-3 sm:mt-4 text-[clamp(22px,2.4vw,31px)] font-extrabold text-[#231B3B] tracking-tight leading-tight"
            >
              Hi! I’m Pixi!
            </RevealOnShow>

            <RevealOnShow
              as="p"
              variant="blur-in"
              delayMs={150}
              className="mt-1 text-[clamp(13.5px,1.3vw,16.5px)] font-semibold text-[#7A7393]"
            >
              Your WishPix Companion!
            </RevealOnShow>
          </div>

          {/* Right Column: Headline & Value Proposition */}
          <div className="md:col-span-7 flex flex-col items-center md:items-start text-center md:text-left">
            <RevealOnShow
              as="p"
              variant="fade-down"
              delayMs={70}
              className="text-[11px] sm:text-[12px] lg:text-[12.5px] font-extrabold tracking-[0.06em] text-[#6D48DF] uppercase"
            >
              BIG IMAGINATIONS. LITTLE LEARNERS.
            </RevealOnShow>

            <RevealOnShow
              as="h1"
              id="home-hero-heading"
              variant="fade-up"
              delayMs={130}
              className="mt-2.5 sm:mt-3 text-[clamp(28px,4.2vw,52px)] font-extrabold text-[#231B3B] leading-[1.12] tracking-tight"
            >
              Big ideas start
              <br />
              with a little voice.
            </RevealOnShow>

            <RevealOnShow
              as="p"
              variant="fade-up"
              delayMs={190}
              className="mt-3.5 sm:mt-5 text-[clamp(14.5px,1.5vw,18.5px)] text-[#766F8E] leading-[1.6] max-w-[540px]"
            >
              Children speak their ideas. WishPix turns their words into AI
              prompts and creates printable learning materials—ready to
              explore, colour, and learn.
            </RevealOnShow>

            <RevealOnShow
              as="p"
              variant="blur-in"
              delayMs={250}
              className="mt-4 sm:mt-6 text-[13px] sm:text-[14px] lg:text-[14.5px] font-medium text-[#766F8E]"
            >
              Speak an idea. See what grows.
            </RevealOnShow>
          </div>
        </section>

        {/* Bottom 3-Step Row */}
        <section aria-labelledby="home-steps-heading" className="pt-1">
          <RevealOnShow
            as="h2"
            id="home-steps-heading"
            variant="fade-up"
            delayMs={290}
            className="text-[clamp(18px,2vw,23px)] font-extrabold text-[#231B3B] tracking-tight mb-3 sm:mb-4 text-center md:text-left"
          >
            A little voice. A world of learning.
          </RevealOnShow>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 lg:gap-5">
            {HOME_STEPS.map((step, index) => {
              const cardDelay = 340 + index * 70;
              return (
                <RevealOnShow
                  key={step.number}
                  variant="fade-up"
                  delayMs={cardDelay}
                  className={index === 2 ? "sm:col-span-2 lg:col-span-1" : ""}
                >
                  <div className="group wishpix-public-card-hover h-full rounded-[20px] sm:rounded-[22px] bg-white border border-[#F2EEFB] shadow-[0_4px_20px_rgba(109,72,223,0.04)] px-5 sm:px-6 py-4 sm:py-5 lg:py-[clamp(16px,2.2vh,24px)] flex items-start gap-3.5 sm:gap-4">
                    <RevealOnShow
                      as="span"
                      variant="pop-scale"
                      delayMs={cardDelay + 35}
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#EDE7FC] text-[#6D48DF] text-[12.5px] sm:text-[13.5px] font-extrabold flex items-center justify-center shrink-0 mt-0.5 transition-transform duration-300 group-hover:scale-110"
                    >
                      {step.number}
                    </RevealOnShow>

                    <div className="min-w-0">
                      <RevealOnShow
                        as="h3"
                        variant="fade-up"
                        delayMs={cardDelay + 60}
                        className="text-[16px] sm:text-[17px] lg:text-[18px] font-extrabold text-[#231B3B] leading-snug"
                      >
                        {step.title}
                      </RevealOnShow>
                      <RevealOnShow
                        as="p"
                        variant="blur-in"
                        delayMs={cardDelay + 90}
                        className="mt-1 sm:mt-1.5 text-[13px] sm:text-[13.5px] lg:text-[14px] text-[#766F8E] leading-relaxed"
                      >
                        {step.description}
                      </RevealOnShow>
                    </div>
                  </div>
                </RevealOnShow>
              );
            })}
          </div>
        </section>
      </div>
    </PublicShell>
  );
}
