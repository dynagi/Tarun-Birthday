import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "./shared/Confetti";
import DancingPenguin from "./shared/DancingPenguin";
import { useMood } from "./shared/mood";

const QUESTIONS = [
  {
    icon: "⚽",
    label: "Question 1",
    text: "Who won the first FIFA World Cup in 1930?",
    options: [
      { flag: "🇺🇾", label: "Uruguay", correct: true },
      { flag: "🇦🇷", label: "Argentina", correct: false },
    ],
  },
  {
    icon: "⚽",
    label: "Question 2",
    text: "Which country has won the FIFA World Cup the most times?",
    options: [
      { flag: "🇧🇷", label: "Brazil", correct: true },
      { flag: "🇩🇪", label: "Germany", correct: false },
    ],
  },
];


function OptionButton({ option, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(option)}
      className="flex-1 flex items-center justify-center gap-2 rounded-full border border-bw-line bg-black/25 px-5 py-3 font-sport-body font-semibold tracking-wide text-sm sm:text-base text-bday-mist transition hover:border-bday-gold hover:bg-black/40"
    >
      <span className="text-lg">{option.flag}</span>
      {option.label}
    </button>
  );
}

function QuizCard({ qIndex, wrong, onSelect }) {
  const question = QUESTIONS[qIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -14, scale: 0.98 }}
      transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
      className="w-full max-w-[480px] rounded-2xl border border-bw-line bg-bw-panel/80 backdrop-blur-md shadow-[0_26px_70px_rgba(10,6,14,0.6)] overflow-hidden text-center"
    >
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-bw-line bg-black/25">
        <span className="h-[9px] w-[9px] rounded-full bg-bw-line" />
        <span className="h-[9px] w-[9px] rounded-full bg-bw-line" />
        <span className="h-[9px] w-[9px] rounded-full bg-bw-line" />
        <span className="ml-2 font-mono text-[11px] tracking-wide text-bday-mist/50">
          quiz.sh — one more thing
        </span>
      </div>

      <div className="px-7 sm:px-9 py-8 sm:py-9">
        <AnimatePresence mode="wait">
          {wrong ? (
            <motion.p
              key="wrong"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="font-display italic text-xl sm:text-2xl text-bday-rose"
            >
              Ooops wrong option
            </motion.p>
          ) : (
            <motion.div
              key={`q-${qIndex}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35 }}
            >
              <p className="font-mono text-xs tracking-[0.2em] text-bday-gold/80 uppercase mb-3">
                {question.icon} {question.label}
              </p>
              <p className="font-display italic text-xl sm:text-2xl text-bday-mist text-balance mb-7">
                {question.text}
              </p>
              <div className="flex items-center justify-center gap-4">
                {question.options.map((option) => (
                  <OptionButton key={option.label} option={option} onSelect={onSelect} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function BirthdayReveal({ onComplete }) {
  useMood("football");
  const [phase, setPhase] = useState("thanks"); // thanks -> intro -> quiz -> done
  const [qIndex, setQIndex] = useState(0);
  const [wrong, setWrong] = useState(false);

  useEffect(() => {
    if (phase !== "thanks") return;
    const t = setTimeout(() => setPhase("intro"), 3000);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "intro") return;
    const t = setTimeout(() => setPhase("quiz"), 2000);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (!wrong) return;
    const t = setTimeout(() => setWrong(false), 1500);
    return () => clearTimeout(t);
  }, [wrong]);

  function handleSelect(option) {
    if (wrong) return;
    if (!option.correct) {
      setWrong(true);
      return;
    }
    if (qIndex < QUESTIONS.length - 1) {
      setQIndex((i) => i + 1);
    } else {
      // The celebration chapter picks up from here with "Perfect! ..."
      setPhase("done");
      onComplete?.();
    }
  }

  return (
    <div className="relative min-h-[100svh] w-full flex flex-col items-center justify-center gap-8 px-6 py-16 text-center text-bday-mist overflow-hidden">
      <Confetti count={50} />

      <AnimatePresence mode="wait">
        {phase === "thanks" && (
          <motion.div
            key="thanks"
            initial={{ opacity: 0, scale: 0.5, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.8, ease: "backOut" }}
            className="flex flex-col items-center gap-8"
          >
            <h1 className="font-display italic text-4xl sm:text-5xl md:text-6xl text-bday-mist text-balance max-w-2xl drop-shadow-[0_4px_28px_rgba(255,210,122,0.3)]">
              Thanks bro,
              <br className="hidden sm:block" /> Let's go ahead <span className="text-bday-rose">❤️</span>
            </h1>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
              className="w-40 sm:w-52"
            >
              <DancingPenguin className="w-full h-auto" />
            </motion.div>
          </motion.div>
        )}

        {phase === "intro" && (
          <motion.p
            key="intro"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="font-display italic text-2xl sm:text-3xl md:text-4xl text-bday-mist text-balance max-w-xl"
          >
            Uh, huh wait wait before going ahead please tell me few things
          </motion.p>
        )}

        {phase === "quiz" && (
          <QuizCard key="quiz" qIndex={qIndex} wrong={wrong} onSelect={handleSelect} />
        )}

      </AnimatePresence>
    </div>
  );
}
