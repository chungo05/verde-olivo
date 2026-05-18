import { createClient } from "@/lib/supabase/server";
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
  const supabase = await createClient();

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
    { label: "Total Properties", value: propCount ?? 0, icon: "home", color: "var(--accent-emerald)", href: `/${locale}/admin/properties` },
    { label: "Total Users", value: userCount ?? 0, icon: "people", color: "var(--accent-indigo)", href: `/${locale}/admin/users` },
    { label: "Admins", value: counts.admin, icon: "shield", color: "var(--accent-amber)", href: `/${locale}/admin/users` },
    { label: "Agents", value: counts.agent, icon: "badge", color: "var(--accent-sky)", href: `/${locale}/admin/users` },
  ];

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-page-subtitle">Welcome back, Administrator.</p>
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
        <h2 className="admin-section-title">Quick Access</h2>
        <div className="admin-quick-grid">
          <Link href={`/${locale}/admin/properties`} className="admin-quick-card">
            <span className="material-icons">home_work</span>
            <span>Manage Properties</span>
          </Link>
          <Link href={`/${locale}/admin/users`} className="admin-quick-card">
            <span className="material-icons">manage_accounts</span>
            <span>Manage Users & Roles</span>
          </Link>
          <Link href={`/${locale}`} className="admin-quick-card">
            <span className="material-icons">open_in_new</span>
            <span>View Site</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
