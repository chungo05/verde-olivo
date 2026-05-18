import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: refreshing session — do NOT remove this call.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // --- Role resolution ---
  // Fetch the user's role from the user_roles table and expose it
  // as a response header so the root middleware can read it without
  // making a second DB round-trip.
  if (user) {
    const { data: roleRow } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    const role = roleRow?.role ?? "user";
    supabaseResponse.headers.set("x-user-role", role);
    supabaseResponse.headers.set("x-user-id", user.id);
  } else {
    supabaseResponse.headers.set("x-user-role", "anonymous");
  }

  return supabaseResponse;
}
