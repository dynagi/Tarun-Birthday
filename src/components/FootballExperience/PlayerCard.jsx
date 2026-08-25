import { motion } from "framer-motion";
import { player } from "../../data/content";

function Stat({ label, value }) {
  return (
    <div className="text-center">
      <p className="font-sport-body text-[10px] sm:text-xs tracking-[0.25em] text-chalk/45">{label}</p>
      <p className="font-sport text-base sm:text-xl text-chalk mt-1">{value}</p>
    </div>
  );
}

export default function PlayerCard() {
  return (
    <section className="relative min-h-[100svh] flex flex-col items-center justify-center px-6 py-24">
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="font-sport-body text-amber/70 tracking-[0.3em] text-xs sm:text-sm mb-8"
      >
        STARTING LINE-UP
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 40, rotateY: -12 }}
        whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        whileHover={{ rotateY: 6, rotateX: -4, scale: 1.02 }}
        style={{ transformStyle: "preserve-3d", perspective: 800 }}
        className="relative w-[260px] sm:w-[320px] rounded-2xl overflow-hidden border border-amber/30 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]"
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(155deg, #0f4a34 0%, #0b3627 45%, #06251c 100%)",
          }}
        />
        <div className="absolute inset-0 opacity-[0.08]" style={{
          backgroundImage: "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 1px, transparent 14px)"
        }} />

        <div className="relative px-6 py-7 sm:px-7 sm:py-8">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-sport-body text-[10px] tracking-[0.25em] text-chalk/45">PLAYER</p>
              <p className="font-sport text-2xl sm:text-3xl text-chalk tracking-wide">{player.name}</p>
            </div>
            <div className="font-sport text-5xl sm:text-6xl text-amber leading-none drop-shadow-[0_2px_8px_rgba(255,182,39,0.35)]">
              {player.rating}
            </div>
          </div>

          <div className="my-6 h-px bg-chalk/10" />

          <div className="grid grid-cols-3 gap-3">
            <Stat label="POSITION" value={player.position} />
            <Stat label="AGE" value={player.age} />
            <Stat label="TEAM" value={player.team} />
          </div>

          <div className="mt-7 flex justify-center">
            <span className="text-4xl">⚽</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
