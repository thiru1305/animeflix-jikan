// src/components/Footer.tsx
import React from "react";

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-white/10">
      <div className="flex flex-col items-center gap-3 px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <a
          href="https://jikan.moe/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Powered by Jikan API"
          className="rounded-md outline-none focus-visible:ring-2 focus-visible:ring-netflix-red"
        >
          <PoweredByJikanBadge className="text-white" height={56} />
        </a>

        <p className="text-xs text-center text-white/60">
          Anime data provided by{" "}
          <a
            href="https://jikan.moe/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white underline hover:text-netflix-red underline-offset-2"
          >
            Jikan API
          </a>
          .
        </p>
      </div>
    </footer>
  );
}

/** Slim SVG badge inspired by your reference — plug + cable + pill + text */
function PoweredByJikanBadge({
  className = "text-white",
  height = 56,
}: {
  className?: string;
  height?: number | string;
}) {
  return (
    <svg
      viewBox="0 0 560 160"
      height={height}
      className={className}
      role="img"
      aria-hidden="false"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Powered by Jikan API</title>

      {/* Outer pill */}
      <rect
        x="4"
        y="4"
        width="552"
        height="152"
        rx="76"
        fill="#0b0b0b"
        stroke="#ffffff22"
        strokeWidth="2"
      />

      {/* Cable that “wraps” inside the pill */}
      <path
        d="
          M 42 112
          C 16 112, 16 88, 16 76
          C 16 40, 40 28, 88 28
          L 360 28
        "
        fill="none"
        stroke="white"
        strokeWidth="12"
        strokeLinecap="round"
      />

      {/* Plug on the right */}
      <g transform="translate(420,24)">
        {/* body */}
        <rect x="0" y="40" width="68" height="48" rx="10" fill="white" />
        {/* prongs */}
        <rect x="70" y="44" width="10" height="34" rx="3" fill="white" />
        <rect x="86" y="44" width="10" height="34" rx="3" fill="white" />
        {/* notch line */}
        <path d="M 12 64 H 56" stroke="#0b0b0b" strokeWidth="10" strokeLinecap="round" />
      </g>

      {/* “Powered By” */}
      <text
        x="44"
        y="98"
        fontFamily="'Bebas Neue','Anton','Impact','Arial Black',system-ui,sans-serif"
        fontWeight="900"
        fontSize="62"
        fill="white"
      >
        Powered By
      </text>

      {/* Small pill tag for Jikan API */}
      <g transform="translate(282,58)">
        <rect
          x="0"
          y="0"
          width="246"
          height="64"
          rx="32"
          fill="#111"
          stroke="white"
          strokeWidth="3"
        />
        <text
          x="123"
          y="44"
          textAnchor="middle"
          fontFamily="'Bebas Neue','Anton','Impact','Arial Black',system-ui,sans-serif"
          fontWeight="900"
          fontSize="46"
          fill="white"
        >
          JIKAN API
        </text>
      </g>
    </svg>
  );
}
