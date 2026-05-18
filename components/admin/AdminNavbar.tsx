"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import Image from "next/image";

const NAV_ITEMS = [
  { label: "Overview",      href: "/admin",            exact: true },
  { label: "Properties",    href: "/admin/properties", exact: false },
  { label: "Users & Roles", href: "/admin/users",      exact: false },
];

export default function AdminNavbar({
  locale,
  user,
}: {
  locale: string;
  user: User;
}) {
  const pathname = usePathname();

  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-inner">
        {/* Left: brand + nav links */}
        <div className="admin-navbar-left">
          <Link href={`/${locale}/admin`} className="admin-navbar-brand">
            <span className="material-icons admin-navbar-brand-icon">apartment</span>
            <span className="admin-navbar-brand-text">LuxeEstate</span>
            <span className="admin-navbar-badge">Admin</span>
          </Link>

          <div className="admin-navbar-nav">
            {NAV_ITEMS.map((item) => {
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

        {/* Right: view site + user avatar */}
        <div className="admin-navbar-right">
          <Link href={`/${locale}`} className="admin-navbar-icon-btn" title="View site">
            <span className="material-icons">open_in_new</span>
          </Link>

          {user.user_metadata?.avatar_url ? (
            <Image
              src={user.user_metadata.avatar_url}
              alt={user.user_metadata?.full_name ?? "Admin"}
              width={36}
              height={36}
              className="admin-navbar-avatar"
            />
          ) : (
            <div className="admin-navbar-avatar-placeholder">
              <span className="material-icons">account_circle</span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
