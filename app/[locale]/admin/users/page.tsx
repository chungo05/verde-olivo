import { createClient } from "@/lib/supabase/server";
import UserRolesTable from "@/components/admin/UserRolesTable";

export const metadata = {
  title: "Users & Roles — Admin | LuxeEstate",
};

export type UserWithRole = {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  role: "admin" | "agent" | "user";
  avatar_url: string | null;
  full_name: string | null;
};

export default async function AdminUsersPage() {
  const supabase = await createClient();

  const { data: authUsers, error } = await supabase.rpc("get_users_with_roles");

  if (error) {
    return (
      <div className="admin-light-page">
        <p className="admin-error">Error loading users: {error.message}</p>
      </div>
    );
  }

  const users: UserWithRole[] = (authUsers ?? []).map((u: any) => ({
    id: u.id,
    email: u.email,
    created_at: u.created_at,
    last_sign_in_at: u.last_sign_in_at,
    role: u.role ?? "user",
    avatar_url: u.raw_user_meta_data?.avatar_url ?? null,
    full_name: u.raw_user_meta_data?.full_name ?? u.raw_user_meta_data?.name ?? null,
  }));

  return (
    <div className="admin-light-page">
      <header style={{ marginBottom: "32px" }}>
        <h1 className="admin-light-title">User Directory</h1>
        <p className="admin-light-subtitle">
          Manage user access and roles for your properties.
        </p>
      </header>
      <UserRolesTable users={users} />
    </div>
  );
}
