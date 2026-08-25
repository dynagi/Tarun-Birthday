import { motion } from "framer-motion";

const CANDLES = [122, 150, 178];

/* Ganache drips: hand-placed so they read as poured, not generated. */
const DRIPS_BOTTOM = [
  [76, 172, 6],
  [102, 176, 7.5],
  [128, 170, 5.5],
  [152, 178, 8],
  [178, 171, 6],
  [204, 176, 7],
  [228, 170, 5.5],
];
const DRIPS_TOP = [
  [106, 122, 4.5],
  [128, 126, 5.5],
  [150, 121, 4],
  [172, 126, 5.5],
  [194, 122, 4.5],
];
const SPRINKLES = [
  [126, 100, -28],
  [140, 96, 18],
  [156, 101, -12],
  [170, 97, 32],
  [134, 104, 44],
  [164, 104, -40],
];
const BASE_DOTS = [72, 90, 108, 126, 144, 162, 180, 198, 216];

function flameAnim(state, i) {
  if (state === "out") {
    return {
      animate: { scaleY: 0, scaleX: 0.45, opacity: 0 },
      transition: { duration: 0.32, ease: "easeIn", delay: i * 0.09 },
    };
  }
  if (state === "flicker") {
    return {
      animate: {
        rotate: [-16, 14, -12, 17, -13, 10],
        scaleY: [1, 0.66, 1.2, 0.7, 1.12, 0.88],
        scaleX: [1, 1.18, 0.84, 1.22, 0.9, 1.06],
      },
      transition: { duration: 0.42, repeat: Infinity, ease: "easeInOut", delay: i * 0.05 },
    };
  }
  return {
    animate: {
      rotate: [-3, 2.5, -2, 3, -3],
      scaleY: [1, 1.07, 0.95, 1.05, 1],
      scaleX: [1, 0.97, 1.04, 0.98, 1],
    },
    transition: { duration: 1.7, repeat: Infinity, ease: "easeInOut", delay: i * 0.22 },
  };
}

