import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = {
  title: "Properties — Admin | LuxeEstate",
};

const PAGE_SIZE = 10;

export default async function AdminPropertiesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const [{ locale }, { page: pageParam }] = await Promise.all([params, searchParams]);

  const currentPage = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const offset = (currentPage - 1) * PAGE_SIZE;

  const supabase = await createClient();

  const [
    { data: properties, error },
    { count: totalCount },
    { count: forSaleCount },
    { count: forRentCount },
  ] = await Promise.all([
    supabase
      .from("properties")
      .select("id, title, location, price, beds, baths, area, is_rent, created_at, image_url")
      .order("created_at", { ascending: false })
      .range(offset, offset + PAGE_SIZE - 1),
    supabase.from("properties").select("*", { count: "exact", head: true }),
    supabase.from("properties").select("*", { count: "exact", head: true }).eq("is_rent", false),
    supabase.from("properties").select("*", { count: "exact", head: true }).eq("is_rent", true),
  ]);

  if (error) {
    return (
      <div className="admin-light-page">
        <p className="admin-error">Error loading properties: {error.message}</p>
      </div>
    );
  }

  const total      = totalCount  ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  // Redirect out-of-bounds pages
  if (totalPages > 0 && currentPage > totalPages) {
    redirect(`/${locale}/admin/properties?page=${totalPages}`);
  }

  const stats = [
    { label: "Total Listings", value: total,             icon: "apartment", cls: "pl-stat-icon--emerald" },
    { label: "For Sale",       value: forSaleCount ?? 0, icon: "home",      cls: "pl-stat-icon--green"   },
    { label: "For Rent",       value: forRentCount ?? 0, icon: "key",       cls: "pl-stat-icon--amber"   },
  ];

  const pageLength = properties?.length ?? 0;
  const startItem  = total === 0 ? 0 : offset + 1;
  const endItem    = Math.min(offset + PAGE_SIZE, total);

  return (
    <div className="admin-light-page">
      {/* Header */}
      <div className="pl-header">
        <div>
          <h1 className="admin-light-title">Properties</h1>
          <p className="admin-light-subtitle">Manage your portfolio and track listings.</p>
        </div>
        <div className="pl-header-actions">
          <button className="pl-filter-btn">
            <span className="material-icons">filter_list</span>
            Filter
          </button>
          <button className="pl-add-btn">
            <span className="material-icons">add</span>
            Add New Property
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="pl-stats-grid">
        {stats.map((s) => (
          <div key={s.label} className="pl-stat-card">
            <div>
              <p className="pl-stat-label">{s.label}</p>
              <p className="pl-stat-value">{s.value}</p>
            </div>
            <div className={`pl-stat-icon ${s.cls}`}>
              <span className="material-icons">{s.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Property list */}
      <div className="pl-list-container">
        {/* Column headers */}
        <div className="pl-col-headers">
          <div>Property Details</div>
          <div>Price</div>
          <div>Status</div>
          <div className="pl-col-h--right">Actions</div>
        </div>

        {pageLength === 0 && <div className="pl-empty">No properties found.</div>}

        {properties?.map((p, i) => (
          <div
            key={p.id}
            className={`pl-row${i === pageLength - 1 ? " pl-row--last" : ""}`}
          >
            {/* Property details */}
            <div className="pl-prop-details">
              <div className="pl-prop-img-wrap">
                {p.image_url?.[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image_url[0]} alt={p.title} className="pl-prop-img" />
                ) : (
                  <div className="pl-prop-img-placeholder">
                    <span className="material-icons">image</span>
                  </div>
                )}
              </div>
              <div>
                <Link
                  href={`/${locale}/properties/${p.id}`}
                  target="_blank"
                  className="pl-prop-title"
                >
                  {p.title}
                </Link>
                <p className="pl-prop-location">{p.location}</p>
                <div className="pl-prop-meta">
                  {p.beds && (
                    <>
                      <span className="pl-prop-meta-item">
                        <span className="material-icons">bed</span>
                        {p.beds} Beds
                      </span>
                      <span className="pl-prop-meta-sep" />
                    </>
                  )}
                  {p.baths && (
                    <>
                      <span className="pl-prop-meta-item">
                        <span className="material-icons">bathtub</span>
                        {p.baths} Baths
                      </span>
                      {p.area && <span className="pl-prop-meta-sep" />}
                    </>
                  )}
                  {p.area && <span className="pl-prop-meta-item">{p.area}</span>}
                </div>
              </div>
            </div>

            {/* Price */}
            <div>
              <div className="pl-price">{p.price}</div>
              {p.is_rent && <div className="pl-price-sub">Monthly</div>}
            </div>

            {/* Status */}
            <div>
              <span className={`pl-status-badge ${p.is_rent ? "pl-status-badge--rent" : "pl-status-badge--sale"}`}>
                <span className="pl-status-dot" />
                {p.is_rent ? "For Rent" : "For Sale"}
              </span>
            </div>

            {/* Actions */}
            <div className="pl-actions-col">
              <button className="pl-action-btn pl-action-btn--edit" title="Edit property">
                <span className="material-icons">edit</span>
              </button>
              <button className="pl-action-btn pl-action-btn--delete" title="Delete property">
                <span className="material-icons">delete_outline</span>
              </button>
            </div>
          </div>
        ))}

        {/* Pagination */}
        <div className="pl-pagination">
          <span className="pl-pagination-info">
            Showing <strong>{startItem}</strong>–<strong>{endItem}</strong> of{" "}
            <strong>{total}</strong> results
          </span>
          <div className="pl-pagination-buttons">
            {currentPage <= 1 ? (
              <span className="pl-page-btn pl-page-btn--disabled">Previous</span>
            ) : (
              <Link
                href={`/${locale}/admin/properties?page=${currentPage - 1}`}
                className="pl-page-btn"
              >
                Previous
              </Link>
            )}
            {currentPage >= totalPages || totalPages === 0 ? (
              <span className="pl-page-btn pl-page-btn--disabled">Next</span>
            ) : (
              <Link
                href={`/${locale}/admin/properties?page=${currentPage + 1}`}
                className="pl-page-btn"
              >
                Next
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
