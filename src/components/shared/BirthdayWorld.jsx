import { useEffect, useMemo, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

/* Soft festive palette — nothing neon. */
const C = {
  peach: "var(--color-bw-peach)",
  pink: "var(--color-bw-pink)",
  lav: "var(--color-bw-lav)",
  blue: "var(--color-bw-blue)",
  yellow: "var(--color-bw-yellow)",
  orange: "var(--color-bw-orange)",
  cream: "var(--color-bw-cream)",
};
const DECO_COLORS = [C.peach, C.pink, C.lav, C.blue, C.yellow, C.orange];

/**
 * Each scene nudges these dials; the elements themselves never remount, so
 * moving between scenes reads as the room changing light, not a new page.
 *  deco    — presence of balloons / ribbons / confetti
 *  sparkle — twinkle layer
 *  energy  — extra fast-moving particles (countdown ramp)
 *  glow    — colour washes behind everything
 *  ball    — football accents
 *  dim     — centre scrim, pulls focus to cake / envelope / letter
 */
const MOODS = {
  calm: { deco: 0.62, sparkle: 0.4, energy: 0, glow: 0.55, ball: 0, dim: 0.08 },
  football: { deco: 0.66, sparkle: 0.45, energy: 0.1, glow: 0.6, ball: 1, dim: 0.1 },
  energy: { deco: 0.85, sparkle: 0.75, energy: 0.55, glow: 0.75, ball: 0.35, dim: 0.05 },
  surge: { deco: 1, sparkle: 1, energy: 1, glow: 0.95, ball: 0, dim: 0 },
  festive: { deco: 1, sparkle: 1, energy: 0.5, glow: 1, ball: 0, dim: 0 },
  focus: { deco: 0.6, sparkle: 0.5, energy: 0.12, glow: 0.6, ball: 0, dim: 0.36 },
  warm: { deco: 0.52, sparkle: 0.44, energy: 0, glow: 0.68, ball: 0, dim: 0.44 },
  letter: { deco: 0.42, sparkle: 0.32, energy: 0, glow: 0.62, ball: 0, dim: 0.62 },
  memories: { deco: 0.38, sparkle: 0.3, energy: 0, glow: 0.58, ball: 0, dim: 0.52 },
};

function useCompact() {
  const [compact, setCompact] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const on = (e) => setCompact(e.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return compact;
}

/* ── decoration primitives ─────────────────────────────────── */

function Balloon({ x, y, size, color, dur, delay, rot = 0, blur }) {
  return (
    <div
      className="bw-a absolute"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        animationName: "bw-float",
        animationDuration: `${dur}s`,
        animationDelay: `${delay}s`,
        "--bw-rot": `${rot}deg`,
        "--bw-dy": "-22px",
        "--bw-dx": "5px",
        filter: blur ? `blur(${blur}px)` : undefined,
      }}
    >
      <div
        style={{
          width: size,
          height: size * 1.18,
          borderRadius: "50% 50% 50% 50% / 46% 46% 58% 58%",
          background: `radial-gradient(circle at 34% 28%, rgba(255,255,255,0.5), ${color} 62%)`,
        }}
      />
      {/* knot + string */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          top: size * 1.18,
          width: 1,
          height: size * 0.9,
          background: `linear-gradient(to bottom, ${color}, transparent)`,
          opacity: 0.5,
        }}
      />
    </div>
  );
}

function Ribbon({ x, y, w, color, dur, delay, rot }) {
  return (
    <svg
      className="bw-a absolute"
      viewBox="0 0 60 120"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: w,
        height: w * 2,
        animationName: "bw-sway",
        animationDuration: `${dur}s`,
        animationDelay: `${delay}s`,
        transformOrigin: "50% 0%",
        "--bw-rot": `${rot}deg`,
      }}
    >
      <path
        d="M30 0 Q6 26 30 52 Q54 78 30 104 Q14 116 26 120"
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}

