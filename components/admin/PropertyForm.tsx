"use client";

import { useCallback, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  createProperty,
  updateProperty,
  type PropertyFormData,
} from "@/app/[locale]/admin/properties/actions";
import AdminMapPreview from "@/components/admin/AdminMapPreview";

type ImageEntry = {
  url: string;
  storagePath: string | null;
  uploading: boolean;
  isMain: boolean;
  localId: string;
};

type ExistingProperty = {
  id: string;
  title: string;
  price: string;
  is_rent: boolean;
  is_sold: boolean | null;
  property_type: string | null;
  description: string | null;
  location: string;
  area: string | null;
  year_built: number | null;
  beds: number | null;
  baths: number | null;
  parking: number | null;
  amenities: string[] | null;
  latitude: number | null;
  longitude: number | null;
  image_url: string[] | null;
  category: string | null;
};

type Props = {
  mode: "create" | "edit";
  locale: string;
  dict: Record<string, unknown>;
  property: ExistingProperty | null;
};

const AMENITY_KEYS = ["pool", "garden", "air_conditioning", "smart_home"] as const;

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function extractStoragePath(url: string): string | null {
  const marker = "/property-images/";
  const idx = url.indexOf(marker);
  return idx !== -1 ? url.slice(idx + marker.length) : null;
}

