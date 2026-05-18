"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const BREADCRUMB_MAP: Record<string, string> = {
  "/admin":            "Overview",
  "/admin/properties": "Properties",
  "/admin/users":      "Users & Roles",
};

export default function AdminBreadcrumb({ locale }: { locale: string }) {
  const pathname = usePathname();

  const adminRelative = pathname.replace(`/${locale}`, "") || "/admin";

  const matchedKey = Object.keys(BREADCRUMB_MAP)
    .filter((k) => adminRelative === k || adminRelative.startsWith(k + "/"))
    .sort((a, b) => b.length - a.length)[0];

  const currentLabel = matchedKey ? BREADCRUMB_MAP[matchedKey] : null;

  return (
    <div className="admin-breadcrumb">
      <div className="admin-breadcrumb-inner">
        <Link href={`/${locale}/admin`} className="admin-breadcrumb-root">
          Admin
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
