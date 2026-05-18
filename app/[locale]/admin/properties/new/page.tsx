import { getDictionary } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n";
import PropertyForm from "@/components/admin/PropertyForm";

export const metadata = {
  title: "Add Property — Admin | Verde Olivo",
};

export default async function AdminNewPropertyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  return (
    <PropertyForm mode="create" locale={locale} dict={dict} property={null} />
  );
}
