import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

async function getAuthenticatedUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { supabase: null, user: null, error: error?.message ?? "Not authenticated" };
  }

  return { supabase, user, error: null };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const propertyId = url.searchParams.get("propertyId");

  if (!propertyId) {
    return NextResponse.json(
      { error: "propertyId query parameter is required" },
      { status: 400 }
    );
  }

  const { supabase, user, error: authError } = await getAuthenticatedUser();
  if (authError || !supabase || !user) {
    return NextResponse.json({ error: authError }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("property_id", propertyId)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ favorited: Boolean(data) });
}

export async function POST(request: Request) {
  const body = await request.json();
  const propertyId = body?.propertyId;

  if (!propertyId) {
    return NextResponse.json(
      { error: "propertyId is required" },
      { status: 400 }
    );
  }

  const { supabase, user, error: authError } = await getAuthenticatedUser();
  if (authError || !supabase || !user) {
    return NextResponse.json({ error: authError }, { status: 401 });
  }

  const { error } = await supabase.from("favorites").upsert(
    {
      user_id: user.id,
      property_id: String(propertyId),
    },
    { onConflict: "user_id,property_id" }
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, favorited: true });
}

export async function DELETE(request: Request) {
  const body = await request.json();
  const propertyId = body?.propertyId;

  if (!propertyId) {
    return NextResponse.json(
      { error: "propertyId is required" },
      { status: 400 }
    );
  }

  const { supabase, user, error: authError } = await getAuthenticatedUser();
  if (authError || !supabase || !user) {
    return NextResponse.json({ error: authError }, { status: 401 });
  }

  const { error } = await supabase
    .from("favorites")
    .delete()
    .match({ user_id: user.id, property_id: String(propertyId) });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, favorited: false });
}
