import { useEffect } from "react";
import { motion } from "framer-motion";

export default function TransitionScene({ onDone }) {
  useEffect(() => {
    const t = setTimeout(() => onDone?.(), 2600);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-paper">
      {/* rolling football */}
      <motion.div
        initial={{ x: "-10vw", opacity: 1 }}
        animate={{ x: "110vw", rotate: 900 }}
        transition={{ duration: 1.4, ease: "easeIn" }}
        className="absolute top-1/2 -translate-y-1/2 text-6xl sm:text-7xl"
      >
        ⚽
      </motion.div>

      {/* wipe to stadium dark */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.1, delay: 1.05, ease: [0.76, 0, 0.24, 1] }}
        style={{ originX: 0 }}
        className="absolute inset-0 bg-pitch-dark"
      />

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ duration: 1.3, delay: 1.3, times: [0, 0.25, 0.75, 1] }}
        className="absolute inset-0 flex items-center justify-center font-sport text-floodlight text-3xl sm:text-5xl tracking-[0.2em]"
      >
        KICK-OFF
      </motion.p>
    </div>
  );
}
