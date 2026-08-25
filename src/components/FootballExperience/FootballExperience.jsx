import { useRef } from "react";
import StadiumBackdrop from "./StadiumBackdrop";
import StadiumIntro from "./StadiumIntro";
import PlayerCard from "./PlayerCard";
import MemorySection from "./MemorySection";
import FinalBirthday from "./FinalBirthday";

export default function FootballExperience() {
  const scrollRef = useRef(null);

  return (
    <div
      ref={scrollRef}
      className="relative h-[100svh] w-full overflow-y-auto overflow-x-hidden text-chalk"
    >
      <StadiumBackdrop scrollRef={scrollRef} />
      <StadiumIntro />
      <PlayerCard />
      <MemorySection />
      <FinalBirthday />
    </div>
  );
}
