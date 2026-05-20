import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import NavBar from "@/components/NavBar";
import { forYouProperties, featuredProperties, newMarketProperties } from "@/lib/mock-data";
import Map from "@/components/Map";
import PropertyGallery from "@/components/PropertyGallery";
import { getDictionary } from "@/lib/dictionary";
import { Locale, formatArea } from "@/lib/i18n";
import DescriptionExpandable from "@/components/DescriptionExpandable";

import { createClient } from "@/lib/supabase/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const supabase = await createClient();
  let { data: property } = await supabase
    .from("properties")
    .select("title, location, price, image_url, beds, baths")
    .or(`slug.eq.${slug},id.eq.${slug}`)
    .eq("is_active", true)
    .single();

  if (!property) {
    const allProperties = [...forYouProperties, ...featuredProperties, ...newMarketProperties];
    property = allProperties.find((p) => p.slug === slug || p.id === slug) ?? null;
  }

  if (!property) {
    return { title: "Property Not Found" };
  }

  const images: string[] = Array.isArray(property.image_url)
    ? property.image_url
    : [property.image_url].filter(Boolean);
  const ogImage = images[0] ?? "/og-default.jpg";
  const title = property.title as string;
  const description = `${property.price} · ${property.location} · ${property.beds} beds · ${property.baths} baths`;

  return {
    title,
    description,
    openGraph: {
      type: "website",
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function PropertyPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params;
  const dict = await getDictionary(locale as Locale);
  
  const supabase = await createClient();
  let { data: property } = await supabase
    .from("properties")
    .select("*")
    .or(`slug.eq.${slug},id.eq.${slug}`)
    .eq("is_active", true)
    .single();

  if (!property) {
    const allProperties = [...forYouProperties, ...featuredProperties, ...newMarketProperties];
    property = allProperties.find((p) => p.slug === slug || p.id === slug);
  }

  if (!property) {
    notFound();
  }

  return (
    <div className="bg-background-light min-h-screen text-nordic-dark selection:bg-mosque/20">
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          
          {/* Gallery Column */}
          <div className="lg:col-span-8 space-y-4">
            <PropertyGallery images={property.image_url} />
          </div>

          {/* Sticky Sidebar Info */}
          <div className="lg:col-span-4 relative">
            <div className="sticky top-28 space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-mosque/5">
                <div className="mb-4">
                  <h1 className="text-4xl font-display font-light text-nordic-dark mb-2">{property.price}</h1>
                  <h2 className="text-xl font-medium text-nordic-dark mb-1">{property.title}</h2>
                  <p className="text-nordic-muted font-medium flex items-center gap-1">
                    <span className="material-icons text-mosque text-sm">location_on</span>
                    {property.location}
                  </p>
                </div>
                <div className="h-px bg-slate-100 my-6"></div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative w-14 h-14 rounded-full border-2 border-white shadow-sm overflow-hidden">
                    <Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4TxUmdQRb2VMjuaNxLEwLorv_dgHzoET2_wL5toSvew6nhtziaR3DX-U69DBN7J74yO6oKokpw8tqEFutJf13MeXghCy7FwZuAxnoJel6FYcKeCRUVinpZtrNnkZvXd-MY5_2MAtRD7JP5BieHixfCaeAPW04jm-y-nvF3HIrwcZ_HRDk_MrNP5WiPV3u9zNrEgM-SQoWGh4xLVSV444aZAbVl03mjjsW5WBpIeodCyqJxprTDp6Q157D06VxcdUSCf-l9UKQT-w" alt="Agent" fill className="object-cover" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-nordic-dark">Sarah Jenkins</h3>
                    <div className="flex items-center gap-1 text-xs text-mosque font-medium">
                      <span className="material-icons text-[14px]">star</span>
                      <span>{dict.propertyDetails.topRatedAgent}</span>
                    </div>
                  </div>
                  <div className="ml-auto flex gap-2">
                    <button className="p-2 rounded-full bg-mosque/10 text-mosque hover:bg-mosque hover:text-white transition-colors">
                      <span className="material-icons text-sm">chat</span>
                    </button>
                    <button className="p-2 rounded-full bg-mosque/10 text-mosque hover:bg-mosque hover:text-white transition-colors">
                      <span className="material-icons text-sm">call</span>
                    </button>
                  </div>
                </div>
                <div className="space-y-3">
                  <Link
                    href={`/${locale}/properties/${slug}/schedule`}
                    className="w-full bg-mosque hover:bg-primary-hover text-white py-4 px-6 rounded-lg font-medium transition-all shadow-lg shadow-mosque/20 flex items-center justify-center gap-2 group"
                  >
                    <span className="material-icons text-xl group-hover:scale-110 transition-transform">calendar_today</span>
                    {dict.propertyDetails.scheduleVisit}
                  </Link>
                  <button className="w-full bg-transparent border border-nordic-dark/10 hover:border-mosque text-nordic-dark/80 hover:text-mosque py-4 px-6 rounded-lg font-medium transition-all flex items-center justify-center gap-2">
                    <span className="material-icons text-xl">mail_outline</span>
                    {dict.propertyDetails.contactAgent}
                  </button>
                </div>
              </div>

              <div className="bg-white p-2 rounded-xl shadow-sm border border-mosque/5">
                <Map location={property.location} latitude={property.latitude} longitude={property.longitude} />
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="lg:col-span-8 lg:row-start-2 -mt-8 space-y-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-mosque/5">
              <h2 className="text-lg font-semibold mb-6 text-nordic-dark">{dict.propertyDetails.propertyFeatures}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 rounded-lg border border-mosque/10">
                  <span className="material-icons text-mosque text-2xl mb-2">square_foot</span>
                  <span className="text-xl font-bold text-nordic-dark">{formatArea(property.area, locale as Locale)}</span>
                  <span className="text-xs uppercase tracking-wider text-nordic-muted">{dict.common.area}</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 rounded-lg border border-mosque/10">
                  <span className="material-icons text-mosque text-2xl mb-2">bed</span>
                  <span className="text-xl font-bold text-nordic-dark">{property.beds}</span>
                  <span className="text-xs uppercase tracking-wider text-nordic-muted">{dict.propertyDetails.bedrooms}</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 rounded-lg border border-mosque/10">
                  <span className="material-icons text-mosque text-2xl mb-2">shower</span>
                  <span className="text-xl font-bold text-nordic-dark">{property.baths}</span>
                  <span className="text-xs uppercase tracking-wider text-nordic-muted">{dict.propertyDetails.bathrooms}</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 rounded-lg border border-mosque/10">
                  <span className="material-icons text-mosque text-2xl mb-2">directions_car</span>
                  <span className="text-xl font-bold text-nordic-dark">2</span>
                  <span className="text-xs uppercase tracking-wider text-nordic-muted">{dict.propertyDetails.garage}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-mosque/5">
              <h2 className="text-lg font-semibold mb-4 text-nordic-dark">{dict.propertyDetails.aboutThisHome}</h2>
              <DescriptionExpandable
                description1={dict.propertyDetails.description1.replace('{{location}}', property.location)}
                description2={dict.propertyDetails.description2}
                readMoreLabel={dict.common.readMore}
                readLessLabel={dict.common.readLess}
              />
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-mosque/5">
              <h2 className="text-lg font-semibold mb-6 text-nordic-dark">{dict.propertyDetails.amenities}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                {[
                  dict.propertyDetails.amenitiesList?.smartHome || 'Smart Home System', 
                  dict.propertyDetails.amenitiesList?.pool || 'Swimming Pool', 
                  dict.propertyDetails.amenitiesList?.ac || 'Central Heating & Cooling', 
                  dict.propertyDetails.amenitiesList?.ev || 'Electric Vehicle Charging', 
                  dict.propertyDetails.amenitiesList?.gym || 'Private Gym', 
                  dict.propertyDetails.amenitiesList?.wineCellar || 'Wine Cellar'
                ].map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-nordic-muted">
                    <span className="material-icons text-mosque/60 text-sm">check_circle</span>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t border-slate-200 mt-12 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm text-nordic-muted">
            {dict.propertyDetails.allRightsReserved}
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-nordic-muted hover:text-mosque transition-colors">
              <span className="sr-only">Facebook</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path></svg>
            </a>
            <a href="#" className="text-nordic-muted hover:text-mosque transition-colors">
              <span className="sr-only">Twitter</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path></svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
