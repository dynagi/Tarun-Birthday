import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Letter from "./Letter";
import { useMood } from "../shared/mood";

/* Opening beat sheet — ~2.4s from tap to letter. */
const T_FLAP_BEHIND = 340;
const T_LETTER = 2450;

export default function EnvelopeScene({ onDone }) {
  const [phase, setPhase] = useState("closed"); // closed → opening → letter
  const [flapBehind, setFlapBehind] = useState(false);
  const timers = useRef([]);

  // Warmer and calmer for the envelope; softer still once the letter is out,
  // so the paper stays the most readable thing on screen.
  useMood(phase === "letter" ? "letter" : "warm");

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function open() {
    if (phase !== "closed") return;
    setPhase("opening");
    timers.current = [
      setTimeout(() => setFlapBehind(true), T_FLAP_BEHIND),
      setTimeout(() => setPhase("letter"), T_LETTER),
    ];
  }

  const opening = phase === "opening";

  return (
    <motion.div
      className="relative flex w-full flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -30, filter: "blur(8px)", transition: { duration: 0.8, ease: "easeIn" } }}
      transition={{ duration: 0.6 }}
    >
      <AnimatePresence mode="wait">
        {phase !== "letter" ? (
          <motion.div
            key="envelope"
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 90, scale: 0.82, rotateX: 26 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, y: 130, scale: 0.86, transition: { duration: 0.75, ease: "easeIn" } }}
            transition={{ duration: 1.25, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformPerspective: 1200 }}
          >
            {/* gentle settle/float while it waits to be opened */}
            <motion.div
              animate={opening ? { y: 0 } : { y: [0, -9, 0] }}
              transition={
                opening
                  ? { duration: 0.4 }
                  : { duration: 4.5, repeat: Infinity, ease: "easeInOut" }
              }
            >
              <motion.button
                type="button"
                onClick={open}
                aria-label="Open the envelope"
                className="relative block w-[min(340px,84vw)] cursor-pointer"
                style={{ perspective: 1100 }}
                whileHover={opening ? undefined : { scale: 1.02 }}
                animate={opening ? { scale: [1, 0.965, 1] } : { scale: 1 }}
                transition={{ duration: 0.42, ease: "easeInOut" }}
              >
                <div className="relative aspect-[3/2] w-full" style={{ transformStyle: "preserve-3d" }}>
                  {/* drop shadow on the table */}
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-5 left-1/2 h-6 w-[86%] -translate-x-1/2 rounded-[50%] blur-xl"
                    style={{ background: "rgba(8,4,3,0.65)" }}
                  />

                  {/* 1 — inside back panel */}
                  <div
                    className="paper-texture absolute inset-0 rounded-[4px]"
                    style={{
                      background: "linear-gradient(160deg, #d8c8a8 0%, #c2ad88 100%)",
                      boxShadow: "inset 0 2px 14px rgba(72,52,30,0.35)",
                    }}
                  />

                  {/* 2 — the folded letter. Sits entirely inside the pocket
                         (which covers 38%–100%) so nothing peeks out below. */}
                  <motion.div
                    className="paper-texture absolute left-[7%] top-[42%] h-[54%] w-[86%] rounded-[2px]"
                    style={{
                      zIndex: 1,
                      background: "linear-gradient(170deg, #f6efe0 0%, #ece2ce 100%)",
                      boxShadow: "0 -6px 18px -6px rgba(20,12,6,0.45)",
                    }}
                    initial={{ y: "0%" }}
                    animate={opening ? { y: "-128%", rotate: [0, -1.6, 0.7] } : { y: "0%" }}
                    transition={{
                      duration: 1.35,
                      delay: opening ? 0.62 : 0,
                      ease: [0.33, 1, 0.5, 1],
                    }}
                  >
                    {/* faint ruled lines so it reads as a written page */}
                    <div
                      className="absolute inset-x-4 top-3 bottom-3 opacity-[0.3]"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(to bottom, transparent 0 8px, #a8977c 8px 9px)",
                      }}
                    />
                  </motion.div>

                  {/* 3 — front pocket, the letter slides out from behind this */}
                  <div
                    className="paper-texture absolute inset-x-0 bottom-0 h-[62%] rounded-b-[4px]"
                    style={{
                      zIndex: 2,
                      background: "linear-gradient(168deg, #eee0c0 0%, #dfcda6 55%, #d3bf95 100%)",
                      boxShadow: "0 -4px 16px -6px rgba(40,24,10,0.4)",
                    }}
                  >
                    <span
                      className="absolute inset-x-0 top-0 h-px"
                      style={{ background: "rgba(255,255,255,0.5)" }}
                    />
                  </div>

                  {/* 4 — flap */}
                  <motion.div
                    className="paper-texture absolute inset-x-0 top-0 h-[54%] origin-top"
                    style={{
                      zIndex: flapBehind ? 0 : 3,
                      clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                      background: "linear-gradient(170deg, #f0e3c4 0%, #ddc9a0 100%)",
                      backfaceVisibility: "visible",
                      transformStyle: "preserve-3d",
                    }}
                    initial={{ rotateX: 0 }}
                    animate={{ rotateX: opening ? -172 : 0 }}
                    transition={{ duration: 0.95, delay: opening ? 0.16 : 0, ease: [0.5, 0, 0.2, 1] }}
                  >
                    <span
                      className="absolute inset-0"
                      style={{
                        clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                        background:
                          "linear-gradient(180deg, rgba(90,60,26,0.06) 0%, rgba(90,60,26,0.22) 100%)",
                      }}
                    />
                  </motion.div>

                  {/* wax seal, sitting on the flap tip */}
                  <motion.span
                    className="absolute left-1/2 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full sm:h-10 sm:w-10"
                    style={{
                      top: "46%",
                      zIndex: flapBehind ? 0 : 4,
                      background: "radial-gradient(circle at 34% 30%, #c96f5a 0%, #8e3f2c 72%)",
                      boxShadow: "0 3px 10px -2px rgba(20,8,4,0.7), inset 0 -2px 4px rgba(0,0,0,0.28)",
                    }}
                    animate={{ opacity: opening ? 0 : 1, scale: opening ? 0.7 : 1 }}
                    transition={{ duration: 0.45 }}
                  >
                    <span className="font-display text-sm text-[#f4dcc9] sm:text-base">T</span>
                  </motion.span>
                </div>
              </motion.button>
            </motion.div>

            <AnimatePresence>
              {!opening && (
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: [0.5, 0.95, 0.5], y: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0.3 } }}
                  transition={{
                    opacity: { duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0.9 },
                    y: { duration: 0.7, delay: 0.9 },
                  }}
                  className="mt-10 font-hand text-2xl text-eve-ember sm:text-3xl"
                >
                  Open it
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <Letter key="letter" onFinished={onDone} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
