import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import PaperConfetti from "./PaperConfetti";
import { useMood } from "../shared/mood";

const LAND_MS = 560; // the moment the headline settles
const HOLD_MS = 2900; // time to enjoy it before the cake arrives

export default function BirthdayBurst({ onDone }) {
  useMood("festive"); // strongest the room ever gets — balloons released
  const [landed, setLanded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLanded(true), LAND_MS);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!landed) return;
    const t = setTimeout(() => onDone?.(), HOLD_MS);
    return () => clearTimeout(t);
  }, [landed, onDone]);

  return (
    <motion.div
      className="relative flex w-full flex-1 items-center justify-center self-stretch text-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.97, filter: "blur(6px)" }}
      transition={{ duration: 0.55, ease: "easeInOut" }}
    >
      <PaperConfetti fire={landed} drift={landed} originY={0.46} />

      {/* bloom behind the words, timed to the landing */}
      <motion.span
        className="pointer-events-none absolute rounded-full blur-3xl"
        style={{
          width: "min(620px, 92vw)",
          height: "min(360px, 46vh)",
          background:
            "radial-gradient(circle, rgba(240,180,95,0.34) 0%, transparent 70%)",
        }}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: [0, 0.95, 0.55], scale: [0.6, 1.12, 1] }}
        transition={{ duration: 1.5, delay: LAND_MS / 1000 - 0.18, ease: "easeOut" }}
      />

      <div className="relative px-2">
        <motion.h1
          initial={{ opacity: 0, scale: 0.7, filter: "blur(18px)", y: 10 }}
          animate={{
            opacity: 1,
            scale: [0.7, 1.07, 0.975, 1],
            filter: "blur(0px)",
            y: 0,
          }}
          transition={{
            duration: 1.05,
            ease: [0.16, 1, 0.3, 1],
            scale: { duration: 1.05, times: [0, 0.5, 0.78, 1], ease: "easeOut" },
          }}
          className="font-display text-[2.7rem] leading-[1.05] text-eve-cream text-balance sm:text-6xl md:text-7xl drop-shadow-[0_8px_40px_rgba(240,180,95,0.28)]"
        >
          Happy Birthday
          <br />
          <span className="italic text-eve-ember">Broo</span>
        </motion.h1>

        <motion.div
          className="mx-auto mt-6 h-px w-0 bg-gradient-to-r from-transparent via-eve-ember/60 to-transparent"
          animate={{ width: "min(260px, 60vw)" }}
          transition={{ duration: 1, delay: LAND_MS / 1000 + 0.15, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </motion.div>
  );
}
