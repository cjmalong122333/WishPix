import React from "react";
import { PublicShell } from "@/components/public/public-shell";
import { RevealOnShow } from "@/components/public/reveal-on-show";

const TEAM_PILLARS = [
  {
    number: "01",
    category: "Learning & education",
    title: "Make every idea\na learning moment.",
    description:
      "Keep curiosity at the centre of activities that children can explore, colour, and learn from.",
  },
  {
    number: "02",
    category: "AI & engineering",
    title: "Turn little voices\ninto possibilities.",
    description:
      "Connect spoken ideas with generative AI to create printable materials for hands-on discovery.",
  },
  {
    number: "03",
    category: "Design & experience",
    title: "Make creating\nfeel like play.",
    description:
      "Shape a friendly experience that helps children and grown-ups move from an idea to a printed page.",
  },
];

export default function TeamPage() {
  return (
    <PublicShell footerText="Thoughtful technology. Playful learning. Endless imagination.">
      <div className="w-full space-y-5 sm:space-y-7 lg:space-y-[clamp(18px,3.2vh,34px)]">
        {/* Top Centered Heading */}
        <section
          aria-labelledby="team-heading"
          className="text-center max-w-2xl mx-auto px-2"
        >
          <RevealOnShow
            as="p"
            variant="fade-down"
            delayMs={40}
            className="text-[11px] sm:text-[12px] lg:text-[12.5px] font-extrabold tracking-[0.06em] text-[#6D48DF] uppercase"
          >
            THE HEART OF WISHPIX
          </RevealOnShow>

          <RevealOnShow
            as="h1"
            id="team-heading"
            variant="fade-up"
            delayMs={100}
            className="mt-2 sm:mt-2.5 text-[clamp(26px,3.8vw,48px)] font-extrabold text-[#231B3B] leading-[1.14] tracking-tight"
          >
            Big ideas take a little teamwork.
          </RevealOnShow>

          <RevealOnShow
            as="p"
            variant="fade-up"
            delayMs={160}
            className="mt-2.5 sm:mt-3.5 text-[clamp(14px,1.45vw,18px)] text-[#766F8E] leading-[1.55]"
          >
            Bringing learning, technology, and design together—
            <br className="hidden sm:inline" />
            with children’s curiosity at the centre.
          </RevealOnShow>
        </section>

        {/* Three Pillar Cards */}
        <section
          aria-label="Team pillars"
          className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 items-stretch"
        >
          {TEAM_PILLARS.map((pillar, index) => {
            const cardDelay = 210 + index * 75;
            return (
              <RevealOnShow
                key={pillar.number}
                variant="fade-up"
                delayMs={cardDelay}
                className="flex"
              >
                <div className="wishpix-public-card-hover w-full rounded-[22px] sm:rounded-[26px] bg-white border border-[#F2EEFB] shadow-[0_6px_24px_rgba(109,72,223,0.04)] px-5 sm:px-7 py-6 sm:py-7 lg:py-[clamp(20px,3vh,32px)] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-[#6D48DF]">
                      <RevealOnShow
                        as="span"
                        variant="pop-scale"
                        delayMs={cardDelay + 40}
                        className="text-[14.5px] sm:text-[16px] font-extrabold"
                      >
                        {pillar.number}
                      </RevealOnShow>
                      <RevealOnShow
                        as="span"
                        variant="slide-right"
                        delayMs={cardDelay + 65}
                        className="text-[13px] sm:text-[14.5px] font-bold"
                      >
                        {pillar.category}
                      </RevealOnShow>
                    </div>

                    <RevealOnShow
                      as="h2"
                      variant="fade-up"
                      delayMs={cardDelay + 95}
                      className="mt-4 sm:mt-5 text-[clamp(19px,1.9vw,23.5px)] font-extrabold text-[#231B3B] leading-[1.25] tracking-tight whitespace-pre-line"
                    >
                      {pillar.title}
                    </RevealOnShow>

                    <RevealOnShow
                      as="p"
                      variant="blur-in"
                      delayMs={cardDelay + 125}
                      className="mt-3 sm:mt-4 text-[13px] sm:text-[14px] lg:text-[14.5px] text-[#766F8E] leading-[1.6]"
                    >
                      {pillar.description}
                    </RevealOnShow>
                  </div>
                </div>
              </RevealOnShow>
            );
          })}
        </section>

        {/* Bottom Shared Purpose Banner */}
        <RevealOnShow variant="pop-scale" delayMs={440}>
          <div className="wishpix-public-card-hover w-full rounded-[18px] sm:rounded-[20px] bg-[#EFE9FC] px-4 sm:px-6 py-3.5 sm:py-4 lg:py-[clamp(14px,2vh,20px)] text-center">
            <RevealOnShow
              as="p"
              variant="blur-in"
              delayMs={480}
              className="text-[13.5px] sm:text-[15px] lg:text-[16px] font-bold text-[#6D48DF]"
            >
              One shared purpose: help every little voice spark a new discovery.
            </RevealOnShow>
          </div>
        </RevealOnShow>
      </div>
    </PublicShell>
  );
}
