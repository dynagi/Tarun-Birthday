import { useMemo, useRef } from "react";
import { motion, useInView } from "framer-motion";

const COLORS = ["#FFB627", "#F3F1E7", "#164F38", "#B23A2E", "#CFE8D8"];

export default function Confetti({ count = 40 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        duration: Math.random() * 1.6 + 2.2,
        rotate: Math.random() * 360,
        color: COLORS[i % COLORS.length],
        size: Math.random() * 6 + 5,
        drift: Math.random() * 60 - 30,
      })),
    [count]
  );

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {inView &&
        pieces.map((p) => (
          <motion.span
            key={p.id}
            initial={{ y: "-10%", x: 0, opacity: 1, rotate: 0 }}
            animate={{ y: "120%", x: p.drift, opacity: [1, 1, 0], rotate: p.rotate }}
            transition={{ duration: p.duration, delay: p.delay, ease: "easeIn" }}
            style={{
              position: "absolute",
              left: `${p.left}%`,
              width: p.size,
              height: p.size * 0.4,
              background: p.color,
              borderRadius: 1,
            }}
          />
        ))}
    </div>
  );
}
