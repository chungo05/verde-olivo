import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Properties — Admin | LuxeEstate",
};

export default async function AdminPropertiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();

  const { data: properties, error } = await supabase
    .from("properties")
    .select("id, title, location, price, beds, baths, area, tag, is_rent, category, created_at, image_url")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="admin-page">
        <p className="admin-error">Error loading properties: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Properties</h1>
          <p className="admin-page-subtitle">{properties?.length ?? 0} listings in database</p>
        </div>
      </header>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Location</th>
              <th>Price</th>
              <th>Beds / Baths</th>
              <th>Area</th>
              <th>Category</th>
              <th>Tag</th>
              <th>Type</th>
              <th>Added</th>
            </tr>
          </thead>
          <tbody>
            {properties?.map((p) => (
              <tr key={p.id}>
                <td>
                  {p.image_url?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.image_url[0]}
                      alt={p.title}
                      className="admin-table-thumb"
                    />
                  ) : (
                    <div className="admin-table-no-img">
                      <span className="material-icons">image_not_supported</span>
                    </div>
                  )}
                </td>
                <td className="admin-table-title-cell">
                  <a
                    href={`/${locale}/properties/${p.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="admin-table-link"
                  >
                    {p.title}
                    <span className="material-icons admin-table-ext-icon">open_in_new</span>
                  </a>
                </td>
                <td>{p.location}</td>
                <td className="admin-table-price">{p.price}</td>
                <td>{p.beds ?? "—"} / {p.baths ?? "—"}</td>
                <td>{p.area}</td>
                <td>
                  <span className={`admin-badge admin-badge--${p.category}`}>
                    {p.category?.replace("_", " ")}
                  </span>
                </td>
                <td>{p.tag ?? <span className="admin-table-empty">—</span>}</td>
                <td>
                  <span className={`admin-badge ${p.is_rent ? "admin-badge--rent" : "admin-badge--sale"}`}>
                    {p.is_rent ? "Rent" : "Sale"}
                  </span>
                </td>
                <td className="admin-table-date">
                  {p.created_at
                    ? new Date(p.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
