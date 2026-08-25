import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

function TypewriterLine({ text, className }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => {
      setTyped((n) => {
        if (n >= text.length) {
          clearInterval(id);
          return n;
        }
        return n + 1;
      });
    }, 32);
    return () => clearInterval(id);
  }, [inView, text]);

  return (
    <p ref={ref} className={className}>
      {text.slice(0, typed)}
      {inView && typed < text.length && (
        <span className="inline-block w-[2px] h-[0.9em] bg-ink-soft ml-0.5 animate-pulse align-middle" />
      )}
    </p>
  );
}

export default function MessageParagraph({ block }) {
  const { type, text, underline } = block;

  if (type === "typewriter") {
    return (
      <div className="max-w-xl mx-auto px-6 py-6 sm:py-8 text-center">
        <TypewriterLine
          text={text}
          className="font-display italic text-2xl sm:text-3xl text-ink-soft"
        />
      </div>
    );
  }

  if (type === "final") {
    return (
      <div className="max-w-xl mx-auto px-6 pt-6 pb-32 sm:pb-40 text-center">
        <TypewriterLine
          text={text}
          className="font-sport-body text-3xl sm:text-4xl tracking-[0.15em] text-sage uppercase"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6, type: "spring" }}
          className="mt-4 text-3xl"
        >
          ⚽
        </motion.div>
      </div>
    );
  }

  if (type === "stamp") {
    return (
      <div className="flex justify-center px-6 py-10 sm:py-14">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
          whileInView={{ opacity: 1, scale: 1, rotate: -6 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.7, ease: "backOut" }}
          className="border-2 border-rust/70 rounded-sm px-5 py-3 text-rust font-hand text-xl sm:text-2xl tracking-wide"
          style={{ boxShadow: "0 0 0 3px transparent" }}
        >
          {text}
        </motion.div>
      </div>
    );
  }

  if (type === "birthday") {
    return (
      <div className="max-w-2xl mx-auto px-6 py-10 sm:py-14 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.9 }}
          className="font-display text-4xl sm:text-6xl text-ink text-balance"
        >
          {text}
        </motion.h2>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="h-[3px] w-40 sm:w-56 bg-sage/50 mx-auto mt-5 origin-left rounded-full"
        />
      </div>
    );
  }

  // default paragraph
  return (
    <div className="max-w-xl mx-auto px-6 py-5 sm:py-7">
      <motion.p
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15% 0px" }}
        transition={{ duration: 0.75, ease: "easeOut" }}
        className="font-body text-lg sm:text-xl leading-relaxed text-ink-soft text-balance"
      >
        {text}
      </motion.p>
      {underline && (
        <motion.svg
          viewBox="0 0 300 12"
          className="w-40 sm:w-52 h-3 mt-1"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.6 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8, ease: "easeInOut" }}
        >
          <path
            d="M4 8 C 80 2, 220 12, 296 4"
            fill="none"
            stroke="var(--color-rust)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </motion.svg>
      )}
    </div>
  );
}
