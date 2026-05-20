import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDictionary } from "@/lib/dictionary";
import I18nProvider from "@/components/I18nProvider";
import SignupCard from "@/components/SignupCard";
import type { Locale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Sign Up",
  robots: { index: false, follow: false },
};

export default async function SignupPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale as Locale;

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
      <SignupCard />
    </I18nProvider>
  );
}
