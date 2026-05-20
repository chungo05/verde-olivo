import { createClient } from "@/lib/supabase/server";
import { getDictionary } from "@/lib/dictionary";
import { redirect } from "next/navigation";
import { getAllProperties } from "@/lib/mock-data";
import type { Locale } from "@/lib/i18n";
import FavoritesGrid from "@/components/FavoritesGrid";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return { title: `${dict.favorites.title} | Verde Olivo` };
}

export default async function FavoritesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const [dict, supabase] = await Promise.all([
    getDictionary(locale as Locale),
    createClient(),
  ]);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login?next=/${locale}/favorites`);
  }

  const { data: favorites } = await supabase
    .from("favorites")
    .select("property_id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const orderedIds = (favorites ?? []).map((f) => f.property_id);
  const propertyMap = new Map(getAllProperties().map((p) => [p.id, p]));
  const favoritedProperties = orderedIds
    .map((id) => propertyMap.get(id))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  return (
    <main className="min-h-screen bg-background-light">
      <FavoritesGrid
        initialProperties={favoritedProperties}
        locale={locale}
        dict={dict}
      />
    </main>
  );
}
