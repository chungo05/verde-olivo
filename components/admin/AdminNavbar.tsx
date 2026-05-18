"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import type { User } from "@supabase/supabase-js";
import Image from "next/image";
import { useAuth } from "@/components/AuthProvider";
import { useTranslation } from "@/components/I18nProvider";
import LanguageSelector from "@/components/LanguageSelector";

export default function AdminNavbar({
  locale,
  user,
}: {
  locale: string;
  user: User;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuth();
  const { dict } = useTranslation();
  const a = dict.admin;

  const navItems = [
    { label: a.nav.overview,    href: "/admin",            exact: true  },
    { label: a.nav.properties,  href: "/admin/properties", exact: false },
    { label: a.nav.users,       href: "/admin/users",      exact: false },
  ];

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  const handleSignOut = async () => {
    setDropdownOpen(false);
    await signOut();
    router.push(`/${locale}/login`);
  };

  const displayName =
    user.user_metadata?.full_name ??
    user.user_metadata?.name ??
    "Admin";

  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-inner">
        {/* Left: brand + nav links */}
        <div className="admin-navbar-left">
          <Link href={`/${locale}/admin`} className="admin-navbar-brand">
            <span className="material-icons admin-navbar-brand-icon">apartment</span>
            <span className="admin-navbar-brand-text">Verde Olivo</span>
            <span className="admin-navbar-badge">{a.badge}</span>
          </Link>

          <div className="admin-navbar-nav">
            {navItems.map((item) => {
              const href = `/${locale}${item.href}`;
              const active = item.exact
                ? pathname === href
                : pathname.startsWith(href);
              return (
                <Link
                  key={item.href}
                  href={href}
                  className={`admin-navbar-link${active ? " admin-navbar-link--active" : ""}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right: view site + user dropdown */}
        <div className="admin-navbar-right">
          <Link href={`/${locale}`} className="admin-navbar-icon-btn" title={a.viewSite}>
            <span className="material-icons">open_in_new</span>
          </Link>

          <LanguageSelector />

          <div className="admin-navbar-avatar-wrap" ref={dropdownRef}>
            <button
              className="admin-navbar-avatar-btn"
              onClick={() => setDropdownOpen((prev) => !prev)}
              aria-label="User menu"
              aria-expanded={dropdownOpen}
            >
              {user.user_metadata?.avatar_url ? (
                <Image
                  src={user.user_metadata.avatar_url}
                  alt={displayName}
                  width={36}
                  height={36}
                  className="admin-navbar-avatar"
                />
              ) : (
                <div className="admin-navbar-avatar-placeholder">
                  <span className="material-icons">account_circle</span>
                </div>
              )}
            </button>

            {dropdownOpen && (
              <div className="admin-navbar-dropdown">
                <div className="admin-navbar-dropdown-header">
                  <span className="admin-navbar-dropdown-name">{displayName}</span>
                  <span className="admin-navbar-dropdown-email">{user.email}</span>
                </div>
                <div className="admin-navbar-dropdown-divider" />
                <button
                  className="admin-navbar-dropdown-item"
                  onClick={handleSignOut}
                >
                  <span className="material-icons">logout</span>
                  {dict.auth.signOut}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
