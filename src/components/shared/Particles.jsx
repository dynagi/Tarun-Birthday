import { useMemo } from "react";
import { motion } from "framer-motion";

export default function Particles({ count = 18, color = "var(--color-ink-faint)", className = "" }) {
  const dots = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 2.4 + 1,
        duration: Math.random() * 14 + 14,
        delay: Math.random() * -20,
        drift: Math.random() * 30 - 15,
      })),
    [count]
  );

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {dots.map((d) => (
        <motion.span
          key={d.id}
          className="absolute rounded-full"
          style={{
            left: `${d.left}%`,
            top: `${d.top}%`,
            width: d.size,
            height: d.size,
            background: color,
            opacity: 0.35,
          }}
          animate={{
            y: [0, -18, 0],
            x: [0, d.drift, 0],
            opacity: [0.15, 0.45, 0.15],
          }}
          transition={{
            duration: d.duration,
            delay: d.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
