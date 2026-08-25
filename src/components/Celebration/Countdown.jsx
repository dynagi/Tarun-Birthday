import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useMood } from "../shared/mood";

const NUMBERS = ["3", "2", "1"];

/* Radiating energy spokes — read as motion, not as decoration. */
function Spokes({ hot }) {
  const spokes = useMemo(
    () => Array.from({ length: 10 }, (_, i) => (i / 10) * 360),
    []
  );
  // Rotation lives on a zero-size anchor at the centre; the bar then translates
  // along that rotated axis, so every spoke flies straight outward.
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      {spokes.map((deg, i) => (
        <span
          key={`${hot}-${i}`}
          className="absolute h-0 w-0"
          style={{ transform: `rotate(${deg}deg)` }}
        >
          <motion.span
            className="absolute left-0 top-0 block h-[2px] rounded-full bg-eve-ember"
            style={{ width: 46, marginTop: -1, transformOrigin: "0% 50%" }}
            initial={{ scaleX: 0.2, x: 34, opacity: 0 }}
            animate={{ scaleX: [0.2, 1, 0.4], x: [34, 96, 128], opacity: [0, 0.55, 0] }}
            transition={{ duration: 0.8, delay: i * 0.012, ease: "easeOut" }}
          />
        </span>
      ))}
    </div>
  );
}

export default function Countdown({ onDone }) {
  // -1 → lead-in copy, 0..2 → "3","2","1", 3 → anticipation beat
  const [step, setStep] = useState(-1);

  // The room gets steadily more excited as the count tightens.
  useMood(step < 0 ? "football" : step < 2 ? "energy" : "surge");

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(0), 1650),
      setTimeout(() => setStep(1), 2600),
      setTimeout(() => setStep(2), 3550),
      setTimeout(() => setStep(3), 4750),
      setTimeout(() => onDone?.(), 5350),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  const isLast = step === 2;

  return (
    <motion.div
      className="relative flex w-full flex-col items-center justify-center text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.97, filter: "blur(6px)" }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <motion.p
        initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="font-display italic text-2xl sm:text-3xl md:text-4xl text-eve-cream text-balance max-w-xl"
      >
        Perfect! You really know your football ⚽❤️
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.8, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="mt-4 font-hand text-3xl sm:text-4xl text-eve-ember"
      >
        Let&rsquo;s goo now
      </motion.p>

      {/* Fixed-height stage so the numbers never nudge the copy above them */}
      <div className="relative mt-8 flex h-[168px] w-full items-center justify-center sm:mt-10 sm:h-[210px]">
        <AnimatePresence mode="wait">
          {step >= 0 && step <= 2 && (
            <motion.div
              key={NUMBERS[step]}
              className="relative flex items-center justify-center"
              initial={{ opacity: 0, scale: isLast ? 0.28 : 0.45, filter: "blur(12px)" }}
              animate={{
                opacity: 1,
                scale: isLast ? [0.28, 1.16, 0.98, 1.04] : [0.45, 1.08, 1],
                filter: "blur(0px)",
              }}
              exit={{
                opacity: 0,
                scale: isLast ? 1.9 : 1.32,
                filter: "blur(10px)",
                transition: { duration: isLast ? 0.5 : 0.34, ease: "easeIn" },
              }}
              transition={{
                duration: isLast ? 0.62 : 0.46,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <Spokes hot={step} />

              {/* expanding ring */}
              <motion.span
                className="absolute rounded-full border border-eve-ember/45"
                style={{ width: 150, height: 150 }}
                initial={{ scale: 0.4, opacity: 0.7 }}
                animate={{ scale: isLast ? 2.1 : 1.7, opacity: 0 }}
                transition={{ duration: isLast ? 0.95 : 0.75, ease: "easeOut" }}
              />
              <span
                className="absolute rounded-full blur-2xl"
                style={{
                  width: 190,
                  height: 190,
                  background:
                    "radial-gradient(circle, rgba(240,180,95,0.34) 0%, transparent 70%)",
                }}
              />

              <span className="relative font-sport text-[7rem] leading-none text-eve-cream tabular-nums sm:text-[9.5rem] drop-shadow-[0_6px_30px_rgba(240,180,95,0.35)]">
                {NUMBERS[step]}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