function Confetto({ x, y, color, dur, delay, size, rot }) {
  return (
    <div
      className="bw-a absolute"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        animationName: "bw-float",
        animationDuration: `${dur}s`,
        animationDelay: `${delay}s`,
        "--bw-dy": "-26px",
        "--bw-dx": "10px",
      }}
    >
      <div
        className="bw-a bw-a-linear"
        style={{
          width: size,
          height: size * 0.42,
          background: color,
          borderRadius: 1,
          opacity: 0.75,
          animationName: "bw-spin",
          animationDuration: `${dur * 1.6}s`,
          transform: `rotate(${rot}deg)`,
        }}
      />
    </div>
  );
}

function Sparkle({ x, y, size, color, dur, delay }) {
  return (
    <div
      className="bw-a absolute"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        animationName: "bw-twinkle",
        animationDuration: `${dur}s`,
        animationDelay: `${delay}s`,
        background: color,
        borderRadius: "50%",
        boxShadow: `0 0 ${size * 2.4}px ${color}`,
      }}
    />
  );
}

function Rising({ x, size, color, dur, delay, dx }) {
  return (
    <div
      className="bw-a bw-a-linear absolute bottom-[-14%]"
      style={{
        left: `${x}%`,
        animationName: "bw-drift",
        animationDuration: `${dur}s`,
        animationDelay: `${delay}s`,
        "--bw-dx": `${dx}px`,
        "--bw-dy": "-120vh",
        "--bw-op": 0.5,
      }}
    >
      <div
        style={{
          width: size,
          height: size * 1.18,
          borderRadius: "50% 50% 50% 50% / 46% 46% 58% 58%",
          background: `radial-gradient(circle at 34% 28%, rgba(255,255,255,0.45), ${color} 62%)`,
        }}
      />
    </div>
  );
}

/* ── deterministic edge placement (never the centre band) ──── */

function edgeSpots(count, seed = 1, compact = false) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const r = ((Math.sin(seed * (i + 1) * 12.9898) * 43758.5453) % 1 + 1) % 1;
    const r2 = ((Math.sin(seed * (i + 7) * 78.233) * 12345.678) % 1 + 1) % 1;
    const lane = i % 4;
    let x;
    let y;

    if (compact) {
      // Phones have no side margins, so work the top and bottom strips —
      // and keep clear of the top-centre, where the status label sits.
      if (lane === 0) {
        x = 2 + r * 24;
        y = 1 + r2 * 15;
      } else if (lane === 1) {
        x = 74 + r * 24;
        y = 1 + r2 * 15;
      } else if (lane === 2) {
        x = 4 + r * 88;
        y = 80 + r2 * 19;
      } else {
        x = r < 0.5 ? r * 8 : 93 + (r - 0.5) * 14;
        y = 18 + r2 * 64;
      }
    } else if (lane === 0) {
      x = 1 + r * 15;
      y = 4 + r2 * 88;
    } else if (lane === 1) {
      x = 84 + r * 14;
      y = 4 + r2 * 88;
    } else if (lane === 2) {
      x = 8 + r * 80;
      y = 1 + r2 * 13;
    } else {
      x = 8 + r * 80;
      y = 84 + r2 * 13;
    }

    out.push({ x, y, r, r2 });
  }
  return out;
}

