import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ChocolateCake from "./ChocolateCake";
import PaperConfetti from "./PaperConfetti";
import { useMood } from "../shared/mood";

/* Beat sheet for the blow, ~2.4s end to end. */
const T_FLICKER = 0;
const T_OUT = 750;
const T_SPARKLE = 1100;
const T_NEXT = 3100;

function Sparkles() {
  const spec = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2 + Math.random() * 0.4;
        const dist = 90 + Math.random() * 80;
        return {
          id: i,
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist * 0.72 - 30,
          delay: Math.random() * 0.35,
          size: 9 + Math.random() * 7,
        };
      }),
    []
  );

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      {spec.map((s) => (
        <motion.span
          key={s.id}
          className="absolute select-none text-eve-ember"
          style={{ fontSize: s.size }}
          initial={{ opacity: 0, scale: 0.2, x: 0, y: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0.2, 1, 0.5], x: s.x, y: s.y }}
          transition={{ duration: 1.5, delay: s.delay, ease: "easeOut" }}
        >
          ✦
        </motion.span>
      ))}
    </div>
  );
}

export default function CakeScene({ onDone }) {
  const [flame, setFlame] = useState("lit"); // lit → flicker → out
  const [sparkle, setSparkle] = useState(false);
  const timers = useRef([]);

  // Room calms so the cake carries the scene; it stirs again on the blow.
  useMood(sparkle ? "festive" : "focus");

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function blow() {
    if (flame !== "lit") return;
    timers.current = [
      setTimeout(() => setFlame("flicker"), T_FLICKER),
      setTimeout(() => setFlame("out"), T_OUT),
      setTimeout(() => setSparkle(true), T_SPARKLE),
      setTimeout(() => onDone?.(), T_NEXT),
    ];
  }

  const done = flame === "out";

  return (
    <motion.div
      className="relative flex w-full flex-col items-center justify-center text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: 26, scale: 0.96, filter: "blur(7px)" }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
    >
      {/* a few pieces drift down once the wish is made */}
      <PaperConfetti drift={sparkle} />

      <div className="relative">
        {sparkle && <Sparkles />}

        {/* warm pool of light the cake sits in */}
        <motion.span
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{
            width: "min(420px, 86vw)",
            height: "min(300px, 40vh)",
            background:
              "radial-gradient(circle, rgba(240,180,95,0.28) 0%, transparent 70%)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: done ? 0.5 : [0.75, 1, 0.75] }}
          transition={
            done
              ? { duration: 1.2 }
              : { duration: 5, repeat: Infinity, ease: "easeInOut" }
          }
        />

        <motion.div
          className="relative w-[min(330px,82vw)] sm:w-[400px]"
          initial={{ y: 150, scale: 0.72, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          transition={{
            duration: 1.15,
            ease: [0.16, 1, 0.3, 1],
            scale: { type: "spring", stiffness: 130, damping: 13, mass: 0.9, delay: 0.1 },
          }}
        >
          <ChocolateCake state={flame} className="h-auto w-full" />
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.85, delay: 0.95, ease: [0.16, 1, 0.3, 1] }}
        className="mt-6 font-display italic text-xl text-eve-cream text-balance sm:mt-7 sm:text-2xl"
      >
        Make a wish and blow the candles
      </motion.p>

      <div className="mt-7 flex h-[58px] items-center justify-center">
        <AnimatePresence mode="wait">
          {!done ? (
            <motion.button
              key="blow"
              type="button"
              onClick={blow}
              disabled={flame !== "lit"}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.3 } }}
              transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
              className="group relative overflow-hidden rounded-full border border-eve-ember/45 bg-gradient-to-b from-[#3a2418] to-[#241610] px-8 py-3.5 font-sport-body text-base font-medium tracking-[0.06em] text-eve-cream shadow-[0_14px_34px_-12px_rgba(240,180,95,0.55)] transition-colors hover:border-eve-ember/80 disabled:cursor-default sm:px-10"
            >
              <span
                className="pointer-events-none absolute inset-x-0 -top-px h-px"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(245,234,214,0.55), transparent)",
                }}
              />
              Blow the Candles 🕯️
            </motion.button>
          ) : (
            <motion.p
              key="done"
              initial={{ opacity: 0, y: 10, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "backOut" }}
              className="font-hand text-2xl text-eve-ember sm:text-3xl"
            >
              Wish made ✨
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
