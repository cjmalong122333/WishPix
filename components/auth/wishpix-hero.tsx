import React from "react";

export function WishPixHero() {
  return (
    <div className="flex flex-col items-center text-center select-none">
      {/* Top Overline */}
      <p className="text-[9.5px] sm:text-[11px] lg:text-[12px] font-bold tracking-[0.16em] text-[#155E95] uppercase mb-3.5 lg:mb-5">
        LOCAL. SECURE. MADE FOR TEACHERS.
      </p>

      {/* Dark Rounded Square Badge with Teacher & Classroom Kiosk Illustration */}
      <div className="w-[104px] h-[96px] sm:w-[120px] sm:h-[110px] lg:w-[152px] lg:h-[140px] rounded-[16px] lg:rounded-[22px] bg-[#0B1F35] shadow-[0_12px_28px_rgba(9,30,54,0.28)] border border-white/10 flex items-center justify-center p-2.5 lg:p-3.5">
        <svg
          viewBox="0 0 120 108"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          role="img"
          aria-label="Illustration of a teacher presenting beside a WishPix interactive display"
        >
          {/* ==================== INTERACTIVE MONITOR (RIGHT) ==================== */}
          <rect
            x="57"
            y="28"
            width="43"
            height="30"
            rx="2.5"
            fill="#1E3A5F"
            stroke="#38BDF8"
            strokeWidth="1.2"
          />
          <rect x="59.5" y="30.5" width="38" height="24" rx="1.5" fill="#E0F2FE" />

          {/* Left Video Tile on Monitor */}
          <rect x="61.5" y="32.5" width="15" height="20" rx="1.5" fill="#7DD3FC" />
          <circle cx="69" cy="39" r="3.2" fill="#9A3412" />
          <path
            d="M64 49 C64 44.5, 74 44.5, 74 49 L74 52.5 L64 52.5 Z"
            fill="#0284C7"
          />

          {/* 4 Small Student Tiles on Right of Monitor */}
          <rect x="78.5" y="32.5" width="8" height="9" rx="1" fill="#FDE68A" />
          <circle cx="82.5" cy="36.5" r="2" fill="#D97706" />
          <rect x="88" y="32.5" width="8" height="9" rx="1" fill="#FECDD3" />
          <circle cx="92" cy="36.5" r="2" fill="#E11D48" />
          <rect x="78.5" y="43.5" width="8" height="9" rx="1" fill="#BBF7D0" />
          <circle cx="82.5" cy="47.5" r="2" fill="#15803D" />
          <rect x="88" y="43.5" width="8" height="9" rx="1" fill="#DDD6FE" />
          <circle cx="92" cy="47.5" r="2" fill="#6D28D9" />

          {/* Monitor Stand */}
          <rect x="75.5" y="58" width="6" height="4.5" fill="#475569" />
          <rect x="69" y="62" width="19" height="2" rx="1" fill="#64748B" />

          {/* ==================== TEACHER DESK (LOWER RIGHT) ==================== */}
          <rect x="53" y="64" width="50" height="4" rx="1.5" fill="#5EEAD4" />
          <rect x="56" y="68" width="44" height="5.5" fill="#2DD4BF" />
          <rect x="57" y="73.5" width="2.8" height="23.5" fill="#5EEAD4" />
          <rect x="96" y="73.5" width="2.8" height="23.5" fill="#5EEAD4" />

          {/* ==================== TEACHER FIGURE (LEFT) ==================== */}
          <circle cx="38" cy="14.5" r="5" fill="#6B3410" />
          <path
            d="M30 23 C30 16, 48 16, 48 23 C48 27, 46 31, 39 31 C32 31, 30 27, 30 23 Z"
            fill="#78350F"
          />
          <ellipse cx="39.5" cy="26" rx="7.2" ry="7.8" fill="#FDBA8C" />
          <path
            d="M32 23.5 C33.5 17.5, 44.5 17.5, 46.8 23 C43 20.5, 36.5 20.5, 32 23.5 Z"
            fill="#78350F"
          />
          <circle cx="37" cy="25.8" r="1" fill="#1E293B" />
          <circle cx="42" cy="25.8" r="1" fill="#1E293B" />
          <path
            d="M37.5 29 Q39.5 31 41.5 29"
            stroke="#9A3412"
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
          />

          <rect x="37.2" y="33" width="4.6" height="4.5" rx="2" fill="#FDBA8C" />
          <path d="M33 37 L46 37 L45 58 L34 58 Z" fill="#99F6E4" />
          <path d="M36.5 38.5 L42.5 38.5 L39.5 43 Z" fill="#2DD4BF" />

          <path
            d="M29 38.5 C29 37, 33 36.5, 35.5 37 L36.5 59 L28.5 59 Z"
            fill="#0284C7"
          />
          <path
            d="M43.5 37 C46 36.5, 49.5 37, 49.5 38.5 L50 59 L42.5 59 Z"
            fill="#0284C7"
          />

          <path
            d="M29.5 38.5 L24.5 57.5 L28.2 58.5 L32 41 Z"
            fill="#0284C7"
          />
          <circle cx="25.8" cy="59.5" r="2.2" fill="#FDBA8C" />

          <path
            d="M48 39 L57 46 L55 49.5 L46.5 43.5 Z"
            fill="#0284C7"
          />
          <circle cx="57.5" cy="46.5" r="2.2" fill="#FDBA8C" />

          <path
            d="M30.5 58 L48 58 L46.5 92 L41 92 L39.2 68 L37.5 92 L32 92 Z"
            fill="#0F766E"
          />

          <ellipse cx="34.2" cy="94.5" rx="3.5" ry="1.8" fill="#FDBA8C" />
          <ellipse cx="44.2" cy="94.5" rx="3.5" ry="1.8" fill="#FDBA8C" />
        </svg>
      </div>

      {/* Main Blue Title */}
      <h1 className="mt-3.5 lg:mt-5 text-[20px] sm:text-[24px] lg:text-[30px] font-extrabold tracking-tight text-[#0077C8] leading-[1.2]">
        Welcome to the WishPix
        <br />
        Teacher App
      </h1>

      {/* Subtitle */}
      <p className="mt-1 lg:mt-2 text-[11.5px] sm:text-[13px] lg:text-[14.5px] font-medium text-[#1D78C1]">
        Small voices. Big imagination.
      </p>
    </div>
  );
}
