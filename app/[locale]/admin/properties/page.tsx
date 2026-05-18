import { createClient } from "@/lib/supabase/server";
import { getDictionary } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n";
import { redirect } from "next/navigation";
import Link from "next/link";
import PropertyRowActions from "@/components/admin/PropertyRowActions";

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

  const [dict, supabase] = await Promise.all([
    getDictionary(locale as Locale),
    createClient(),
  ]);
  const a = dict.admin;
  const p = dict.admin.pagination;

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
        <p className="admin-error">{a.properties.errorLoading}: {error.message}</p>
      </div>
    );
  }

  const total      = totalCount  ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  if (totalPages > 0 && currentPage > totalPages) {
    redirect(`/${locale}/admin/properties?page=${totalPages}`);
  }

  const stats = [
    { label: a.properties.totalListings, value: total,             icon: "apartment", cls: "pl-stat-icon--emerald" },
    { label: a.properties.forSale,       value: forSaleCount ?? 0, icon: "home",      cls: "pl-stat-icon--green"   },
    { label: a.properties.forRent,       value: forRentCount ?? 0, icon: "key",       cls: "pl-stat-icon--amber"   },
  ];

  const pageLength = properties?.length ?? 0;
  const startItem  = total === 0 ? 0 : offset + 1;
  const endItem    = Math.min(offset + PAGE_SIZE, total);

  return (
    <div className="admin-light-page">
      {/* Header */}
      <div className="pl-header">
        <div>
          <h1 className="admin-light-title">{a.properties.title}</h1>
          <p className="admin-light-subtitle">{a.properties.subtitle}</p>
        </div>
        <div className="pl-header-actions">
          <button className="pl-filter-btn">
            <span className="material-icons">filter_list</span>
            {a.properties.filter}
          </button>
          <Link href={`/${locale}/admin/properties/new`} className="pl-add-btn">
            <span className="material-icons">add</span>
            {a.properties.addNew}
          </Link>
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
          <div>{a.properties.colPropertyDetails}</div>
          <div>{a.properties.colPrice}</div>
          <div>{a.properties.colStatus}</div>
          <div className="pl-col-h--right">{a.properties.colActions}</div>
        </div>

        {pageLength === 0 && <div className="pl-empty">{a.properties.noProperties}</div>}

        {properties?.map((prop, i) => (
          <div
            key={prop.id}
            className={`pl-row${i === pageLength - 1 ? " pl-row--last" : ""}`}
          >
            {/* Property details */}
            <div className="pl-prop-details">
              <div className="pl-prop-img-wrap">
                {prop.image_url?.[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={prop.image_url[0]} alt={prop.title} className="pl-prop-img" />
                ) : (
                  <div className="pl-prop-img-placeholder">
                    <span className="material-icons">image</span>
                  </div>
                )}
              </div>
              <div>
                <Link
                  href={`/${locale}/properties/${prop.id}`}
                  target="_blank"
                  className="pl-prop-title"
                >
                  {prop.title}
                </Link>
                <p className="pl-prop-location">{prop.location}</p>
                <div className="pl-prop-meta">
                  {prop.beds && (
                    <>
                      <span className="pl-prop-meta-item">
                        <span className="material-icons">bed</span>
                        {prop.beds} {dict.common.beds}
                      </span>
                      <span className="pl-prop-meta-sep" />
                    </>
                  )}
                  {prop.baths && (
                    <>
                      <span className="pl-prop-meta-item">
                        <span className="material-icons">bathtub</span>
                        {prop.baths} {dict.common.baths}
                      </span>
                      {prop.area && <span className="pl-prop-meta-sep" />}
                    </>
                  )}
                  {prop.area && <span className="pl-prop-meta-item">{prop.area}</span>}
                </div>
              </div>
            </div>

            {/* Price */}
            <div>
              <div className="pl-price">{prop.price}</div>
              {prop.is_rent && <div className="pl-price-sub">{a.properties.monthly}</div>}
            </div>

            {/* Status */}
            <div>
              <span className={`pl-status-badge ${prop.is_rent ? "pl-status-badge--rent" : "pl-status-badge--sale"}`}>
                <span className="pl-status-dot" />
                {prop.is_rent ? a.properties.statusForRent : a.properties.statusForSale}
              </span>
            </div>

            {/* Actions */}
            <PropertyRowActions
              propId={prop.id}
              locale={locale}
              editLabel={a.properties.editProperty}
              deleteLabel={a.properties.deleteProperty}
              confirmMsg={a.propertyForm.confirmDelete}
              deleteSuccessMsg={a.propertyForm.deleteSuccess}
              deleteErrorMsg={a.propertyForm.deleteError}
            />
          </div>
        ))}

        {/* Pagination */}
        <div className="pl-pagination">
          <span className="pl-pagination-info">
            {p.showing} <strong>{startItem}</strong>–<strong>{endItem}</strong> {p.of}{" "}
            <strong>{total}</strong> {p.results}
          </span>
          <div className="pl-pagination-buttons">
            {currentPage <= 1 ? (
              <span className="pl-page-btn pl-page-btn--disabled">{p.previous}</span>
            ) : (
              <Link
                href={`/${locale}/admin/properties?page=${currentPage - 1}`}
                className="pl-page-btn"
              >
                {p.previous}
              </Link>
            )}
            {currentPage >= totalPages || totalPages === 0 ? (
              <span className="pl-page-btn pl-page-btn--disabled">{p.next}</span>
            ) : (
              <Link
                href={`/${locale}/admin/properties?page=${currentPage + 1}`}
                className="pl-page-btn"
              >
                {p.next}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
