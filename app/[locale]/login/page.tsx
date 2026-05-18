import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDictionary } from "@/lib/dictionary";
import I18nProvider from "@/components/I18nProvider";
import LoginCard from "@/components/LoginCard";
import type { Locale } from "@/lib/i18n";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale as Locale;

  // If already logged in, send to home
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect(`/${locale}`);
  }

  const dict = await getDictionary(locale);

  return (
    <I18nProvider dict={dict} locale={locale}>
      <LoginCard />
    </I18nProvider>
  );
}
