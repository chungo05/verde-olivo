import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { getDictionary } from "@/lib/dictionary";
import I18nProvider from "@/components/I18nProvider";
import { AuthProvider } from "@/components/AuthProvider";
import { Locale } from "@/lib/i18n";

const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ??
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://verde-olivo.com")
  ),
  title: {
    default: "Verde Olivo — Premium Real Estate",
    template: "%s | Verde Olivo",
  },
  description:
    "Find your sanctuary. Exclusive premium real estate properties curated for discerning buyers.",
  openGraph: {
    type: "website",
    siteName: "Verde Olivo",
    title: "Verde Olivo — Premium Real Estate",
    description:
      "Find your sanctuary. Exclusive premium real estate properties curated for discerning buyers.",
    images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "Verde Olivo Real Estate" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Verde Olivo — Premium Real Estate",
    description:
      "Find your sanctuary. Exclusive premium real estate properties curated for discerning buyers.",
    images: ["/og-default.jpg"],
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale as Locale;
  const dict = await getDictionary(locale);

  return (
    <html lang={locale}>
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <AuthProvider>
          <I18nProvider dict={dict} locale={locale}>
            {children}
          </I18nProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

