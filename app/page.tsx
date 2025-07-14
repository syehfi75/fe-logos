import BeginJourney from "@/components/HomePage/BeginJourney";
import BetterYou from "@/components/HomePage/BetterYou";
import Experiences from "@/components/HomePage/Experiences";
import HeroHomePage from "@/components/HomePage/Hero";
import Navbar from "@/components/Navbar/navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="mb-96">
        <HeroHomePage />
        <BeginJourney />
        <Experiences />
        <BetterYou />
      </div>
    </>
  );
}
