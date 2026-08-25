import { motion } from "framer-motion";
import { memoryMatches } from "../../data/content";

const toneColor = {
  good: "text-amber",
  bad: "text-card-red",
  neutral: "text-chalk",
};

function MatchCard({ item, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      className="rounded-lg border border-chalk/10 bg-black/25 backdrop-blur-sm px-5 py-5 sm:px-6 sm:py-6"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="font-sport-body text-[10px] tracking-[0.25em] text-chalk/40">
          MATCH {String(index + 1).padStart(2, "0")}
        </span>
        <span className="text-lg">⚽</span>
      </div>
      <h3 className="font-sport text-lg sm:text-xl text-chalk tracking-wide">{item.title}</h3>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="font-sport-body text-[10px] tracking-[0.2em] text-chalk/40">{item.label}</span>
        <span className={`font-sport-body font-semibold tracking-wide text-sm sm:text-base ${toneColor[item.tone]}`}>
          {item.value}
        </span>
      </div>
    </motion.div>
  );
}

export default function MemorySection() {
  return (
    <section className="relative min-h-[100svh] flex flex-col items-center justify-center px-6 py-24">
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="font-sport text-3xl sm:text-4xl text-chalk tracking-wide text-center mb-2"
      >
        THE SEASON SO FAR
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="font-sport-body text-chalk/45 text-xs sm:text-sm tracking-[0.2em] text-center mb-12"
      >
        MATCH REPORT — LAST SIX MONTHS
      </motion.p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 max-w-3xl w-full">
        {memoryMatches.map((item, i) => (
          <div key={item.title} className={i === memoryMatches.length - 1 ? "sm:col-span-2" : ""}>
            <MatchCard item={item} index={i} />
          </div>
        ))}
      </div>
    </section>
  );
}
