import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function GoalAnimation() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });

  return (
    <div ref={ref} className="relative flex items-center justify-center h-28 sm:h-36">
      {inView && (
        <>
          <motion.div
            initial={{ opacity: 0.5, scale: 0.4 }}
            animate={{ opacity: 0, scale: 3 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute w-24 h-24 rounded-full bg-amber/40 blur-2xl"
          />
          <motion.h2
            initial={{ opacity: 0, scale: 2.2, rotate: -6 }}
            animate={{ opacity: 1, scale: 1, rotate: -4 }}
            transition={{ duration: 0.55, ease: "backOut" }}
            className="font-sport text-5xl sm:text-7xl text-amber tracking-wider drop-shadow-[0_4px_20px_rgba(255,182,39,0.5)]"
          >
            GOAL!
          </motion.h2>
        </>
      )}
    </div>
  );
}
