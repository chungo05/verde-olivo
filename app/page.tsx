import NavBar from "@/components/NavBar";
import HeroSection from "@/components/HeroSection";
import ForYou from "@/components/ForYou";
import FeaturedCollections from "@/components/FeaturedCollections";
import NewInMarket from "@/components/NewInMarket";

export default function Home() {
  return (
    <>
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <HeroSection />
        <ForYou />
        <FeaturedCollections />
        <NewInMarket />
      </main>
    </>
  );
}