export default function BirthdayWorld({ mood = "calm" }) {
  const compact = useCompact();
  const m = MOODS[mood] ?? MOODS.calm;

  // Subtle pointer parallax, desktop only.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 40, damping: 20 });
  const sy = useSpring(py, { stiffness: 40, damping: 20 });
  const farX = useTransform(sx, (v) => v * 10);
  const farY = useTransform(sy, (v) => v * 8);
  const nearX = useTransform(sx, (v) => v * 24);
  const nearY = useTransform(sy, (v) => v * 18);

  useEffect(() => {
    if (compact) return undefined;
    const on = (e) => {
      px.set(e.clientX / window.innerWidth - 0.5);
      py.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", on, { passive: true });
    return () => window.removeEventListener("pointermove", on);
  }, [compact, px, py]);

  const counts = compact
    ? { balloon: 7, ribbon: 3, confetti: 8, sparkle: 10, energy: 7 }
    : { balloon: 9, ribbon: 4, confetti: 12, sparkle: 15, energy: 12 };

  const deco = useMemo(() => {
    const balloons = edgeSpots(counts.balloon, 3, compact).map((s, i) => ({
      ...s,
      size: 20 + s.r * 26,
      color: DECO_COLORS[i % DECO_COLORS.length],
      dur: 9 + s.r2 * 7,
      delay: -s.r * 10,
      rot: -8 + s.r2 * 16,
    }));
    const ribbons = edgeSpots(counts.ribbon, 11, compact).map((s, i) => ({
      ...s,
      w: 26 + s.r * 16,
      color: DECO_COLORS[(i + 2) % DECO_COLORS.length],
      dur: 11 + s.r2 * 6,
      delay: -s.r * 8,
      rot: -14 + s.r2 * 28,
    }));
    const confetti = edgeSpots(counts.confetti, 23, compact).map((s, i) => ({
      ...s,
      size: 7 + s.r * 7,
      color: DECO_COLORS[(i + 4) % DECO_COLORS.length],
      dur: 7 + s.r2 * 6,
      delay: -s.r * 9,
      rot: s.r2 * 180,
    }));
    const sparkles = edgeSpots(counts.sparkle, 37, compact).map((s, i) => ({
      ...s,
      size: 2 + s.r * 3,
      color: i % 3 === 0 ? C.cream : i % 3 === 1 ? C.yellow : C.pink,
      dur: 3 + s.r2 * 4,
      delay: -s.r * 7,
    }));
    const energy = edgeSpots(counts.energy, 53, compact).map((s, i) => ({
      ...s,
      size: 2 + s.r * 3,
      color: i % 2 ? C.yellow : C.cream,
      dur: 1.1 + s.r2 * 1.4,
      delay: -s.r * 3,
    }));
    return { balloons, ribbons, confetti, sparkles, energy };
  }, [compact, counts.balloon, counts.ribbon, counts.confetti, counts.sparkle, counts.energy]);

  const risers = useMemo(
    () =>
      Array.from({ length: compact ? 5 : 8 }, (_, i) => ({
        id: i,
        x: 4 + ((i * 13.7) % 92),
        size: 16 + ((i * 7) % 18),
        color: DECO_COLORS[i % DECO_COLORS.length],
        dur: 13 + ((i * 3) % 7),
        delay: (i % 5) * 1.1,
        dx: -30 + ((i * 17) % 60),
      })),
    [compact]
  );

  const ease = { duration: 1.5, ease: "easeInOut" };

  return (
    <div className="absolute inset-0 overflow-hidden bg-bw-deep" aria-hidden="true">
      {/* ── Layer 1 — soft warm ground ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(130% 100% at 50% 4%, #33203a 0%, #241726 42%, #150e19 100%)",
        }}
      />

      {/* colour washes: peach, lavender, dusty blue */}
      <motion.div className="absolute inset-0" animate={{ opacity: m.glow }} transition={ease}>
        <div
          className="bw-a absolute rounded-full blur-3xl"
          style={{
            left: "-14%",
            top: "-12%",
            width: "62vw",
            height: "56vh",
            background: `radial-gradient(circle, ${C.peach} 0%, transparent 68%)`,
            opacity: 0.16,
            animationName: "bw-breathe",
            animationDuration: "17s",
          }}
        />
        <div
          className="bw-a absolute rounded-full blur-3xl"
          style={{
            right: "-16%",
            top: "-8%",
            width: "56vw",
            height: "52vh",
            background: `radial-gradient(circle, ${C.lav} 0%, transparent 68%)`,
            opacity: 0.14,
            animationName: "bw-breathe",
            animationDuration: "21s",
            animationDelay: "-6s",
          }}
        />
        <div
          className="bw-a absolute rounded-full blur-3xl"
          style={{
            left: "18%",
            bottom: "-24%",
            width: "70vw",
            height: "50vh",
            background: `radial-gradient(circle, ${C.blue} 0%, transparent 70%)`,
            opacity: 0.1,
            animationName: "bw-breathe",
            animationDuration: "25s",
            animationDelay: "-12s",
          }}
        />
      </motion.div>

      {/* ── Layer 2 — distant, heavily blurred balloons ── */}
      <motion.div
        className="bw-edge-mask absolute inset-0"
        style={compact ? undefined : { x: farX, y: farY }}
        animate={{ opacity: m.deco * 0.75 }}
        transition={ease}
      >
        <Balloon x={-2} y={12} size={132} color={C.pink} dur={19} delay={0} blur={26} />
        <Balloon x={80} y={4} size={112} color={C.peach} dur={23} delay={-7} blur={24} />
        <Balloon x={68} y={62} size={148} color={C.lav} dur={26} delay={-13} blur={30} />
        <Balloon x={2} y={58} size={104} color={C.blue} dur={21} delay={-4} blur={22} />
        <Balloon x={38} y={-8} size={96} color={C.yellow} dur={24} delay={-16} blur={26} />
      </motion.div>

      {/* ── Layer 3 — small decorations, kept to the edges ── */}
      <motion.div
        className="bw-edge-mask absolute inset-0"
        style={compact ? undefined : { x: nearX, y: nearY }}
        animate={{ opacity: m.deco }}
        transition={ease}
      >
        {deco.balloons.map((b, i) => (
          <Balloon key={`b${i}`} {...b} />
        ))}
        {deco.ribbons.map((r, i) => (
          <Ribbon key={`r${i}`} {...r} />
        ))}
        {deco.confetti.map((c, i) => (
          <Confetto key={`c${i}`} {...c} />
        ))}
      </motion.div>

      {/* football accents — secondary, only during the quiz chapter */}
      <motion.div
        className="bw-edge-mask absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: m.ball * 0.5 }}
        transition={ease}
      >
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <circle cx="50" cy="50" r="30" fill="none" stroke={C.cream} strokeWidth="0.14" opacity="0.5" />
          <line x1="0" y1="50" x2="100" y2="50" stroke={C.cream} strokeWidth="0.12" opacity="0.35" />
          <rect x="-1" y="30" width="14" height="40" fill="none" stroke={C.cream} strokeWidth="0.14" opacity="0.45" />
          <rect x="87" y="30" width="14" height="40" fill="none" stroke={C.cream} strokeWidth="0.14" opacity="0.45" />
        </svg>
        {[
          { x: 6, y: 22, s: 16, d: 12 },
          { x: 90, y: 70, s: 13, d: 15 },
          { x: 22, y: 88, s: 11, d: 14 },
        ].map((f, i) => (
          <div
            key={`f${i}`}
            className="bw-a absolute rounded-full"
            style={{
              left: `${f.x}%`,
              top: `${f.y}%`,
              width: f.s,
              height: f.s,
              background: C.cream,
              opacity: 0.3,
              boxShadow: `inset -${f.s * 0.2}px -${f.s * 0.16}px 0 rgba(0,0,0,0.28)`,
              animationName: "bw-float",
              animationDuration: `${f.d}s`,
              animationDelay: `${-i * 3}s`,
              "--bw-dy": "-16px",
            }}
          />
        ))}
      </motion.div>

      {/* ── Layer 4 — sparkles ── */}
      <motion.div
        className="bw-edge-mask absolute inset-0"
        animate={{ opacity: m.sparkle }}
        transition={ease}
      >
        {deco.sparkles.map((s, i) => (
          <Sparkle key={`s${i}`} {...s} />
        ))}
      </motion.div>

      {/* energy layer — fades in as the countdown tightens */}
      <motion.div
        className="bw-edge-mask absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: m.energy }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {deco.energy.map((s, i) => (
          <Sparkle key={`e${i}`} {...s} />
        ))}
      </motion.div>

      {/* balloons released for the reveal */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: mood === "festive" ? 1 : 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        {mood === "festive" &&
          risers.map((r) => <Rising key={r.id} {...r} />)}
      </motion.div>

      {/* centre scrim — pulls focus to the cake, envelope and letter */}
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: m.dim }}
        transition={ease}
        style={{
          background:
            "radial-gradient(ellipse 62% 56% at 50% 50%, rgba(14,8,17,0.92) 0%, rgba(14,8,17,0.55) 52%, transparent 78%)",
        }}
      />

      {/* vignette + grain, to seat everything in one room */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 88% 70% at 50% 46%, transparent 40%, rgba(10,6,12,0.72) 100%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          mixBlendMode: "overlay",
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
