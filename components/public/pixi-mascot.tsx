import React from "react";

interface PixiMascotProps {
  className?: string;
}

export function PixiMascot({ className = "w-48 h-48" }: PixiMascotProps) {
  return (
    <svg
      viewBox="0 0 240 230"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none wishpix-float-pulse ${className}`}
      role="img"
      aria-label="Pixi, your WishPix star companion waving hello"
    >
      {/* ==================== SURROUNDING SPARKLES & DOTS ==================== */}
      {/* Top-Left Mint 4-Point Sparkle */}
      <path
        d="M42 46 C42 54, 34 56, 28 56 C34 56, 42 58, 42 66 C42 58, 50 56, 56 56 C50 56, 42 54, 42 46 Z"
        fill="#96EED6"
        className="wishpix-sparkle-twinkle"
      />
      {/* Top-Left Tiny Yellow Dot */}
      <circle
        cx="67"
        cy="27"
        r="3"
        fill="#FDE073"
        className="wishpix-sparkle-twinkle-delayed"
      />

      {/* Top-Right Yellow 4-Point Sparkle */}
      <path
        d="M180 22 C180 30, 172 32, 166 32 C172 32, 180 34, 180 42 C180 34, 188 32, 194 32 C188 32, 180 30, 180 22 Z"
        fill="#FDE073"
        className="wishpix-sparkle-twinkle-delayed"
      />

      {/* Bottom-Left Yellow 4-Point Sparkle */}
      <path
        d="M32 146 C32 154, 24 156, 18 156 C24 156, 32 158, 32 166 C32 158, 40 156, 46 156 C40 156, 32 154, 32 146 Z"
        fill="#FDE073"
        className="wishpix-sparkle-twinkle-delayed"
      />

      {/* Bottom-Right Mint 4-Point Sparkle */}
      <path
        d="M196 155 C196 164, 187 166, 180 166 C187 166, 196 168, 196 177 C196 168, 205 166, 212 166 C205 166, 196 164, 196 155 Z"
        fill="#96EED6"
        className="wishpix-sparkle-twinkle"
      />
      {/* Bottom-Right Tiny Mint Dot */}
      <circle
        cx="174"
        cy="194"
        r="3"
        fill="#96EED6"
        className="wishpix-sparkle-twinkle"
      />

      {/* ==================== LEFT ARM (TUCKED SIDE ARM) ==================== */}
      <path
        d="M64 114 C48 117, 44 134, 53 141 C60 145, 68 137, 71 128"
        fill="#A482F6"
        stroke="#5E3BAE"
        strokeWidth="4.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* ==================== WAVING RIGHT ARM & HAND ==================== */}
      <path
        d="M166 116 C185 113, 198 97, 204 77 C206 70, 209 62, 204 59 C199 56, 195 64, 193 69 C192 60, 195 49, 189 47 C183 45, 180 56, 179 64 C177 58, 174 51, 169 54 C164 57, 168 68, 172 75 C177 84, 171 96, 159 101"
        fill="#B698FA"
        stroke="#5E3BAE"
        strokeWidth="4.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="wishpix-pixi-wave"
      />

      {/* ==================== LEGS / FEET ==================== */}
      {/* Left Foot */}
      <path
        d="M78 164 L78 191 C78 201, 102 201, 102 191 L102 168"
        fill="#A482F6"
        stroke="#5E3BAE"
        strokeWidth="4.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <ellipse cx="90" cy="191" rx="7" ry="4" fill="#BCA0FC" />

      {/* Right Foot */}
      <path
        d="M132 168 L132 191 C132 201, 156 201, 156 191 L156 164"
        fill="#A482F6"
        stroke="#5E3BAE"
        strokeWidth="4.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <ellipse cx="144" cy="191" rx="7" ry="4" fill="#BCA0FC" />

      {/* ==================== STAR BODY ==================== */}
      <path
        d="M117 24
           C121 24, 124 27, 126 32
           L143 68
           L183 73
           C190 74, 193 81, 187 86
           L157 115
           L165 156
           C167 163, 160 168, 154 164
           L117 145
           L80 164
           C74 168, 67 163, 69 156
           L77 115
           L47 86
           C41 81, 44 74, 51 73
           L91 68
           L108 32
           C110 27, 113 24, 117 24 Z"
        fill="#BBA0FF"
        stroke="#5E3BAE"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Subtle Inner Star Shading & Highlight */}
      <path
        d="M117 34 L134 71 L104 71 Z"
        fill="#D3C1FF"
        opacity="0.7"
      />
      <path
        d="M128 38 L140 65"
        stroke="#E8DFFF"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <path
        d="M74 156 L117 136 L158 157 L153 162 L117 143 L80 162 Z"
        fill="#9C7AF2"
        opacity="0.65"
      />

      {/* ==================== FACE (EYES, CHEEKS, SMILE) ==================== */}
      {/* Rosy Pink Cheeks */}
      <ellipse cx="81" cy="122" rx="11.5" ry="6.8" fill="#F294AF" />
      <ellipse cx="153" cy="122" rx="11.5" ry="6.8" fill="#F294AF" />

      {/* Left Eye */}
      <ellipse cx="95" cy="107" rx="9.5" ry="13.5" fill="#37245E" />
      <circle cx="98.5" cy="102" r="4.2" fill="#FFFFFF" />
      <circle cx="92" cy="113" r="2" fill="#FFFFFF" />

      {/* Right Eye */}
      <ellipse cx="139" cy="107" rx="9.5" ry="13.5" fill="#37245E" />
      <circle cx="142.5" cy="102" r="4.2" fill="#FFFFFF" />
      <circle cx="136" cy="113" r="2" fill="#FFFFFF" />

      {/* Cute Curved Smile */}
      <path
        d="M111 122 Q117 129 123 122"
        stroke="#4E3194"
        strokeWidth="3.8"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
