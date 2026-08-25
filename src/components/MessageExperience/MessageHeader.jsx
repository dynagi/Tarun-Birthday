import { motion } from "framer-motion";

export default function MessageHeader({ text }) {
  return (
    <div className="relative flex flex-col items-center text-center px-6 pt-28 pb-16 sm:pt-36 sm:pb-20">
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="font-hand text-xl sm:text-2xl text-sage mb-2"
      >
        a small letter, before the surprise
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.15 }}
        className="font-display text-4xl sm:text-6xl tracking-wide text-ink text-balance"
      >
        {text}
      </motion.h1>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: 72 }}
        transition={{ duration: 0.9, delay: 0.6 }}
        className="h-px bg-ink-faint mt-6"
      />
    </div>
  );
}
