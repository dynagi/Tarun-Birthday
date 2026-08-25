import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { birthdayLetter } from "../../data/letterContent";

const LEAD = 550; // pause after the paper settles
const STEP = 300; // gap between paragraphs
const BEAT_STEP = 480; // the closing lines land a little slower
const TOTAL = birthdayLetter.length;
const FIRST_BEAT = birthdayLetter.findIndex((b) => b.type === "beat");

const HIDDEN = { opacity: 0, y: 12, filter: "blur(4px)" };
const SHOWN = { opacity: 1, y: 0, filter: "blur(0px)" };

function blockClass(type) {
  switch (type) {
    case "heading":
      return "font-display text-2xl sm:text-3xl text-ink mb-6";
    case "stamp":
      return "font-hand text-xl sm:text-2xl text-rust text-center my-8";
    case "highlight":
      return "font-display italic text-2xl sm:text-3xl text-rust text-center my-8 text-balance";
    case "beat":
      return "font-display italic text-lg sm:text-xl text-ink text-center my-3";
    case "final":
      return "font-sport-body uppercase tracking-[0.16em] text-xl sm:text-2xl text-sage text-center mt-6";
    default:
      return "font-body text-[1.0625rem] sm:text-lg leading-[1.9] text-ink-soft mb-6";
  }
}

export default function Letter({ onFinished }) {
  // Reveal is driven by state, not by staggered transition delays: Framer only
  // restarts an animation when the *target* changes, so "Show all" has to move
  // paragraphs from the hidden target to the shown one to take effect.
  const [shown, setShown] = useState(0);
  const [atEnd, setAtEnd] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (shown >= TOTAL) return;
    const gap = shown === 0 ? LEAD : shown >= FIRST_BEAT ? BEAT_STEP : STEP;
    const t = setTimeout(() => setShown((n) => n + 1), gap);
    return () => clearTimeout(t);
  }, [shown]);

  const done = shown >= TOTAL;

  // A short letter on a tall screen never scrolls, so treat that as "read".
  useEffect(() => {
    const el = scrollRef.current;
    if (el && el.scrollHeight - el.clientHeight < 24) setAtEnd(true);
  }, []);

  function handleScroll(e) {
    const el = e.currentTarget;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 48) setAtEnd(true);
  }

  // Only move on once the closing lines have been revealed *and* actually
  // scrolled to — otherwise the letter would vanish mid-read.
  useEffect(() => {
    if (!done || !atEnd || !onFinished) return;
    const t = setTimeout(onFinished, 2600);
    return () => clearTimeout(t);
  }, [done, atEnd, onFinished]);

  return (
    <motion.div
      className="relative w-[min(660px,94vw)]"
      initial={{ opacity: 0, y: 46, scale: 0.9, rotateX: 12 }}
      animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      style={{ transformPerspective: 1400 }}
    >
      {/* a second sheet behind, so it reads as a stack of paper */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 rounded-[3px] bg-paper-deep"
        style={{ transform: "rotate(-1.1deg) translate(5px, 6px)", opacity: 0.55 }}
      />

      <div
        className="paper-texture relative overflow-hidden rounded-[3px] shadow-[0_30px_70px_-24px_rgba(10,6,4,0.85)]"
        style={{
          background: "linear-gradient(168deg, #f6efe0 0%, #efe7d8 42%, #e6dbc6 100%)",
          transform: "rotate(-0.35deg)",
        }}
      >
        {/* soft inner edge shading, like light falling across paper */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            boxShadow:
              "inset 0 0 42px rgba(120,96,64,0.16), inset 0 1px 0 rgba(255,255,255,0.6)",
          }}
        />

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="max-h-[min(66svh,620px)] overflow-y-auto overscroll-contain px-6 py-9 sm:px-12 sm:py-12"
        >
          {birthdayLetter.map((block, i) => (
            <motion.p
              key={i}
              className={blockClass(block.type)}
              initial={HIDDEN}
              animate={i < shown ? SHOWN : HIDDEN}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              {block.text}
            </motion.p>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {!done && (
          <motion.button
            type="button"
            onClick={() => setShown(TOTAL)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="absolute -bottom-11 left-1/2 -translate-x-1/2 rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-eve-cream/45 transition-colors hover:text-eve-ember"
          >
            Show all
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
