import { notFound } from "next/navigation";
import type { Metadata } from "next";
import NavBar from "@/components/NavBar";
import { getDictionary } from "@/lib/dictionary";
import { Locale } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/server";
import { forYouProperties, featuredProperties, newMarketProperties } from "@/lib/mock-data";
import ScheduleVisitClient from "@/components/schedule/ScheduleVisitClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  let { data: property } = await supabase
    .from("properties")
    .select("title")
    .or(`slug.eq.${slug},id.eq.${slug}`)
    .eq("is_active", true)
    .single();

  if (!property) {
    const allProperties = [...forYouProperties, ...featuredProperties, ...newMarketProperties];
    property = allProperties.find((p) => p.slug === slug || p.id === slug) ?? null;
  }

  return { title: property ? `Schedule Visit · ${property.title}` : "Schedule Visit" };
}

export default async function ScheduleVisitPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;

  const [dict, supabase] = await Promise.all([
    getDictionary(locale as Locale),
    createClient(),
  ]);

  let { data: property } = await supabase
    .from("properties")
    .select("id, slug, title, location, price, beds, baths, area, image_url, is_rent")
    .or(`slug.eq.${slug},id.eq.${slug}`)
    .eq("is_active", true)
    .single();

  if (!property) {
    const allProperties = [...forYouProperties, ...featuredProperties, ...newMarketProperties];
    const found = allProperties.find((p) => p.slug === slug || p.id === slug);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    property = (found ?? null) as any;
  }

  if (!property) {
    notFound();
  }

  return (
    <div className="bg-background-light min-h-screen text-nordic-dark">
      <NavBar />
      <ScheduleVisitClient property={property} dict={dict} locale={locale} slug={slug} />
    </div>
  );
}
