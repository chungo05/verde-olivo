"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type PropertyFormData = {
  title: string;
  price: string;
  status: "for_sale" | "for_rent" | "sold";
  property_type: string;
  description: string;
  location: string;
  area: string;
  year_built: number | null;
  beds: number;
  baths: number;
  parking: number;
  amenities: string[];
  latitude: number | null;
  longitude: number | null;
  image_url: string[];
  featured: boolean;
};

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase: null, error: "Not authenticated" };
  const { data: role } = await supabase.rpc("get_my_role");
  if (role !== "admin") return { supabase: null, error: "Forbidden" };
  return { supabase, error: null };
}

function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
  const suffix = Math.random().toString(36).slice(2, 7);
  return `${base}-${suffix}`;
}

export async function createProperty(data: PropertyFormData) {
  const { supabase, error: authError } = await requireAdmin();
  if (!supabase) return { error: authError };

  const { data: created, error } = await supabase
    .from("properties")
    .insert({
      title: data.title,
      price: data.price,
      is_rent: data.status === "for_rent",
      is_sold: data.status === "sold",
      property_type: data.property_type,
      description: data.description,
      location: data.location,
      area: data.area,
      year_built: data.year_built,
      beds: data.beds,
      baths: data.baths,
      parking: data.parking,
      amenities: data.amenities,
      latitude: data.latitude,
      longitude: data.longitude,
      image_url: data.image_url,
      slug: generateSlug(data.title),
      category: data.featured ? "featured" : "new_market",
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/[locale]/admin/properties", "page");
  return { data: { id: created.id } };
}

export async function updateProperty(id: string, data: PropertyFormData) {
  const { supabase, error: authError } = await requireAdmin();
  if (!supabase) return { error: authError };

  const { error } = await supabase
    .from("properties")
    .update({
      title: data.title,
      price: data.price,
      is_rent: data.status === "for_rent",
      is_sold: data.status === "sold",
      property_type: data.property_type,
      description: data.description,
      location: data.location,
      area: data.area,
      year_built: data.year_built,
      beds: data.beds,
      baths: data.baths,
      parking: data.parking,
      amenities: data.amenities,
      latitude: data.latitude,
      longitude: data.longitude,
      image_url: data.image_url,
      category: data.featured ? "featured" : "new_market",
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/[locale]/admin/properties", "page");
  return { ok: true };
}

export async function deleteProperty(id: string) {
  const { supabase, error: authError } = await requireAdmin();
  if (!supabase) return { error: authError };

  // Fetch image URLs to remove from storage
  const { data: prop } = await supabase
    .from("properties")
    .select("image_url")
    .eq("id", id)
    .single();

  if (prop?.image_url?.length) {
    const paths = (prop.image_url as string[])
      .map((url: string) => {
        const marker = "/property-images/";
        const idx = url.indexOf(marker);
        return idx !== -1 ? url.slice(idx + marker.length) : null;
      })
      .filter(Boolean) as string[];

    if (paths.length) {
      await supabase.storage.from("property-images").remove(paths);
    }
  }

  const { error } = await supabase.from("properties").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/[locale]/admin/properties", "page");
  return { ok: true };
}
