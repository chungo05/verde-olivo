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

  // Fetch user_roles joined with auth.users via the admin client
  // We use a Postgres view-style query via RPC or direct select
  const { data: roleRows, error } = await supabase
    .from("user_roles")
    .select("user_id, role, created_at, updated_at");

  if (error) {
    return (
      <div className="admin-page">
        <p className="admin-error">Error loading users: {error.message}</p>
      </div>
    );
  }

  // Enrich with auth.users metadata via the get_users_with_roles function
  const { data: authUsers } = await supabase.rpc("get_users_with_roles");

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
    <div className="admin-page">
      <header className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Users & Roles</h1>
          <p className="admin-page-subtitle">{users.length} registered users</p>
        </div>
      </header>
      <UserRolesTable users={users} />
    </div>
  );
}
