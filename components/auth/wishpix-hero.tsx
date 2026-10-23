import React from "react";

export function WishPixHero() {
  return (
    <div className="relative flex flex-col items-center pt-3 pb-4 sm:py-6 px-4 select-none">
      {/* Brand Title */}
      <h1 className="text-[32px] sm:text-[38px] lg:text-[44px] font-bold tracking-tight text-[#034677] leading-none mb-3 sm:mb-5">
        WishPix
      </h1>

      {/* Child & Kiosk Vector Illustration (Scales from mobile to desktop) */}
      <div className="relative w-[225px] h-[172px] sm:w-[275px] sm:h-[210px] lg:w-[330px] lg:h-[252px] flex items-center justify-center my-1">
        <svg
          viewBox="0 0 240 185"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_4px_12px_rgba(3,70,119,0.1)]"
          role="img"
          aria-label="Illustration of a child next to the WishPix Kiosk"
        >
          {/* Floor Oval Shadow */}
          <ellipse
            cx="116"
            cy="168"
            rx="88"
            ry="8.5"
            fill="#DAE6F4"
            opacity="0.88"
          />

          {/* ==================== CHILD FIGURE (LEFT) ==================== */}
          {/* Right Arm (reaching toward kiosk) */}
          <path
            d="M89 96 C102 103, 108 111, 114 108 C121 103, 129 94, 134 91 C138 89, 143 93, 139 98 C133 105, 122 117, 114 120 C107 122, 98 113, 87 106 Z"
            fill="#DF9A73"
          />

          {/* Torso / Blue Overall Suit */}
          <path
            d="M66 92 C66 85, 96 85, 96 92 L99 138 C99 144, 63 144, 63 138 Z"
            fill="#2478B4"
          />
          {/* Lighter Blue Top Bib Accent */}
          <path
            d="M67 93 C69 87, 93 87, 95 93 L98 104 C88 109, 74 109, 64 104 Z"
            fill="#4396D0"
          />
          {/* White Neck Collar */}
          <path
            d="M72 87 C76 92, 86 92, 90 87 L88 83 C84 86, 78 86, 74 83 Z"
            fill="#F6FAFE"
          />

          {/* Left Arm (bent in front) */}
          <path
            d="M66 94 C57 102, 53 113, 57 119 C60 123, 69 119, 73 111 C75 107, 70 102, 66 94 Z"
            fill="#DF9A73"
          />

          {/* Seated Crossed Legs / Knees */}
          <rect
            x="58"
            y="133"
            width="18"
            height="25"
            rx="9"
            transform="rotate(12 58 133)"
            fill="#0A4873"
          />
          <rect
            x="83"
            y="136"
            width="18"
            height="25"
            rx="9"
            transform="rotate(-14 83 136)"
            fill="#0A4873"
          />
          {/* Left & Right Shoes */}
          <rect x="52" y="155" width="22" height="12" rx="6" fill="#064B78" />
          <rect x="85" y="155" width="22" height="12" rx="6" fill="#064B78" />

          {/* Child Head */}
          <ellipse cx="81" cy="64" rx="19.5" ry="21" fill="#DF9A73" />
          {/* Child Hair (Dark Navy Swept Style) */}
          <path
            d="M61.5 62 C60 44, 73 36, 86 38 C96 40, 101 49, 100 61 C97 54, 92 49, 88 47 C82 54, 71 57, 61.5 62 Z"
            fill="#0D3C5C"
          />
          {/* Eyes */}
          <circle cx="74.5" cy="63.5" r="2" fill="#16324A" />
          <circle cx="87.5" cy="63.5" r="2" fill="#16324A" />
          {/* Smile */}
          <path
            d="M76 70.5 Q81 75.5 86 70.5"
            stroke="#7B3E26"
            strokeWidth="2.3"
            strokeLinecap="round"
            fill="none"
          />

          {/* ==================== WISHPIX KIOSK (RIGHT) ==================== */}
          {/* Kiosk Upper Body Cabinet */}
          <rect
            x="133"
            y="39"
            width="47"
            height="86"
            rx="8"
            fill="#145D91"
          />
          {/* Subtle Top Bezel Cap */}
          <path
            d="M133 47 C133 42.5, 136.5 39, 141 39 L172 39 C176.5 39, 180 42.5, 180 47 L180 52 L133 52 Z"
            fill="#2B74A7"
          />

          {/* Kiosk White Display Screen */}
          <rect
            x="140"
            y="49"
            width="33"
            height="39"
            rx="4.5"
            fill="#F7FBFF"
          />

          {/* Screen Inner Avatar Silhouette & Checkmark */}
          <circle cx="156.5" cy="57.5" r="3.2" fill="#82B1D6" />
          <path
            d="M148.5 69 C148.5 64, 164.5 64, 164.5 69 L164.5 79 L148.5 79 Z"
            fill="#C7E0F4"
          />
          {/* Bold Checkmark on Screen */}
          <path
            d="M151.5 70.5 L155.5 74.5 L163 65.5"
            stroke="#064A7A"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Kiosk Mic / Sensor Dot & Speaker Slot */}
          <circle cx="156.5" cy="94" r="1.8" fill="#B8D6EE" />
          <rect
            x="148"
            y="102"
            width="17"
            height="3.5"
            rx="1.75"
            fill="#0A3F66"
          />

          {/* 3 Small Grille Lines */}
          <rect x="150" y="109" width="13" height="2" rx="1" fill="#BDD7EE" />
          <rect x="150" y="113" width="13" height="2" rx="1" fill="#BDD7EE" />
          <rect x="150" y="117" width="13" height="2" rx="1" fill="#BDD7EE" />

          {/* Lower Pedestal / Sticker Output Stand */}
          <path
            d="M138 125 L175 125 L181 160 L132 160 Z"
            fill="#145D91"
          />
          {/* White Thermal Sticker Paper Sheet Feeding Out */}
          <path
            d="M142 125 L171 125 L175 158 L138 158 Z"
            fill="#F3F8FE"
          />
          {/* Kiosk Heavy Base Foot */}
          <rect
            x="128"
            y="157"
            width="57"
            height="9"
            rx="4.5"
            fill="#064B78"
          />
        </svg>
      </div>

      {/* Taglines */}
      <p className="text-[10px] sm:text-[11px] lg:text-[12px] font-bold tracking-[0.15em] text-[#1A73B8] uppercase text-center mt-2">
        LOCAL. SECURE. MADE FOR EDUCATORS.
      </p>
      <p className="text-[11.5px] sm:text-[13px] lg:text-[14px] text-[#607792] text-center mt-1.5 font-normal">
        Small voices. Big imagination.
      </p>
    </div>
  );
}
