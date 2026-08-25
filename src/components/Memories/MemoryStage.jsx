import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { memories } from "./memories";
import { useMood } from "../shared/mood";
import ScrapbookBackdrop from "./ScrapbookBackdrop";
import { StarMark, HeartMark, HeartRule, LeafMark } from "./Doodles";

/* ── wheel geometry ──────────────────────────────────────────────
 * Photographs are mounted on the rim of a vertical wheel whose axis is
 * horizontal. A slot's angle round that wheel is its only real input:
 *
 *   theta = rel * STEP_DEG
 *   y     =  Y_AMP * sin(theta)      ← rides an arc, never a straight line
 *   z     =  Z_AMP * (cos(theta)-1)  ← swings away from the viewer
 *   rotX  = -theta                   ← the print faces out along the radius
 *
 * y and z get their own amplitudes rather than sharing one radius: that
 * keeps the path elliptical (still curved, still a wheel) while letting the
 * neighbours sit close enough that the active print occludes all but a
 * sliver of their edge.
 */
const STEP_DEG = 52;
// Neighbours ride close to the front of the wheel so the active print buries
// all but a thin crescent of them — roughly a tenth of their surface.
// Tuned against the circular-segment area, not the peek height: at rel ±1 the
// exposed crescent works out to ~11% of the neighbour's surface.
const Y_AMP = 0.478; // × diameter
// The rim tilt is damped: a full 52° squashes a neighbour to under half its
// height, which reads as a flat ellipse rather than a round photograph.
const TILT = 0.55;
const Z_AMP = 0.9; // × diameter
const SCALE_FALLOFF = 0.16; // rel ±1 → 0.84
// On a cream page a low-opacity photograph goes milky rather than distant,
// so the crescents sit at the top of the intended range and lean on blur,
// scale and the active print's shadow for separation instead.
const OPACITY_FALLOFF = 0.65; // rel ±1 → 0.35
const BLUR_PER_REL = 3.0; // rel ±1 → 3.0px
const VISIBLE_REL = 1.6; // past this a slot is fully faded out

// One notch of a stepped mouse wheel (deltaY 100, clamped to 90) must clear
// COMMIT_AT on its own, or a single deliberate scroll feels dead.
const WHEEL_PX_PER_MEMORY = 300;
const TOUCH_PX_PER_MEMORY = 280;
// Long enough to span the gaps between notches on a stepped mouse wheel —
// too short and the rim resettles mid-gesture and never advances.
const SETTLE_DELAY = 220;
const COMMIT_AT = 0.22; // fraction of a turn that counts as "meant it"
const MAX_PER_GESTURE = 1; // one intentional scroll ⇒ one memory

const rad = (deg) => (deg * Math.PI) / 180;

/** Shortest signed distance from `p` to slot `i` on a ring of `n`. */
function wrapRel(i, p, n) {
  const raw = i - p;
  if (n <= 1) return raw;
  return ((((raw + n / 2) % n) + n) % n) - n / 2;
}

/* ── one photograph on the rim ─────────────────────────────────── */
function Slot({ memory, index, count, progress, diameter, reduced }) {
  const rel = useTransform(progress, (p) => wrapRel(index, p, count));

  const y = useTransform(rel, (r) => Y_AMP * diameter * Math.sin(rad(r * STEP_DEG)));
  const z = useTransform(rel, (r) => Z_AMP * diameter * (Math.cos(rad(r * STEP_DEG)) - 1));
  const rotateX = useTransform(rel, (r) => -r * STEP_DEG * TILT);
  const scale = useTransform(rel, (r) =>
    Math.max(0.34, 1 - SCALE_FALLOFF * Math.abs(r))
  );
  const opacity = useTransform(rel, (r) => {
    const a = Math.abs(r);
    if (a >= VISIBLE_REL) return 0;
    return Math.max(0, Math.min(1, 1 - OPACITY_FALLOFF * a));
  });
  const filter = useTransform(rel, (r) => {
    if (reduced) return "none";
    const b = Math.min(7, Math.abs(r) * BLUR_PER_REL);
    return b < 0.12 ? "none" : `blur(${b.toFixed(2)}px)`;
  });
  // Depth decides stacking, so the incoming print passes behind the outgoing
  // one and only takes the front once it is genuinely nearer the viewer.
  const zIndex = useTransform(z, (v) => Math.round(600 + v));

  return (
    <motion.div
      className="absolute left-1/2 top-1/2"
      style={{
        width: diameter,
        height: diameter,
        marginLeft: -diameter / 2,
        marginTop: -diameter / 2,
        y,
        z,
        rotateX,
        scale,
        opacity,
        filter,
        zIndex,
        // Perspective lives on the print, not on a shared preserve-3d stage:
        // tilted sibling planes would otherwise intersect and the browser
        // would sort them by polygon, letting a neighbour punch through the
        // active photo regardless of z-index. Flattened, z-index rules.
        // Proportional to the print, not a fixed 1200px: a fixed value
        // foreshortens a small mobile circle far less than a large desktop
        // one, which would leave the neighbours more exposed on phones.
        transformPerspective: diameter * 2.55,
        willChange: "transform, opacity, filter",
      }}
    >
      <div
        className="paper-texture relative h-full w-full overflow-hidden rounded-full"
        style={{
          // thin off-white print rim, a hairline of age, then a soft warm
          // shadow that lifts the photograph off the album page
          boxShadow:
            "0 0 0 7px #fbf6ea, 0 0 0 8px rgba(122,92,58,0.22), 0 22px 44px -16px rgba(88,62,38,0.5), 0 6px 16px -8px rgba(88,62,38,0.32)",
          background: "#e6dccb",
        }}
      >
        <img
          src={memory.image}
          alt=""
          draggable="false"
          className="h-full w-full select-none rounded-full object-cover"
        />
        {/* inner highlight along the top edge, like light on a glossy print */}
        <span
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            background:
              "linear-gradient(152deg, rgba(255,252,244,0.22) 0%, rgba(255,252,244,0) 38%, rgba(74,52,32,0.14) 100%)",
          }}
        />
      </div>
    </motion.div>
  );
}

