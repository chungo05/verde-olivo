import NavBar from "@/components/NavBar";
import HeroSection from "@/components/HeroSection";
import ForYou from "@/components/ForYou";
import FeaturedCollections from "@/components/FeaturedCollections";
import NewInMarket from "@/components/NewInMarket";
import SearchResults from "@/components/SearchResults";
import { Suspense } from "react";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const filterKeys = ["q", "type", "location", "minPrice", "maxPrice", "beds", "baths", "amenities"];
  const isFiltering = filterKeys.some(key => resolvedSearchParams[key] !== undefined);

  return (
    <>
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <Suspense fallback={<div className="py-12 text-center text-nordic-muted">Loading search...</div>}>
          <HeroSection />
        </Suspense>
        {isFiltering ? (
          <Suspense fallback={<div className="py-12 text-center text-nordic-muted">Loading results...</div>}>
            <SearchResults />
          </Suspense>
        ) : (
          <>
            <ForYou />
            <FeaturedCollections />
            <NewInMarket />
          </>
        )}
      </main>
    </>
  );
}
