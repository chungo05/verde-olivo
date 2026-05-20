"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "@/components/I18nProvider";
import { useAuth } from "@/components/AuthProvider";
import LanguageSelector from "./LanguageSelector";

export default function NavBar() {
  const { dict, locale } = useTranslation();
  const { user, loading, role, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const searchParams = useSearchParams();
  const listing = searchParams.get("listing");

  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;
  const displayName = user?.user_metadata?.full_name || user?.email || "";

  return (
    <nav className="sticky top-0 z-50 bg-background-light/95 backdrop-blur-md border-b border-nordic-dark/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href={`/${locale}`} className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
            <Image src="/logo.png" alt="Verde Olivo Logo" width={32} height={32} className="object-contain" />
            <span className="text-xl font-semibold tracking-tight text-nordic-dark">Verde Olivo</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href={`/${locale}`} className={`font-medium text-sm px-1 py-1 transition-all ${!listing ? "text-mosque border-b-2 border-mosque" : "text-nordic-dark/70 hover:text-nordic-dark hover:border-b-2 hover:border-nordic-dark/20"}`}>{dict.nav.buy}</Link>
            <Link href={`/${locale}?listing=rent`} className={`font-medium text-sm px-1 py-1 transition-all ${listing === "rent" ? "text-mosque border-b-2 border-mosque" : "text-nordic-dark/70 hover:text-nordic-dark hover:border-b-2 hover:border-nordic-dark/20"}`}>{dict.nav.rent}</Link>
            <Link href={`/${locale}?listing=sale`} className={`font-medium text-sm px-1 py-1 transition-all ${listing === "sale" ? "text-mosque border-b-2 border-mosque" : "text-nordic-dark/70 hover:text-nordic-dark hover:border-b-2 hover:border-nordic-dark/20"}`}>{dict.nav.sell}</Link>
            <Link href={`/${locale}/favorites`} className="text-nordic-dark/70 hover:text-nordic-dark font-medium text-sm hover:border-b-2 hover:border-nordic-dark/20 px-1 py-1 transition-all">{dict.nav.savedHomes}</Link>
          </div>

          <div className="flex items-center space-x-4">
            <LanguageSelector />
            <button className="text-nordic-dark hover:text-mosque transition-colors">
              <span className="material-icons">search</span>
            </button>
            <button className="text-nordic-dark hover:text-mosque transition-colors relative">
              <span className="material-icons">notifications_none</span>
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-background-light" />
            </button>

            {/* User avatar / login button */}
            <div className="relative pl-2 border-l border-nordic-dark/10 ml-2">
              {!loading && user ? (
                /* Authenticated: show avatar with dropdown */
                <button
                  id="nav-user-avatar"
                  onClick={() => setShowUserMenu((v) => !v)}
                  className="flex items-center gap-2 group"
                  title={displayName}
                >
                  <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden ring-2 ring-transparent group-hover:ring-mosque transition-all relative">
                    {avatarUrl ? (
                      <Image
                        src={avatarUrl}
                        alt={displayName}
                        fill
                        sizes="36px"
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span className="material-icons text-nordic-dark/50 text-2xl flex items-center justify-center w-full h-full">
                        account_circle
                      </span>
                    )}
                  </div>
                </button>
              ) : !loading ? (
                /* Unauthenticated: link to login */
                <Link
                  id="nav-login-button"
                  href={`/${locale}/login`}
                  className="flex items-center gap-2 text-sm font-medium text-mosque hover:text-mosque/80 transition-colors bg-mosque/10 hover:bg-mosque/20 px-3 py-1.5 rounded-lg"
                >
                  <span className="material-icons text-base">login</span>
                  {dict.auth.signIn}
                </Link>
              ) : (
                /* Loading skeleton */
                <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse" />
              )}

              {/* User dropdown menu */}
              {showUserMenu && user && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-surface rounded-xl shadow-soft-hover border border-nordic-dark/10 overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-nordic-dark/5">
                    <p className="text-sm font-semibold text-nordic-dark truncate">{displayName}</p>
                    <p className="text-xs text-nordic-dark/50 truncate">{user.email}</p>
                  </div>
                  {role === "admin" && (
                    <Link
                      href={`/${locale}/admin`}
                      onClick={() => setShowUserMenu(false)}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-nordic-dark/70 hover:bg-mosque/5 hover:text-mosque transition-colors"
                    >
                      <span className="material-icons text-base">admin_panel_settings</span>
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={async () => {
                      setShowUserMenu(false);
                      await signOut();
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-nordic-dark/70 hover:bg-mosque/5 hover:text-mosque transition-colors"
                  >
                    <span className="material-icons text-base">logout</span>
                    {dict.auth.signOut}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden border-t border-nordic-dark/5 bg-background-light overflow-hidden h-0 transition-all duration-300">
        <div className="px-4 py-2 space-y-1">
          <Link href={`/${locale}`} className={`block px-3 py-2 rounded-md text-base font-medium ${!listing ? "text-mosque bg-mosque/10" : "text-nordic-dark hover:bg-black/5"}`}>{dict.nav.buy}</Link>
          <Link href={`/${locale}?listing=rent`} className={`block px-3 py-2 rounded-md text-base font-medium ${listing === "rent" ? "text-mosque bg-mosque/10" : "text-nordic-dark hover:bg-black/5"}`}>{dict.nav.rent}</Link>
          <Link href={`/${locale}?listing=sale`} className={`block px-3 py-2 rounded-md text-base font-medium ${listing === "sale" ? "text-mosque bg-mosque/10" : "text-nordic-dark hover:bg-black/5"}`}>{dict.nav.sell}</Link>
          <Link href={`/${locale}/favorites`} className="block px-3 py-2 rounded-md text-base font-medium text-nordic-dark hover:bg-black/5">{dict.nav.savedHomes}</Link>
        </div>
      </div>
    </nav>
  );
}
