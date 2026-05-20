import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getDictionary } from "@/lib/dictionary";
import { Locale } from "@/lib/i18n";
import { translateTag, formatArea } from "@/lib/i18n";
import FavoriteButton from "@/components/FavoriteButton";

interface Props {
  q?: string;
  type?: string;
  location?: string;
  minPrice?: string;
  maxPrice?: string;
  beds?: string;
  baths?: string;
  amenities?: string;
  listing?: string;
  locale: Locale;
}

export default async function SearchResults({
  q,
  type,
  location,
  minPrice,
  maxPrice,
  beds,
  baths,
  listing,
  locale,
}: Props) {
  const t = await getDictionary(locale);
  const supabase = await createClient();

  const normalize = (str: string) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const queryStr = normalize(q || "");
  const locationStr = normalize(location || "");
  const bedsNum = parseInt(beds || "0", 10);
  const bathsNum = parseInt(baths || "0", 10);
  const minPriceNum = parseInt(minPrice || "0", 10);
  const maxPriceNum = parseInt(maxPrice || "0", 10);

  let dbQuery = supabase
    .from("properties")
    .select(
      "id, slug, title, location, price, beds, baths, area, image_url, is_rent, is_sold, category"
    )
    .eq("is_active", true);

  if (queryStr) {
    dbQuery = dbQuery.or(
      `title_search.ilike.%${queryStr}%,location_search.ilike.%${queryStr}%`
    );
  }

  if (type && type !== "All" && type !== "Any Type") {
    dbQuery = dbQuery.eq("property_type", type.toLowerCase());
  }

  if (listing === "rent") {
    dbQuery = dbQuery.eq("is_rent", true);
  } else if (listing === "sale") {
    dbQuery = dbQuery.eq("is_rent", false);
  }

  if (locationStr) {
    dbQuery = dbQuery.ilike("location_search", `%${locationStr}%`);
  }

  if (bedsNum > 0) dbQuery = dbQuery.gte("beds", bedsNum);
  if (bathsNum > 0) dbQuery = dbQuery.gte("baths", bathsNum);

  const { data: properties = [] } = await dbQuery.order("created_at", {
    ascending: false,
  });

  const filtered = (properties ?? []).filter((p) => {
    const priceNum = parseInt((p.price ?? "").replace(/[^0-9]/g, ""), 10);
    if (minPriceNum > 0 && priceNum < minPriceNum) return false;
    if (maxPriceNum > 0 && priceNum > maxPriceNum) return false;
    return true;
  });

  return (
    <section className="mb-24">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-3xl font-light text-nordic-dark">
            {t.searchResults.title}
          </h2>
          <p className="text-nordic-muted mt-2 text-base">
            {filtered.length}{" "}
            {filtered.length === 1
              ? t.searchResults.propertyFound
              : t.searchResults.propertiesFound}
          </p>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-nordic-dark/5 rounded-2xl border border-nordic-dark/10">
          <span className="material-icons text-5xl text-nordic-muted mb-4 block">
            search_off
          </span>
          <h3 className="text-xl font-medium text-nordic-dark mb-2">
            {t.searchResults.noPropertiesFound}
          </h3>
          <p className="text-nordic-muted">{t.searchResults.tryAdjusting}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filtered.map((property) => {
            const tag = property.is_sold
              ? "SOLD"
              : property.is_rent
              ? "FOR RENT"
              : "FOR SALE";
            const tagColor = property.is_sold ? "nordic" : "mosque";
            const images: string[] = Array.isArray(property.image_url)
              ? property.image_url
              : [];

            return (
              <Link
                href={`/${locale}/properties/${property.slug ?? property.id}`}
                key={property.id}
                className="block bg-white rounded-2xl overflow-hidden shadow-soft border border-nordic-dark/5 group cursor-pointer"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  {images[0] ? (
                    <Image
                      src={images[0]}
                      alt={property.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-nordic-dark/10 flex items-center justify-center">
                      <span className="material-icons text-5xl text-nordic-muted">
                        home
                      </span>
                    </div>
                  )}
                  <div
                    className={`absolute top-4 left-4 ${
                      tagColor === "mosque"
                        ? "bg-mosque text-white"
                        : "bg-white/90 text-nordic-dark"
                    } backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest`}
                  >
                    {translateTag(tag, t)}
                  </div>
                  <FavoriteButton
                    propertyId={String(property.id)}
                    className="absolute top-4 right-4 z-10"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-2xl font-semibold text-nordic-dark">
                      {property.title}
                    </h3>
                    <span className="text-2xl font-bold text-mosque">
                      {property.price}
                    </span>
                  </div>
                  <p className="text-nordic-muted text-sm flex items-center gap-1 mb-6">
                    <span className="material-icons text-sm">place</span>{" "}
                    {property.location}
                  </p>
                  <div className="flex items-center gap-6 pt-6 border-t border-nordic-dark/5">
                    <div className="flex items-center gap-2 text-nordic-dark font-medium">
                      <span className="material-icons text-mosque">
                        king_bed
                      </span>{" "}
                      {property.beds}
                    </div>
                    <div className="flex items-center gap-2 text-nordic-dark font-medium">
                      <span className="material-icons text-mosque">
                        bathtub
                      </span>{" "}
                      {property.baths}
                    </div>
                    <div className="flex items-center gap-2 text-nordic-dark font-medium">
                      <span className="material-icons text-mosque">
                        square_foot
                      </span>{" "}
                      {formatArea(property.area ?? "", locale)}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
