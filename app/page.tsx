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
  if (!BASE_URL) {
    console.error(
      "Error: NEXT_PUBLIC_API_BASE tidak ditemukan di Environment Variables!",
    );
    return null;
  }

  try {
    const res = await fetch(`${BASE_URL}/api/content/homepage`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.error(`API Error: Status ${res.status}`);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("Gagal terhubung ke API:", error);
    return null;
  }
}

export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await getHomeData();

  const safeData = data || {
    hero: {},
    classes: [],
  };

  return (
    <>
      <StoreHydrator data={safeData} />
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
