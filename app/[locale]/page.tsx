import type { Metadata } from "next";
import NavBar from "@/components/NavBar";
import HeroSection from "@/components/HeroSection";
import ForYou from "@/components/ForYou";
import FeaturedCollections from "@/components/FeaturedCollections";
import NewInMarket from "@/components/NewInMarket";
import SearchResults from "@/components/SearchResults";
import { Suspense } from "react";
import { getDictionary } from "@/lib/dictionary";
import { Locale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Verde Olivo — Premium Real Estate",
  description:
    "Discover exclusive luxury properties. Browse curated homes, villas, and estates in the most sought-after locations.",
  openGraph: {
    url: "/",
    title: "Verde Olivo — Premium Real Estate",
    description:
      "Discover exclusive luxury properties. Browse curated homes, villas, and estates in the most sought-after locations.",
  },
  twitter: {
    title: "Verde Olivo — Premium Real Estate",
    description:
      "Discover exclusive luxury properties. Browse curated homes, villas, and estates in the most sought-after locations.",
  },
};

export default async function Home({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale as Locale;
  const dict = await getDictionary(locale);
  const resolvedSearchParams = await searchParams;
  const filterKeys = ["q", "type", "location", "minPrice", "maxPrice", "beds", "baths", "amenities", "listing"];
  const isFiltering = filterKeys.some(key => resolvedSearchParams[key] !== undefined);

  return (
    <>
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <Suspense fallback={<div className="py-12 text-center text-nordic-muted">{dict.search.loadingSearch}</div>}>
          <HeroSection />
        </Suspense>
        {isFiltering ? (
          <Suspense fallback={<div className="py-12 text-center text-nordic-muted">{dict.search.loadingResults}</div>}>
            <SearchResults
              q={resolvedSearchParams.q as string | undefined}
              type={resolvedSearchParams.type as string | undefined}
              location={resolvedSearchParams.location as string | undefined}
              minPrice={resolvedSearchParams.minPrice as string | undefined}
              maxPrice={resolvedSearchParams.maxPrice as string | undefined}
              beds={resolvedSearchParams.beds as string | undefined}
              baths={resolvedSearchParams.baths as string | undefined}
              amenities={resolvedSearchParams.amenities as string | undefined}
              listing={resolvedSearchParams.listing as string | undefined}
              locale={locale}
            />
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
