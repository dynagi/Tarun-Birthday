import { motion } from "framer-motion";
import { useMood } from "./shared/mood";

const LINE_DELAYS = [0.15, 0.55, 1.05];
const PROMPT_DELAY = 1.9;

export default function WelcomeMessage({ onNo, onProceed }) {
  useMood("calm");

  return (
    <div className="relative min-h-[100svh] w-full flex flex-col items-center justify-center gap-6 px-6 py-16 text-cloud-mist">

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute top-[max(2.2rem,4vh)] left-1/2 -translate-x-1/2 font-mono text-[11px] sm:text-xs tracking-[0.25em] text-server-teal/80 uppercase flex items-center gap-2"
      >
        <motion.span
          className="inline-block h-[7px] w-[7px] rounded-full bg-server-teal"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
        Incoming transmission
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 14, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
        className="w-full max-w-[560px] rounded-2xl border border-bw-line bg-bw-panel/80 backdrop-blur-md shadow-[0_26px_70px_rgba(10,6,14,0.6)] overflow-hidden"
      >
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-bw-line bg-black/25">
          <span className="h-[9px] w-[9px] rounded-full bg-bw-line" />
          <span className="h-[9px] w-[9px] rounded-full bg-bw-line" />
          <span className="h-[9px] w-[9px] rounded-full bg-bw-line" />
          <span className="ml-2 font-mono text-[11px] tracking-wide text-cloud-mist/50">
            message.txt — for tarun
          </span>
        </div>

        <div className="px-7 sm:px-9 py-9 sm:py-10 max-w-[56ch]">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: LINE_DELAYS[0] }}
            className="font-display italic text-2xl sm:text-3xl text-cloud-blue mb-4"
          >
            Hi Tarun,
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: LINE_DELAYS[1] }}
            className="font-body text-base sm:text-lg leading-[1.85] text-cloud-mist/90 mb-4"
          >
            I don't know whether I'm in front of you right now or not, but here's something for
            you — something I've been putting together over the last few days.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: LINE_DELAYS[2] }}
            className="font-body text-base sm:text-lg leading-[1.85] text-cloud-mist/90"
          >
            Hope you like it.
            <motion.span
              className="inline-block w-[8px] h-[1em] bg-amber align-middle ml-1 translate-y-[2px]"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, delay: PROMPT_DELAY, ease: [0.2, 0.8, 0.2, 1] }}
        className="w-full max-w-[560px] rounded-2xl border border-bw-line bg-bw-panel/80 backdrop-blur-md shadow-[0_26px_70px_rgba(10,6,14,0.6)] overflow-hidden text-center"
      >
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-bw-line bg-black/25">
          <span className="h-[9px] w-[9px] rounded-full bg-bw-line" />
          <span className="h-[9px] w-[9px] rounded-full bg-bw-line" />
          <span className="h-[9px] w-[9px] rounded-full bg-bw-line" />
          <span className="ml-2 font-mono text-[11px] tracking-wide text-cloud-mist/50">
            prompt.sh — waiting for input
          </span>
        </div>

        <div className="px-7 sm:px-9 py-8 sm:py-9">
          <p className="font-display italic text-xl sm:text-2xl text-cloud-blue text-balance mb-7">
            Want to see what I made for you?
          </p>

          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={onProceed}
              className="font-sport-body font-semibold tracking-wide text-sm sm:text-base text-cloud-night bg-gradient-to-br from-cloud-blue to-server-teal px-8 py-3 rounded-full shadow-lg transition hover:brightness-110"
            >
              Yes
            </button>
            <button
              type="button"
              onClick={onNo}
              className="font-sport-body font-semibold tracking-wide text-sm sm:text-base text-cloud-mist border border-bw-line px-8 py-3 rounded-full transition hover:bg-black/25"
            >
              No
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
