import BeginJourney from "@/components/HomePage/BeginJourney";
import PremiumClass from "@/components/HomePage/PremiumClass";
import MembershipClass from "@/components/HomePage/MembershipClass";
import HeroHomePage from "@/components/HomePage/Hero";
import StoreHydrator from "@/components/HomePage/StoreHydrator";
import About from "@/components/HomePage/About";
import ProvenResults from "@/components/HomePage/ProvenResults";

const BASE_URL = process.env.NEXT_PUBLIC_API_AUTH;
async function getHomeData() {
  const res = await fetch(BASE_URL + "/api/content/homepage", {
    next: { revalidate: 3600 },
  });

  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
}

export default async function Home() {
  const data = await getHomeData();

  return (
    <>
      <StoreHydrator data={data} />
      <main className="mb-96">
        <HeroHomePage />
        <BeginJourney  />
        <MembershipClass />
        <PremiumClass />
        <ProvenResults />
        <About />
      </main>
    </>
  );
}
