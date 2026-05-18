import { createClient } from "@/lib/supabase/server";
import { getDictionary } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n";
import Link from "next/link";

export const metadata = {
  title: "Admin Dashboard — LuxeEstate",
};

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [dict, supabase] = await Promise.all([
    getDictionary(locale as Locale),
    createClient(),
  ]);
  const a = dict.admin;

  const [{ count: propCount }, { data: allUsers }] = await Promise.all([
    supabase.from("properties").select("id", { count: "exact", head: true }),
    supabase.rpc("get_users_with_roles"),
  ]);

  const counts = { admin: 0, agent: 0, user: 0 };
  (allUsers ?? []).forEach((u: any) => {
    const role = (u.role ?? "user") as keyof typeof counts;
    counts[role]++;
  });
  const userCount = (allUsers ?? []).length;

  const stats = [
    { label: a.dashboard.totalProperties, value: propCount ?? 0, icon: "home",    color: "var(--accent-emerald)", href: `/${locale}/admin/properties` },
    { label: a.dashboard.totalUsers,      value: userCount,       icon: "people",  color: "var(--accent-indigo)",  href: `/${locale}/admin/users`      },
    { label: a.dashboard.admins,          value: counts.admin,    icon: "shield",  color: "var(--accent-amber)",   href: `/${locale}/admin/users`      },
    { label: a.dashboard.agents,          value: counts.agent,    icon: "badge",   color: "var(--accent-sky)",     href: `/${locale}/admin/users`      },
  ];

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{a.dashboard.title}</h1>
          <p className="admin-page-subtitle">{a.dashboard.subtitle}</p>
        </div>
      </header>

      <section className="admin-stats-grid">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="admin-stat-card">
            <div className="admin-stat-icon" style={{ "--card-color": s.color } as React.CSSProperties}>
              <span className="material-icons">{s.icon}</span>
            </div>
            <div className="admin-stat-body">
              <span className="admin-stat-value">{s.value}</span>
              <span className="admin-stat-label">{s.label}</span>
            </div>
          </Link>
        ))}
      </section>

      <section className="admin-quick-links">
        <h2 className="admin-section-title">{a.dashboard.quickAccess}</h2>
        <div className="admin-quick-grid">
          <Link href={`/${locale}/admin/properties`} className="admin-quick-card">
            <span className="material-icons">home_work</span>
            <span>{a.dashboard.manageProperties}</span>
          </Link>
          <Link href={`/${locale}/admin/users`} className="admin-quick-card">
            <span className="material-icons">manage_accounts</span>
            <span>{a.dashboard.manageUsers}</span>
          </Link>
          <Link href={`/${locale}`} className="admin-quick-card">
            <span className="material-icons">open_in_new</span>
            <span>{a.viewSite}</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
