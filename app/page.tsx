import BeginJourney from "@/components/HomePage/BeginJourney";
import PremiumClass from "@/components/HomePage/PremiumClass";
import MembershipClass from "@/components/HomePage/MembershipClass";
import HeroHomePage from "@/components/HomePage/Hero";
import StoreHydrator from "@/components/HomePage/StoreHydrator";
import About from "@/components/HomePage/About";
import ProvenResults from "@/components/HomePage/ProvenResults";
import AudioClass from "@/components/HomePage/AudioClass";
import VipClass from "@/components/HomePage/VipClass";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE;
async function getHomeData() {
  const res = await fetch(BASE_URL + "/api/content/homepage", {
    next: { revalidate: 3600 },
  });

  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
}

export const dynamic = 'force-dynamic';

export default async function Home() {
  const data = await getHomeData();

  return (
    <>
      <StoreHydrator data={data} />
      <main className="mb-96">
        <HeroHomePage />
        <BeginJourney />
        {/* <MembershipClass /> */}
        <PremiumClass />
        <AudioClass />
        <VipClass />
        <ProvenResults />
        <About />
      </main>
    </>
  );
}
