"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

type AppRole = "admin" | "agent" | "user";

export async function updateUserRole(userId: string, newRole: AppRole) {
  const supabase = await createClient();

  // Verify the caller is an admin
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { data: callerRole } = await supabase.rpc("get_my_role");

  if (callerRole !== "admin") {
    return { error: "Forbidden: only admins can change roles" };
  }

  // Upsert the new role
  const { error } = await supabase
    .from("user_roles")
    .upsert({ user_id: userId, role: newRole }, { onConflict: "user_id" });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/[locale]/admin/users", "page");
  return { success: true };
}
