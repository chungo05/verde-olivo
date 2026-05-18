"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/components/I18nProvider";

export default function AdminBreadcrumb({ locale }: { locale: string }) {
  const pathname = usePathname();
  const { dict } = useTranslation();
  const a = dict.admin;

  const breadcrumbMap: Record<string, string> = {
    "/admin":            a.nav.overview,
    "/admin/properties": a.nav.properties,
    "/admin/users":      a.nav.users,
  };

  const adminRelative = pathname.replace(`/${locale}`, "") || "/admin";

  const matchedKey = Object.keys(breadcrumbMap)
    .filter((k) => adminRelative === k || adminRelative.startsWith(k + "/"))
    .sort((a, b) => b.length - a.length)[0];

  const currentLabel = matchedKey ? breadcrumbMap[matchedKey] : null;

  return (
    <div className="admin-breadcrumb">
      <div className="admin-breadcrumb-inner">
        <Link href={`/${locale}/admin`} className="admin-breadcrumb-root">
          {a.breadcrumb.root}
        </Link>
        {currentLabel && (
          <>
            <span className="material-icons admin-breadcrumb-sep">chevron_right</span>
            <span className="admin-breadcrumb-current">{currentLabel}</span>
          </>
        )}
      </div>
    </div>
  );
}
