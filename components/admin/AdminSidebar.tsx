"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import Image from "next/image";

const NAV_ITEMS = [
  { label: "Overview", href: "/admin", icon: "dashboard" },
  { label: "Properties", href: "/admin/properties", icon: "home_work" },
  { label: "Users & Roles", href: "/admin/users", icon: "manage_accounts" },
];

export default function AdminSidebar({
  locale,
  user,
}: {
  locale: string;
  user: User;
}) {
  const pathname = usePathname();

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-brand">
        <span className="material-icons admin-sidebar-logo-icon">apartment</span>
        <span className="admin-sidebar-logo-text">LuxeEstate</span>
        <span className="admin-sidebar-badge">Admin</span>
      </div>

      <nav className="admin-sidebar-nav">
        {NAV_ITEMS.map((item) => {
          const href = `/${locale}${item.href}`;
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={item.href}
              href={href}
              className={`admin-sidebar-link ${active ? "admin-sidebar-link--active" : ""}`}
            >
              <span className="material-icons">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="admin-sidebar-footer">
        <Link href={`/${locale}`} className="admin-sidebar-site-link">
          <span className="material-icons">open_in_new</span>
          View Site
        </Link>

        <div className="admin-sidebar-user">
          {user.user_metadata?.avatar_url ? (
            <Image
              src={user.user_metadata.avatar_url}
              alt="Avatar"
              width={32}
              height={32}
              className="admin-sidebar-avatar"
            />
          ) : (
            <span className="material-icons admin-sidebar-avatar-placeholder">
              account_circle
            </span>
          )}
          <div className="admin-sidebar-user-info">
            <span className="admin-sidebar-user-name">
              {user.user_metadata?.full_name ?? user.user_metadata?.name ?? "Admin"}
            </span>
            <span className="admin-sidebar-user-email">{user.email}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