export default function MemoryStage({ onFinish }) {
  useMood("memories");

  const count = memories.length;
  const hostRef = useRef(null);
  // Flips once the wheel has been turned a full revolution, which is the
  // natural moment to offer the way out. The wheel itself is unaffected.
  const [seenAll, setSeenAll] = useState(false);

  const [diameter, setDiameter] = useState(320);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMq = (e) => setReduced(e.matches);
    setReduced(mq.matches);
    mq.addEventListener("change", onMq);

    const measure = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const compact = vw < 768;
      const d = compact
        ? Math.min(320, Math.max(270, Math.min(vw * 0.78, vh * 0.38)))
        : Math.min(500, Math.max(420, Math.min(vw * 0.42, vh * 0.48)));
      setDiameter(Math.round(d));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => {
      mq.removeEventListener("change", onMq);
      window.removeEventListener("resize", measure);
    };
  }, []);

  /* Continuous wheel state. `raw` is driven straight off the gesture; the
     spring gives the rim its weight and the small overshoot when it rests. */
  const raw = useMotionValue(0);
  const progress = useSpring(raw, {
    stiffness: reduced ? 400 : 170,
    damping: reduced ? 40 : 20,
    mass: 0.9,
  });

  const settleTimer = useRef(0);
  const gestureAnchor = useRef(null);

  // Rest on whichever memory the gesture actually reached for: past a
  // quarter-turn commit to the next one, otherwise fall back to where it
  // started. Plain rounding would swallow short, deliberate flicks.
  const settle = useCallback(() => {
    const anchor = gestureAnchor.current ?? Math.round(raw.get());
    const drift = raw.get() - anchor;
    const target =
      Math.abs(drift) >= COMMIT_AT ? anchor + Math.sign(drift) : anchor;
    gestureAnchor.current = null;
    raw.set(target);
  }, [raw]);

  const scheduleSettle = useCallback(() => {
    clearTimeout(settleTimer.current);
    settleTimer.current = setTimeout(settle, SETTLE_DELAY);
  }, [settle]);

  const nudge = useCallback(
    (delta, capToGesture) => {
      if (gestureAnchor.current === null) {
        gestureAnchor.current = Math.round(raw.get());
      }
      let next = raw.get() + delta;
      if (capToGesture) {
        const a = gestureAnchor.current;
        next = Math.max(a - MAX_PER_GESTURE, Math.min(a + MAX_PER_GESTURE, next));
      }
      raw.set(next);
    },
    [raw]
  );

  /* Wheel + touch are bound by hand so they can be non-passive and stop the
     page from scrolling underneath the section. */
  useEffect(() => {
    const el = hostRef.current;
    if (!el) return undefined;

    const onWheel = (e) => {
      e.preventDefault();
      // clamp per event so a trackpad fling can't rip through the whole set
      const d = Math.max(-90, Math.min(90, e.deltaY));
      nudge(d / WHEEL_PX_PER_MEMORY, true);
      scheduleSettle();
    };

    let touchY = null;
    let lastY = 0;
    let lastT = 0;
    let vel = 0;

    const onTouchStart = (e) => {
      clearTimeout(settleTimer.current);
      touchY = e.touches[0].clientY;
      lastY = touchY;
      lastT = e.timeStamp;
      vel = 0;
      gestureAnchor.current = Math.round(raw.get());
    };

    const onTouchMove = (e) => {
      if (touchY === null) return;
      e.preventDefault();
      const yNow = e.touches[0].clientY;
      const dt = e.timeStamp - lastT;
      if (dt > 0) vel = (lastY - yNow) / dt; // px per ms, up-positive
      lastY = yNow;
      lastT = e.timeStamp;
      // 1:1 with the finger — the rim tracks the drag exactly
      raw.set(raw.get() + (touchY - yNow) / TOUCH_PX_PER_MEMORY);
      touchY = yNow;
    };

    const onTouchEnd = () => {
      if (touchY === null) return;
      touchY = null;
      // a quick flick still carries to the next memory
      if (Math.abs(vel) > 0.45) raw.set(raw.get() + Math.sign(vel) * 0.35);
      settle();
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    el.addEventListener("touchcancel", onTouchEnd, { passive: true });

    return () => {
      clearTimeout(settleTimer.current);
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [nudge, raw, scheduleSettle, settle]);

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown" || e.key === "PageDown") {
      e.preventDefault();
      raw.set(Math.round(raw.get()) + 1);
    } else if (e.key === "ArrowUp" || e.key === "PageUp") {
      e.preventDefault();
      raw.set(Math.round(raw.get()) - 1);
    }
  };

  /* Caption breathes with the turn instead of blinking on index change. */
  const capOpacity = useTransform(progress, (p) => {
    const f = Math.abs(p - Math.round(p));
    return 1 - Math.min(1, f * 2) * 0.55;
  });
  const capY = useTransform(progress, (p) => {
    const f = p - Math.round(p);
    return f * 10;
  });

  useEffect(() => {
    if (!onFinish) return undefined;
    return progress.on("change", (p) => {
      if (Math.abs(p) >= count - 0.5) setSeenAll(true);
    });
  }, [progress, count, onFinish]);

  const slots = useMemo(
    () => memories.map((m, i) => ({ m, i })),
    []
  );

  // Tight enough that the crescents stay near the print and the wheel
  // relationship stays legible, without crowding the type.
  const viewportH = Math.round(diameter * 1.42);

  return (
    <div
      ref={hostRef}
      role="group"
      tabIndex={0}
      aria-label="Memory wheel — scroll or swipe to turn"
      onKeyDown={onKeyDown}
      className="relative flex h-[100svh] w-full select-none flex-col items-center justify-center overflow-hidden px-5 text-ink outline-none"
      style={{ touchAction: "none", overscrollBehavior: "contain" }}
    >
      <ScrapbookBackdrop />

      {/* ── heading, with its little star ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-center"
      >
        <StarMark className="mb-2 text-rust/70 sm:mb-3" size={20} />
        <h2 className="font-hand text-3xl text-ink text-balance sm:text-[2.6rem]">
          Some moments, forever.
        </h2>
        <HeartRule className="mt-3 text-ink-faint sm:mt-4" width={140} />
      </motion.div>

      {/* ── the wheel ── */}
      <div className="relative w-full" style={{ height: viewportH }}>
        {slots.map(({ m, i }) => (
          <Slot
            key={i}
            memory={m}
            index={i}
            count={count}
            progress={progress}
            diameter={diameter}
            reduced={reduced}
          />
        ))}
      </div>

      {/* ── closing line, leaves either side ── */}
      <motion.div
        style={{ opacity: capOpacity, y: capY }}
        className="relative z-10 mt-1 flex flex-col items-center pb-10 sm:pb-12"
      >
        <HeartMark className="mb-2 text-rust/75" size={17} filled />
        <div className="flex items-center gap-3 sm:gap-4">
          <LeafMark className="text-sage/70" size={30} />
          <p className="font-hand text-2xl text-ink-soft sm:text-3xl">
            Good times. Better people.
          </p>
          <LeafMark className="text-sage/70" size={30} flip />
        </div>
      </motion.div>

      {/* Same line, same place — once the wheel has come full circle it turns
          into the way onward instead of the swipe hint. */}
      {seenAll && onFinish ? (
        <motion.button
          type="button"
          onClick={onFinish}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-x-0 bottom-5 z-10 mx-auto w-fit font-hand text-base text-ink-soft underline decoration-ink-faint/40 underline-offset-4 transition-colors hover:text-rust sm:bottom-7 sm:text-lg"
        >
          That&rsquo;s all of them — tap to finish ❤️
        </motion.button>
      ) : (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 0.85, 0.4] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
          className="absolute inset-x-0 bottom-5 z-10 text-center font-hand text-base text-ink-faint/90 sm:bottom-7 sm:text-lg"
        >
          Swipe to explore more memories
        </motion.p>
      )}
    </div>
  );
}
