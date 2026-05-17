export const i18n = {
  defaultLocale: "en",
  locales: ["en", "es", "ko"],
} as const;

export type Locale = (typeof i18n)["locales"][number];

export function formatArea(areaStr: string, locale: Locale): string {
  if (!areaStr) return areaStr;
  
  const numStr = areaStr.replace(/[^\d.,]/g, "").replace(/,/g, "");
  const num = parseFloat(numStr);
  if (isNaN(num)) return areaStr;

  const isSqft = areaStr.toLowerCase().includes("sqft");
  const isSqm = areaStr.toLowerCase().includes("m²") || areaStr.toLowerCase().includes("m2");

  if (locale === "es" || locale === "ko") {
    if (isSqft) {
      const converted = Math.round(num * 0.092903);
      return `${converted.toLocaleString(locale)} m²`;
    }
  } else if (locale === "en") {
    if (isSqm) {
      const converted = Math.round(num * 10.7639);
      return `${converted.toLocaleString(locale)} sqft`;
    }
  }
  
  const unit = isSqft ? "sqft" : "m²";
  return `${num.toLocaleString(locale)} ${unit}`;
}

export function translateTag(tag: string, dict: any): string {
  if (!tag) return tag;
  const t = tag.toLowerCase();
  if (t === "top match") return dict.common?.tags?.topMatch || tag;
  if (t === "exclusive") return dict.common?.tags?.exclusive || tag;
  if (t === "featured property") return dict.common?.tags?.featuredProperty || tag;
  if (t === "for sale") return dict.common?.tags?.forSale || tag;
  if (t === "for rent") return dict.common?.tags?.forRent || tag;
  return tag;
}
