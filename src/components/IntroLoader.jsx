import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LINE = "for tarun,";
const SUBLINE = "with six months of chaos & chai —";

export default function IntroLoader({ onDone }) {
  const [typed, setTyped] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const step = setInterval(() => {
      setTyped((n) => (n < LINE.length ? n + 1 : n));
    }, 55);

    const leaveTimer = setTimeout(() => setLeaving(true), 1900);
    const doneTimer = setTimeout(() => onDone?.(), 2500);

    return () => {
      clearInterval(step);
      clearTimeout(leaveTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <AnimatePresence>
      {!leaving && (
        <motion.div
          key="loader"
          exit={{ opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-paper text-ink"
        >
          <div className="grain absolute inset-0" />
          <div className="relative flex flex-col items-center gap-3 px-6 text-center">
            <p className="font-hand text-2xl sm:text-3xl text-ink-soft tracking-wide">
              {SUBLINE}
            </p>
            <p className="font-display text-3xl sm:text-4xl tracking-wide">
              {LINE.slice(0, typed)}
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
                className="inline-block w-[2px] h-[1em] bg-ink align-middle ml-1 translate-y-[2px]"
              />
            </p>
          </div>

          <motion.div
            className="absolute bottom-14 h-px bg-ink-faint/40"
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
