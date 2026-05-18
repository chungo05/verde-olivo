import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { i18n } from "./lib/i18n";

const ADMIN_SEGMENT = "/admin";

function getLocale(request: NextRequest): string {
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookieLocale && i18n.locales.includes(cookieLocale as any)) {
    return cookieLocale;
  }

  const acceptLanguage = request.headers.get("accept-language");
  if (acceptLanguage) {
    if (acceptLanguage.includes("es")) return "es";
    if (acceptLanguage.includes("ko")) return "ko";
  }
  return i18n.defaultLocale;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- 1. Supabase session refresh + role resolution ---
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session — required for SSR auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // --- 2. Authentication guard for /[locale]/admin/* routes ---
  // Role verification is delegated to the admin layout Server Component,
  // which has reliable access to next/headers and the user's full JWT.
  const localePattern = new RegExp(
    `^\\/(${i18n.locales.join("|")})${ADMIN_SEGMENT}(/|$)`
  );

  if (localePattern.test(pathname) && !user) {
    const localePart = pathname.split("/")[1] || i18n.defaultLocale;
    const loginUrl = new URL(`/${localePart}/login`, request.url);
    loginUrl.searchParams.set("error", "unauthorized");
    return NextResponse.redirect(loginUrl);
  }

  // --- 3. i18n routing ---
  const pathnameHasLocale = i18n.locales.some(
    (locale) =>
      pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    const localeFromPath = i18n.locales.find(
      (l) => pathname.startsWith(`/${l}/`) || pathname === `/${l}`
    );
    if (
      localeFromPath &&
      request.cookies.get("NEXT_LOCALE")?.value !== localeFromPath
    ) {
      response.cookies.set("NEXT_LOCALE", localeFromPath, {
        maxAge: 60 * 60 * 24 * 365,
        path: "/",
      });
    }
    return response;
  }

  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;

  const redirectResponse = NextResponse.redirect(request.nextUrl);
  // Forward any Supabase cookies to the redirect response
  response.cookies.getAll().forEach(({ name, value }) => {
    redirectResponse.cookies.set(name, value);
  });
  redirectResponse.cookies.set("NEXT_LOCALE", locale, {
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
  return redirectResponse;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|images|favicon.ico|auth).*)",
  ],
};
