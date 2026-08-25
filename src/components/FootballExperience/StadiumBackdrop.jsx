import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

function Floodlight({ style, delay }) {
  return (
    <motion.div
      className="absolute rounded-full blur-3xl"
      style={style}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.55 }}
      transition={{ duration: 0.5, delay }}
    />
  );
}

export default function StadiumBackdrop({ scrollRef, litUp = true }) {
  const { scrollYProgress } = useScroll({ container: scrollRef });
  const ballX = useTransform(scrollYProgress, [0, 1], ["0%", "340%"]);
  const ballRotate = useTransform(scrollYProgress, [0, 1], [0, 1080]);

  const [crowd] = useState(() =>
    Array.from({ length: 60 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 3 + 2,
      opacity: Math.random() * 0.25 + 0.08,
    }))
  );

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-pitch-dark">
      {/* pitch gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 15%, #0f4530 0%, #0b301f 45%, #05201a 100%)",
        }}
      />

      {/* crowd silhouette texture (top band) */}
      <div className="absolute inset-x-0 top-0 h-[18%] overflow-hidden opacity-70">
        {crowd.map((c, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-black"
            style={{
              left: `${c.left}%`,
              top: `${c.top}%`,
              width: c.size,
              height: c.size,
              opacity: c.opacity,
            }}
          />
        ))}
      </div>

      {litUp && (
        <>
          <Floodlight
            style={{ top: "-10%", left: "-6%", width: 320, height: 320, background: "var(--color-floodlight)" }}
            delay={0.1}
          />
          <Floodlight
            style={{ top: "-10%", right: "-6%", width: 320, height: 320, background: "var(--color-floodlight)" }}
            delay={0.4}
          />
          <Floodlight
            style={{ top: "-14%", left: "40%", width: 260, height: 260, background: "var(--color-amber)" }}
            delay={0.7}
          />
        </>
      )}

      {/* pitch markings */}
      <div className="absolute inset-x-0 bottom-0 h-[55%] opacity-[0.16]">
        <div className="absolute inset-x-6 sm:inset-x-16 top-0 bottom-0 border-2 border-pitch-line rounded-t-[2rem]" />
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-pitch-line -translate-x-1/2" />
        <div className="absolute left-1/2 top-1/3 w-28 h-28 sm:w-40 sm:h-40 border-2 border-pitch-line rounded-full -translate-x-1/2" />
      </div>

      {/* parallax rolling ball tied to scroll */}
      <motion.div
        className="absolute top-[70%] left-[2%] text-3xl sm:text-4xl opacity-70"
        style={{ x: ballX, rotate: ballRotate }}
      >
        ⚽
      </motion.div>
    </div>
  );
}