export default function PropertyForm({ mode, locale, dict, property }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pf = (dict as any).admin.propertyForm as Record<string, string>;

  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Basic info
  const [title, setTitle] = useState(property?.title ?? "");
  const [price, setPrice] = useState(property?.price ?? "");
  const [status, setStatus] = useState<"for_sale" | "for_rent" | "sold">(
    property
      ? property.is_sold
        ? "sold"
        : property.is_rent
        ? "for_rent"
        : "for_sale"
      : "for_sale"
  );
  const [propertyType, setPropertyType] = useState(
    property?.property_type ?? "apartment"
  );
  const [featured, setFeatured] = useState(
    property?.category === "featured"
  );

  // Description
  const [description, setDescription] = useState(property?.description ?? "");
  const charCount = description.length;

  // Location
  const [location, setLocation] = useState(property?.location ?? "");
  const [latitude, setLatitude] = useState<string>(
    property?.latitude != null ? String(property.latitude) : ""
  );
  const [longitude, setLongitude] = useState<string>(
    property?.longitude != null ? String(property.longitude) : ""
  );

  // Details
  const [area, setArea] = useState(property?.area ?? "");
  const [yearBuilt, setYearBuilt] = useState<string>(
    property?.year_built != null ? String(property.year_built) : ""
  );
  const [beds, setBeds] = useState(property?.beds ?? 1);
  const [baths, setBaths] = useState(property?.baths ?? 1);
  const [parking, setParking] = useState(property?.parking ?? 0);
  const [amenities, setAmenities] = useState<Set<string>>(
    new Set(property?.amenities ?? [])
  );

  // Images
  const [images, setImages] = useState<ImageEntry[]>(() => {
    if (!property?.image_url?.length) return [];
    return property.image_url.map((url, i) => ({
      url,
      storagePath: extractStoragePath(url),
      uploading: false,
      isMain: i === 0,
      localId: uid(),
    }));
  });

  // Submission state
  const [submitError, setSubmitError] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const toggleAmenity = (key: string) => {
    setAmenities((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleFilesSelected = useCallback(async (files: FileList | null) => {
    if (!files?.length) return;
    const supabase = createClient();

    const newEntries: ImageEntry[] = Array.from(files).map(() => ({
      url: "",
      storagePath: null,
      uploading: true,
      isMain: false,
      localId: uid(),
    }));

    setImages((prev) => {
      const updated = [...prev, ...newEntries];
      // first image is always main if none set
      if (!updated.some((img) => img.isMain) && updated.length > 0) {
        updated[0].isMain = true;
      }
      return updated;
    });

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const localId = newEntries[i].localId;
      const ext = file.name.split(".").pop() ?? "jpg";
      const storagePath = `${Date.now()}-${uid()}.${ext}`;

      const { error } = await supabase.storage
        .from("property-images")
        .upload(storagePath, file, { contentType: file.type, upsert: false });

      if (error) {
        setImages((prev) => prev.filter((img) => img.localId !== localId));
        continue;
      }

      const { data: urlData } = supabase.storage
        .from("property-images")
        .getPublicUrl(storagePath);

      setImages((prev) =>
        prev.map((img) =>
          img.localId === localId
            ? { ...img, url: urlData.publicUrl, storagePath, uploading: false }
            : img
        )
      );
    }
  }, []);

  const handleDeleteImage = async (localId: string) => {
    const entry = images.find((img) => img.localId === localId);
    if (!entry) return;

    if (entry.storagePath) {
      const supabase = createClient();
      await supabase.storage
        .from("property-images")
        .remove([entry.storagePath]);
    }

    setImages((prev) => {
      const next = prev.filter((img) => img.localId !== localId);
      // Ensure first image is main if we deleted the main one
      if (next.length > 0 && !next.some((img) => img.isMain)) {
        next[0].isMain = true;
      }
      return next;
    });
  };

  const handleSetMain = (localId: string) => {
    setImages((prev) =>
      prev.map((img) => ({ ...img, isMain: img.localId === localId }))
    );
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => setDragActive(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleFilesSelected(e.dataTransfer.files);
  };

  const buildFormData = (): PropertyFormData => {
    // Sort so main image comes first
    const sorted = [...images].sort((a, b) =>
      a.isMain ? -1 : b.isMain ? 1 : 0
    );
    return {
      title: title.trim(),
      price: price.trim(),
      status,
      property_type: propertyType,
      description: description.trim(),
      location: location.trim(),
      area: area.trim(),
      year_built: yearBuilt ? parseInt(yearBuilt, 10) : null,
      beds,
      baths,
      parking,
      amenities: Array.from(amenities),
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      image_url: sorted.filter((img) => img.url).map((img) => img.url),
      featured,
    };
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    setSubmitError("");

    if (!title.trim()) return setSubmitError(pf.errorTitleRequired);
    if (!price.trim()) return setSubmitError(pf.errorPriceRequired);
    if (images.some((img) => img.uploading))
      return setSubmitError(pf.errorUploading);

    const data = buildFormData();

    startTransition(async () => {
      const result =
        mode === "create"
          ? await createProperty(data)
          : await updateProperty(property!.id, data);

      if ("error" in result && result.error) {
        setSubmitError(result.error);
        return;
      }
      router.push(`/${locale}/admin/properties`);
    });
  };

  const amenityLabels: Record<string, string> = {
    pool: pf.amenityPool,
    garden: pf.amenityGarden,
    air_conditioning: pf.amenityAC,
    smart_home: pf.amenitySmartHome,
  };

  const amenityIcons: Record<string, string> = {
    pool: "pool",
    garden: "yard",
    air_conditioning: "ac_unit",
    smart_home: "home_iot_device",
  };

  return (
    <div className="admin-light-page">
      {/* Page header */}
      <div className="pf-page-header">
        <div>
          <nav className="pf-breadcrumb">
            <Link href={`/${locale}/admin/properties`} className="pf-breadcrumb-link">
              {(dict as Record<string, Record<string, Record<string, string>>>).admin.nav.properties}
            </Link>
            <span className="material-icons pf-breadcrumb-sep">chevron_right</span>
            <span className="pf-breadcrumb-current">
              {mode === "create" ? pf.addTitle : pf.editTitle}
            </span>
          </nav>
          <h1 className="admin-light-title">
            {mode === "create" ? pf.addTitle : pf.editTitle}
          </h1>
          <p className="admin-light-subtitle">{pf.subtitle}</p>
        </div>
        <div className="pf-header-actions">
          {submitError && (
            <span className="pf-submit-error" style={{ marginBottom: 0, fontSize: 13 }}>
              {submitError}
            </span>
          )}
          <button
            type="button"
            className="pf-draft-btn"
            onClick={handleSubmit}
            disabled={isPending}
          >
            {pf.saveDraft}
          </button>
          <button
            type="button"
            className="pf-save-btn"
            onClick={handleSubmit}
            disabled={isPending}
          >
            <span className="material-icons">save</span>
            {isPending ? pf.saving : pf.saveProperty}
          </button>
        </div>
      </div>

      {submitError && (
        <div className="pf-submit-error">{submitError}</div>
      )}

      <form className="pf-grid" onSubmit={handleSubmit}>
        {/* ---- Left column ---- */}
        <div className="pf-col-main">
          {/* Basic Information */}
          <section className="pf-card">
            <div className="pf-card-header">
              <div className="pf-card-header-left">
                <div className="pf-card-header-icon">
                  <span className="material-icons">info</span>
                </div>
                <h2 className="pf-card-title">{pf.sectionBasicInfo}</h2>
              </div>
            </div>
            <div className="pf-card-body">
              <div className="pf-field-group">
                <label className="pf-label" htmlFor="pf-title">
                  {pf.labelTitle} <span className="pf-label-required">*</span>
                </label>
                <input
                  id="pf-title"
                  type="text"
                  className="pf-input"
                  placeholder={pf.placeholderTitle}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="pf-grid-3">
                <div className="pf-field-group">
                  <label className="pf-label" htmlFor="pf-price">
                    {pf.labelPrice} <span className="pf-label-required">*</span>
                  </label>
                  <div className="pf-input-price-wrap">
                    <span className="pf-input-prefix">$</span>
                    <input
                      id="pf-price"
                      type="text"
                      className="pf-input pf-input--price"
                      placeholder={pf.placeholderPrice}
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="pf-field-group">
                  <label className="pf-label" htmlFor="pf-status">
                    {pf.labelStatus}
                  </label>
                  <select
                    id="pf-status"
                    className="pf-select"
                    value={status}
                    onChange={(e) =>
                      setStatus(e.target.value as "for_sale" | "for_rent" | "sold")
                    }
                  >
                    <option value="for_sale">{pf.statusForSale}</option>
                    <option value="for_rent">{pf.statusForRent}</option>
                    <option value="sold">{pf.statusSold}</option>
                  </select>
                </div>

                <div className="pf-field-group">
                  <label className="pf-label" htmlFor="pf-type">
                    {pf.labelPropertyType}
                  </label>
                  <select
                    id="pf-type"
                    className="pf-select"
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                  >
                    <option value="apartment">{pf.typeApartment}</option>
                    <option value="house">{pf.typeHouse}</option>
                    <option value="villa">{pf.typeVilla}</option>
                    <option value="commercial">{pf.typeCommercial}</option>
                  </select>
                </div>
              </div>

              {/* Featured toggle */}
              <label className="pf-featured-toggle">
                <div className="pf-featured-toggle-info">
                  <span className="material-icons pf-featured-toggle-icon">
                    {featured ? "star" : "star_border"}
                  </span>
                  <div>
                    <p className="pf-featured-toggle-title">Featured property</p>
                    <p className="pf-featured-toggle-sub">
                      {featured
                        ? "Appears as a featured listing — highlighted for buyers."
                        : "Standard listing — appears in New in Market."}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={featured}
                  className={`pf-toggle${featured ? " pf-toggle--on" : ""}`}
                  onClick={() => setFeatured((v) => !v)}
                >
                  <span className="pf-toggle-thumb" />
                </button>
              </label>
            </div>
          </section>

          {/* Description */}
          <section className="pf-card">
            <div className="pf-card-header">
              <div className="pf-card-header-left">
                <div className="pf-card-header-icon">
                  <span className="material-icons">description</span>
                </div>
                <h2 className="pf-card-title">{pf.sectionDescription}</h2>
              </div>
            </div>
            <div className="pf-card-body">
              <div className="pf-fmt-toolbar">
                <button
                  type="button"
                  className="pf-fmt-btn"
                  title="Bold"
                  onClick={() => setDescription((d) => `**${d}**`)}
                >
                  <span className="material-icons">format_bold</span>
                </button>
                <button
                  type="button"
                  className="pf-fmt-btn"
                  title="Italic"
                  onClick={() => setDescription((d) => `_${d}_`)}
                >
                  <span className="material-icons">format_italic</span>
                </button>
                <button
                  type="button"
                  className="pf-fmt-btn"
                  title="List"
                  onClick={() =>
                    setDescription((d) => d + "\n• ")
                  }
                >
                  <span className="material-icons">format_list_bulleted</span>
                </button>
              </div>
              <textarea
                id="pf-description"
                className="pf-textarea"
                placeholder={pf.descriptionPlaceholder}
                value={description}
                maxLength={2000}
                onChange={(e) => setDescription(e.target.value)}
              />
              <div className="pf-char-count">
                {pf.charCount.replace("{{count}}", String(charCount))}
              </div>
            </div>
          </section>

          {/* Gallery */}
          <section className="pf-card">
            <div className="pf-card-header">
              <div className="pf-card-header-left">
                <div className="pf-card-header-icon">
                  <span className="material-icons">image</span>
                </div>
                <h2 className="pf-card-title">{pf.sectionGallery}</h2>
              </div>
              <span className="pf-card-header-badge">{pf.galleryFormats}</span>
            </div>
            <div className="pf-card-body">
              <div
                className={`pf-dropzone${dragActive ? " pf-dropzone--active" : ""}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="pf-dropzone-input"
                  style={{ display: "none" }}
                  onChange={(e) => handleFilesSelected(e.target.files)}
                />
                <div className="pf-dropzone-icon">
                  <span className="material-icons">cloud_upload</span>
                </div>
                <p className="pf-dropzone-title">{pf.dropzoneTitle}</p>
                <p className="pf-dropzone-sub">{pf.dropzoneSub}</p>
              </div>

              {images.length > 0 && (
                <div className="pf-img-grid">
                  {images.map((img) => (
                    <div key={img.localId} className="pf-img-cell">
                      {img.uploading ? (
                        <div
                          className="pf-img-uploading"
                          style={{
                            background: "rgba(238,246,246,0.9)",
                            inset: 0,
                            position: "absolute",
                          }}
                        >
                          <div className="pf-spinner" />
                        </div>
                      ) : (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={img.url}
                            alt=""
                            className="pf-img-thumb"
                          />
                          <div className="pf-img-overlay">
                            <button
                              type="button"
                              className="pf-img-overlay-btn pf-img-overlay-btn--delete"
                              title={pf.imgDelete}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteImage(img.localId);
                              }}
                            >
                              <span className="material-icons">delete</span>
                            </button>
                            {!img.isMain && (
                              <button
                                type="button"
                                className="pf-img-overlay-btn pf-img-overlay-btn--main"
                                title={pf.imgSetMain}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSetMain(img.localId);
                                }}
                              >
                                <span className="material-icons">star</span>
                              </button>
                            )}
                          </div>
                          {img.isMain && (
                            <span className="pf-img-main-badge">{pf.imgMain}</span>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    className="pf-img-add-btn"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <span className="material-icons">add</span>
                    <span>Add More</span>
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* ---- Right column ---- */}
        <div className="pf-col-side">
          {/* Location */}
          <section className="pf-card">
            <div className="pf-card-header">
              <div className="pf-card-header-left">
                <div className="pf-card-header-icon">
                  <span className="material-icons">place</span>
                </div>
                <h2 className="pf-card-title">{pf.sectionLocation}</h2>
              </div>
            </div>
            <div className="pf-card-body--sm">
              <div className="pf-field-group">
                <label className="pf-label" htmlFor="pf-location">
                  {pf.labelAddress}
                </label>
                <input
                  id="pf-location"
                  type="text"
                  className="pf-input"
                  placeholder={pf.placeholderAddress}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div className="pf-grid-2">
                <div className="pf-field-group">
                  <label className="pf-label" htmlFor="pf-lat">
                    {pf.labelLatitude}
                  </label>
                  <input
                    id="pf-lat"
                    type="number"
                    step="any"
                    className="pf-detail-input"
                    placeholder="0.000000"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                  />
                </div>
                <div className="pf-field-group">
                  <label className="pf-label" htmlFor="pf-lng">
                    {pf.labelLongitude}
                  </label>
                  <input
                    id="pf-lng"
                    type="number"
                    step="any"
                    className="pf-detail-input"
                    placeholder="0.000000"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                  />
                </div>
              </div>

              {/* Map preview — shown when both coords are valid */}
              {(() => {
                const lat = parseFloat(latitude);
                const lng = parseFloat(longitude);
                const valid = !isNaN(lat) && !isNaN(lng) && latitude !== "" && longitude !== "";
                return valid ? (
                  <div className="pf-map-live">
                    <AdminMapPreview latitude={lat} longitude={lng} location={location} />
                  </div>
                ) : (
                  <div className="pf-map-placeholder">
                    <span className="material-icons">location_on</span>
                    <span>{pf.mapPreview}</span>
                  </div>
                );
              })()}
            </div>
          </section>

          {/* Details */}
          <section className="pf-card pf-card--sticky">
            <div className="pf-card-header">
              <div className="pf-card-header-left">
                <div className="pf-card-header-icon">
                  <span className="material-icons">straighten</span>
                </div>
                <h2 className="pf-card-title">{pf.sectionDetails}</h2>
              </div>
            </div>
            <div className="pf-card-body--sm">
              <div className="pf-grid-2">
                <div className="pf-field-group">
                  <label className="pf-label" htmlFor="pf-area">
                    {pf.labelArea}
                  </label>
                  <input
                    id="pf-area"
                    type="text"
                    className="pf-detail-input"
                    placeholder={pf.placeholderArea}
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                  />
                </div>
                <div className="pf-field-group">
                  <label className="pf-label" htmlFor="pf-year">
                    {pf.labelYearBuilt}
                  </label>
                  <input
                    id="pf-year"
                    type="number"
                    className="pf-detail-input"
                    placeholder={pf.placeholderYear}
                    value={yearBuilt}
                    onChange={(e) => setYearBuilt(e.target.value)}
                  />
                </div>
              </div>

              <hr className="pf-divider" />

              {/* Steppers */}
              {[
                { label: pf.labelBeds, icon: "bed", val: beds, set: setBeds },
                { label: pf.labelBaths, icon: "shower", val: baths, set: setBaths },
                { label: pf.labelParking, icon: "directions_car", val: parking, set: setParking },
              ].map(({ label, icon, val, set }) => (
                <div key={label} className="pf-stepper-row">
                  <span className="pf-stepper-label">
                    <span className="material-icons pf-stepper-label-icon">{icon}</span>
                    {label}
                  </span>
                  <div className="pf-stepper">
                    <button
                      type="button"
                      className="pf-stepper-btn"
                      onClick={() => set((v) => Math.max(0, v - 1))}
                    >
                      −
                    </button>
                    <input
                      type="text"
                      className="pf-stepper-value"
                      readOnly
                      value={val}
                    />
                    <button
                      type="button"
                      className="pf-stepper-btn"
                      onClick={() => set((v) => v + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}

              <hr className="pf-divider" />

              {/* Amenities */}
              <div>
                <p className="pf-amenities-title">{pf.labelAmenities}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {AMENITY_KEYS.map((key) => (
                    <label key={key} className="pf-amenity-label">
                      <input
                        type="checkbox"
                        className="pf-checkbox"
                        checked={amenities.has(key)}
                        onChange={() => toggleAmenity(key)}
                      />
                      <span className="material-icons pf-stepper-label-icon" style={{ fontSize: 16 }}>
                        {amenityIcons[key]}
                      </span>
                      {amenityLabels[key]}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </form>

      {/* Mobile action bar */}
      <div className="pf-mobile-bar">
        <button
          type="button"
          className="pf-draft-btn"
          style={{ flex: 1 }}
          onClick={() => router.push(`/${locale}/admin/properties`)}
        >
          {pf.cancelLabel}
        </button>
        <button
          type="button"
          className="pf-save-btn"
          style={{ flex: 1, justifyContent: "center" }}
          onClick={handleSubmit}
          disabled={isPending}
        >
          {isPending ? pf.saving : pf.saveProperty}
        </button>
      </div>
    </div>
  );
}
