import { getDictionary } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import PropertyForm from "@/components/admin/PropertyForm";

export const metadata = {
  title: "Edit Property — Admin | Verde Olivo",
};

export default async function AdminEditPropertyPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;

  const [dict, supabase] = await Promise.all([
    getDictionary(locale as Locale),
    createClient(),
  ]);

  const { data: property, error } = await supabase
    .from("properties")
    .select(
      "id, title, price, is_rent, is_sold, property_type, description, location, area, year_built, beds, baths, parking, amenities, latitude, longitude, image_url, category"
    )
    .eq("id", id)
    .single();

  if (error || !property) {
    redirect(`/${locale}/admin/properties`);
  }

  return (
    <PropertyForm
      mode="edit"
      locale={locale}
      dict={dict}
      property={property}
    />
  );
}
