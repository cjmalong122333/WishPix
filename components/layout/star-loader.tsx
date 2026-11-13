"use client";

import React from "react";

interface StarLoaderProps {
  fullScreen?: boolean;
  onClick?: () => void;
}

export function StarLoader({ fullScreen = true, onClick }: StarLoaderProps) {
  return (
    <div
      onClick={onClick}
      role="status"
      aria-label="Loading"
      className={`${
        fullScreen ? "min-h-dvh w-full" : "min-h-[280px] sm:min-h-[320px] w-full"
      } flex items-center justify-center bg-[#FAF8FF] p-6 select-none ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 flex items-center justify-center">
        {/* Soft Expanding Lavender Ripple */}
        <span
          aria-hidden="true"
          className="wishpix-ring-ripple absolute inset-2 rounded-full border-2 border-[#6D48DF]/30"
        />

        {/* Rotating Outer Ring */}
        <svg
          viewBox="0 0 100 100"
          className="wishpix-orbit-ring absolute inset-0 w-full h-full"
          aria-hidden="true"
        >
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="#EDE7FB"
            strokeWidth="6"
          />
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="#6D48DF"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="68 200"
          />
        </svg>

        {/* Center Floating Purple Star Badge */}
        <div className="wishpix-float-pulse relative w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-[16px] sm:rounded-[18px] bg-[#6D48DF] shadow-[0_10px_26px_rgba(109,72,223,0.35)] flex items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white"
            aria-hidden="true"
          >
            <path
              d="M12 2.75L14.72 8.26L20.8 9.14L16.4 13.43L17.44 19.49L12 16.63L6.56 19.49L7.6 13.43L3.2 9.14L9.28 8.26L12 2.75Z"
              stroke="currentColor"
              strokeWidth="2.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
