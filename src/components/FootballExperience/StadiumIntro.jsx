import { motion } from "framer-motion";
import Scoreboard from "./Scoreboard";

export default function StadiumIntro() {
  return (
    <section className="relative min-h-[100svh] flex flex-col items-center justify-center px-6 py-16 sm:py-24 text-center">
      <motion.p
        initial={{ opacity: 0, letterSpacing: "0.05em" }}
        animate={{ opacity: 1, letterSpacing: "0.35em" }}
        transition={{ duration: 1.2, delay: 1.6 }}
        className="font-sport-body text-amber/80 text-xs sm:text-sm mb-5 sm:mb-8"
      >
        WELCOME TO THE STADIUM
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, delay: 1.9, ease: "easeOut" }}
      >
        <Scoreboard />
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 2.9 }}
        className="font-sport-body tracking-[0.25em] text-chalk/60 text-sm sm:text-base mt-6 sm:mt-10"
      >
        26 AUGUST 2026
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 3.3 }}
        className="font-sport text-2xl sm:text-5xl text-chalk tracking-wide mt-2 sm:mt-3"
      >
        THE BIRTHDAY MATCH
      </motion.h2>

      <motion.h3
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 3.9 }}
        className="font-display italic text-xl sm:text-4xl text-amber mt-4 sm:mt-6 text-balance"
      >
        Happy 23rd Birthday, Tarun! 🎂⚽
      </motion.h3>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0.4] }}
        transition={{ duration: 2, delay: 5, repeat: Infinity, repeatType: "reverse" }}
        className="static sm:absolute sm:bottom-8 flex flex-col items-center gap-2 text-chalk/50 mt-8 sm:mt-0"
      >
        <span className="font-sport-body text-[10px] tracking-[0.3em]">SCROLL FOR KICK-OFF</span>
        <span className="text-lg">↓</span>
      </motion.div>
    </section>
  );
}
