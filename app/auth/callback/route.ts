import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Guarantee a user_roles row exists for this user.
      // ON CONFLICT DO NOTHING preserves any role already assigned by an admin.
      await supabase
        .from("user_roles")
        .upsert(
          { user_id: data.user.id, role: "user" },
          { onConflict: "user_id", ignoreDuplicates: true }
        );

      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // Auth code error — redirect to login with error param
  return NextResponse.redirect(`${origin}/en/login?error=auth_callback_failed`);
}

