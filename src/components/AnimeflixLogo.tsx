// Netflix-style wordmark for "ANIMEFLIX"
type Props = {
  className?: string;
  curve?: 'down' | 'up' | 'flat';
  arcStrength?: number;
  rightBias?: number;
  leftBias?: number;
  tracking?: number;
  strokeWidth?: number;
  title?: string;
};

export default function AnimeflixLogo({
  className = 'block h-12',
  curve = 'down',
  arcStrength = 0.18,
  rightBias = 0.14,
  leftBias = 0.03,
  tracking = -0.02,
  strokeWidth = 22,
  title = 'AnimeFlix',
}: Props) {
  // viewBox cropped to remove the old 60px left gutter
  const vb = '0 0 1280 360';
  const baseY = 240;
  const maxDelta = 160;

  const sign = curve === 'down' ? 1 : curve === 'up' ? -1 : 0;

  const dL = maxDelta * Math.max(arcStrength - leftBias, 0);
  const dM = maxDelta * (arcStrength + rightBias * 0.6);
  const dR = maxDelta * (arcStrength + rightBias * 1.15);

  const sag = (v: number) => baseY + sign * v;

  // all x values shifted: start at 0, end at 1280
  const pathD =
    curve === 'flat'
      ? `M 0 ${baseY} L 1280 ${baseY}`
      : [
          `M 0 ${baseY}`,
          `C 360 ${sag(dL * 0.55)} 640 ${sag(dL * 0.9)} 900 ${sag(dM)}`,
          `C 1060 ${sag(dM)} 1200 ${sag(dR)} 1280 ${baseY}`,
        ].join(' ');

  return (
    <svg
      viewBox={vb}
      role="img"
      aria-label={title}
      className={className + ' w-auto select-none block'}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMinYMid meet"   /* keep content anchored to the left */
      textRendering="geometricPrecision"
    >
      <title>{title}</title>

      <defs>
        {/* Red gradient (top → bottom) */}
        <linearGradient id="af-red" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%"   stopColor="#ff2d2d" />
          <stop offset="55%"  stopColor="#e50914" />
          <stop offset="100%" stopColor="#b20710" />
        </linearGradient>

        {/* Soft outer shadow */}
        <filter id="af-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feOffset dx="0" dy="2" />
          <feGaussianBlur stdDeviation="2.2" result="b" />
          <feColorMatrix
            in="b"
            type="matrix"
            values="
              0 0 0 0 0
              0 0 0 0 0
              0 0 0 0 0
              0 0 0 .40 0"
          />
          <feBlend in="SourceGraphic" mode="normal" />
        </filter>

        {/* Gentle inner depth */}
        <filter id="af-inner" x="-10%" y="-10%" width="120%" height="120%">
          <feOffset dx="0" dy="1" />
          <feGaussianBlur stdDeviation="1.3" result="ib" />
          <feComposite in="ib" in2="SourceAlpha" operator="out" result="i" />
          <feColorMatrix
            in="i"
            type="matrix"
            values="
              0 0 0 0 0
              0 0 0 0 0
              0 0 0 0 0
              0 0 0 .35 0"
          />
          <feComposite in="SourceGraphic" operator="over" />
        </filter>

        {/* The arc path used by textPath */}
        <path id="af-arc-one" d={pathD} />
      </defs>

      {/* Outline (black) */}
      <g filter="url(#af-shadow)">
        <text
          fill="none"
          stroke="#000"
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
          fontFamily="'Bebas Neue','Anton','Impact','Arial Black',system-ui,sans-serif"
          fontWeight="900"
          fontSize="210"
          paintOrder="stroke"
          textAnchor="middle"
          style={{ letterSpacing: tracking as any }}
        >
          <textPath href="#af-arc-one" startOffset="50%" method="align" spacing="auto">
            ANIMEFLIX
          </textPath>
        </text>
      </g>

      {/* Fill (red gradient) */}
      <text
        fill="url(#af-red)"
        filter="url(#af-inner)"
        fontFamily="'Bebas Neue','Anton','Impact','Arial Black',system-ui,sans-serif"
        fontWeight="900"
        fontSize="210"
        paintOrder="stroke"
        textAnchor="middle"
        style={{ letterSpacing: tracking as any }}
      >
        <textPath href="#af-arc-one" startOffset="50%" method="align" spacing="auto">
          ANIMEFLIX
        </textPath>
      </text>
    </svg>
  );
}
