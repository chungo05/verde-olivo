import type { Metadata } from "next";
import "@/app/admin.css";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminBreadcrumb from "@/components/admin/AdminBreadcrumb";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();

  // Server-side double-check: if somehow middleware is bypassed, redirect
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login?error=unauthorized`);
  }

  // Use the SECURITY DEFINER RPC — bypasses RLS and always returns the correct role
  const { data: role } = await supabase.rpc("get_my_role");

  if (role !== "admin") {
    redirect(`/${locale}?error=forbidden`);
  }

  return (
    <div className="admin-shell">
      <AdminNavbar locale={locale} user={user} />
      <AdminBreadcrumb locale={locale} />
      <main className="admin-main">{children}</main>
    </div>
  );
}
