import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import MessageHeader from "./MessageHeader";
import MessageParagraph from "./MessageParagraph";
import DecorativeElements from "./DecorativeElements";
import MessageEnd from "./MessageEnd";
import Particles from "../shared/Particles";
import { letterBlocks } from "../../data/content";

const END_PAUSE_MS = 10000;
const AUTO_ADVANCE_MS = 5000;

export default function MessageExperience({ onFinish }) {
  const sentinelRef = useRef(null);
  const lastInView = useInView(sentinelRef, { once: true, margin: "0px 0px 200px 0px" });
  const [showEnd, setShowEnd] = useState(false);

  const heading = letterBlocks.find((b) => b.type === "heading");
  const rest = letterBlocks.filter((b) => b.type !== "heading");

  useEffect(() => {
    if (!lastInView) return;
    const t = setTimeout(() => setShowEnd(true), END_PAUSE_MS);
    return () => clearTimeout(t);
  }, [lastInView]);

  useEffect(() => {
    if (!showEnd) return;
    const t = setTimeout(() => onFinish?.(), AUTO_ADVANCE_MS);
    return () => clearTimeout(t);
  }, [showEnd, onFinish]);

  return (
    <div className="relative min-h-screen bg-paper text-ink">
      <div className="grain fixed inset-0 z-0" />
      <Particles count={16} className="fixed" />
      <DecorativeElements />

      <div className="relative z-10">
        <MessageHeader text={heading.text} />
        <div className="pb-4">
          {rest.map((block, i) => (
            <MessageParagraph key={i} block={block} />
          ))}
        </div>
        <div ref={sentinelRef} className="h-2" />
      </div>

      <MessageEnd visible={showEnd} onContinue={() => onFinish?.()} />
    </div>
  );
}