export default function ChocolateCake({ state = "lit", className = "" }) {
  const out = state === "out";

  return (
    <svg viewBox="0 0 300 270" className={className} aria-label="A chocolate birthday cake with three candles">
      <defs>
        <linearGradient id="cakeBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5d3826" />
          <stop offset="100%" stopColor="#38200f" />
        </linearGradient>
        <linearGradient id="cakeTopFace" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#6f4429" />
          <stop offset="55%" stopColor="#7d4e2f" />
          <stop offset="100%" stopColor="#5b3520" />
        </linearGradient>
        <linearGradient id="plateGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f0e2c8" />
          <stop offset="100%" stopColor="#c9b795" />
        </linearGradient>
        <radialGradient id="flameGrad" cx="50%" cy="68%" r="60%">
          <stop offset="0%" stopColor="#fffaf0" />
          <stop offset="32%" stopColor="#ffd88a" />
          <stop offset="66%" stopColor="#ff9f3c" />
          <stop offset="100%" stopColor="#e0521c" stopOpacity="0.25" />
        </radialGradient>
        <pattern id="candleStripe" width="9" height="9" patternTransform="rotate(38)" patternUnits="userSpaceOnUse">
          <rect width="9" height="9" fill="#f4e7ce" />
          <rect width="4.5" height="9" fill="#c9694f" />
        </pattern>
        <filter id="cakeShadow" x="-40%" y="-40%" width="180%" height="200%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>

      {/* grounding shadow */}
      <ellipse cx="150" cy="248" rx="104" ry="10" fill="#0a0605" opacity="0.55" filter="url(#cakeShadow)" />

      {/* plate */}
      <ellipse cx="150" cy="234" rx="99" ry="13" fill="url(#plateGrad)" />
      <ellipse cx="150" cy="231" rx="99" ry="13" fill="#f4e8d0" />
      <ellipse cx="150" cy="231" rx="80" ry="9" fill="#e8d9bb" opacity="0.75" />

      {/* ── bottom tier ── */}
      <rect x="62" y="152" width="176" height="76" rx="7" fill="url(#cakeBody)" />
      <rect x="62" y="152" width="30" height="76" rx="7" fill="#ffffff" opacity="0.05" />
      <rect x="62" y="152" width="176" height="20" rx="7" fill="#31190f" />
      {DRIPS_BOTTOM.map(([cx, cy, r]) => (
        <circle key={`db-${cx}`} cx={cx} cy={cy} r={r} fill="#31190f" />
      ))}
      {BASE_DOTS.map((cx) => (
        <circle key={`bd-${cx}`} cx={cx} cy={224} r="5.5" fill="#f2e3c8" opacity="0.92" />
      ))}

      {/* ── top tier ── */}
      <rect x="96" y="104" width="108" height="52" rx="6" fill="url(#cakeBody)" />
      <rect x="96" y="104" width="20" height="52" rx="6" fill="#ffffff" opacity="0.05" />
      <rect x="96" y="104" width="108" height="16" rx="6" fill="#31190f" />
      {DRIPS_TOP.map(([cx, cy, r]) => (
        <circle key={`dt-${cx}`} cx={cx} cy={cy} r={r} fill="#31190f" />
      ))}
      <ellipse cx="150" cy="104" rx="54" ry="8" fill="url(#cakeTopFace)" />
      {SPRINKLES.map(([x, y, rot], i) => (
        <rect
          key={`sp-${i}`}
          x={x}
          y={y}
          width="5"
          height="2"
          rx="1"
          fill={["#f2e3c8", "#ffb627", "#c96f5a"][i % 3]}
          transform={`rotate(${rot} ${x + 2.5} ${y + 1})`}
          opacity="0.9"
        />
      ))}

      {/* ── candles ── */}
      {CANDLES.map((x, i) => {
        const { animate, transition } = flameAnim(state, i);
        return (
          <g key={x}>
            <rect x={x - 4.5} y="64" width="9" height="42" rx="2" fill="url(#candleStripe)" />
            <rect x={x - 4.5} y="64" width="3" height="42" rx="2" fill="#ffffff" opacity="0.18" />
            <ellipse cx={x} cy="64" rx="4.5" ry="1.6" fill="#fdf4e2" />
            <rect x={x - 1} y="57" width="2" height="8" rx="1" fill="#3a2a1e" />

            {/* candle glow */}
            <motion.circle
              cx={x}
              cy="50"
              r="17"
              fill="url(#flameGrad)"
              initial={false}
              animate={{ opacity: out ? 0 : state === "flicker" ? [0.3, 0.16, 0.32] : 0.24 }}
              transition={
                out
                  ? { duration: 0.4, delay: i * 0.09 }
                  : state === "flicker"
                  ? { duration: 0.42, repeat: Infinity }
                  : { duration: 1.7, repeat: Infinity }
              }
              style={{ filter: "blur(5px)" }}
            />

            {/* flame */}
            <motion.g
              style={{ transformOrigin: `${x}px 59px` }}
              initial={false}
              animate={animate}
              transition={transition}
            >
              <ellipse cx={x} cy="50" rx="6.4" ry="10.5" fill="url(#flameGrad)" />
              <ellipse cx={x} cy="53" rx="2.7" ry="5.4" fill="#fff8e2" opacity="0.9" />
            </motion.g>

            {/* smoke, only once the wick is out */}
            {out &&
              [0, 1, 2].map((s) => (
                <motion.circle
                  key={`sm-${x}-${s}`}
                  cx={x}
                  cy="54"
                  r="2.6"
                  fill="#cbbfae"
                  initial={{ opacity: 0, y: 0, scale: 0.6 }}
                  animate={{ opacity: [0, 0.42, 0], y: -46, scale: 3.1, x: s % 2 ? 9 : -7 }}
                  transition={{
                    duration: 1.9,
                    delay: i * 0.09 + s * 0.22,
                    ease: "easeOut",
                  }}
                />
              ))}
          </g>
        );
      })}
    </svg>
  );
}
