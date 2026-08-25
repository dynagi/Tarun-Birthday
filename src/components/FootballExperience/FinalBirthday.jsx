import { motion } from "framer-motion";
import { FlipDigits } from "./Scoreboard";
import GoalAnimation from "./GoalAnimation";
import Confetti from "../shared/Confetti";

export default function FinalBirthday() {
  return (
    <section className="relative min-h-[100svh] flex flex-col items-center justify-center px-6 py-24 text-center overflow-hidden">
      <Confetti count={50} />

      <motion.p
        initial={{ opacity: 0, letterSpacing: "0em" }}
        whileInView={{ opacity: 1, letterSpacing: "0.35em" }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="font-sport-body text-chalk/50 text-xs sm:text-sm mb-6"
      >
        FULL TIME
      </motion.p>

      <div className="flex items-center gap-3 sm:gap-5">
        <span className="font-sport text-2xl sm:text-4xl text-chalk tracking-wide">TARUN</span>
        <FlipDigits
          value={23}
          className=""
          digitClassName="font-sport text-3xl sm:text-5xl text-amber tabular-nums"
        />
        <span className="font-sport text-2xl sm:text-4xl text-chalk/50">—</span>
        <span className="font-sport text-2xl sm:text-4xl text-chalk tracking-wide">LIFE</span>
        <FlipDigits
          value={1}
          delay={0.3}
          digitClassName="font-sport text-3xl sm:text-5xl text-chalk/70 tabular-nums"
        />
      </div>

      <GoalAnimation />

      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.9 }}
        className="font-display italic text-3xl sm:text-5xl text-floodlight text-balance mt-4"
      >
        Happy Birthday, Tarun! 🎂⚽
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="font-body text-chalk/60 text-base sm:text-lg mt-5 max-w-md text-balance"
      >
        May the next season of your life be your best one yet.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.5 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.8 }}
        className="font-hand text-lg text-amber/70 mt-10"
      >
        — with love, from your fellow survivor
      </motion.div>
    </section>
  );
}
