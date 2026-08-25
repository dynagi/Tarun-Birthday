import { motion } from "framer-motion";

export default function MessageEnd({ visible, onContinue }) {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: visible ? 1 : 0, pointerEvents: visible ? "auto" : "none" }}
      transition={{ duration: 0.9 }}
      className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-paper/95 backdrop-blur-sm"
    >
      <div className="grain absolute inset-0" />
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="relative flex flex-col items-center gap-6 px-6 text-center"
      >
        <p className="font-display italic text-2xl sm:text-3xl text-ink">
          Ready for the next one?
        </p>

        <motion.button
          onClick={onContinue}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          animate={{ y: [0, -8, 0], rotate: [0, 8, -8, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          aria-label="Continue to the birthday surprise"
          className="text-5xl sm:text-6xl cursor-pointer select-none"
        >
          ⚽
        </motion.button>

        <motion.span
          initial={{ opacity: 0 }}
          animate={visible ? { opacity: 0.6 } : { opacity: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="font-hand text-lg text-ink-faint"
        >
          tap the ball
        </motion.span>
      </motion.div>
    </motion.div>
  );
}
