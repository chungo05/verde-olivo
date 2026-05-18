"use client";

import { useTransition, useState } from "react";
import Link from "next/link";
import { deactivateProperty, reactivateProperty } from "@/app/[locale]/admin/properties/actions";

type Props = {
  propId: string;
  locale: string;
  editLabel: string;
  isActive: boolean;
  deactivateLabel: string;
  activateLabel: string;
  confirmDeactivateMsg: string;
  deactivateSuccessMsg: string;
  activateSuccessMsg: string;
  deactivateErrorMsg: string;
  activateErrorMsg: string;
};

export default function PropertyRowActions({
  propId,
  locale,
  editLabel,
  isActive,
  deactivateLabel,
  activateLabel,
  confirmDeactivateMsg,
  deactivateSuccessMsg,
  activateSuccessMsg,
  deactivateErrorMsg,
  activateErrorMsg,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  const handleToggle = () => {
    if (isActive && !window.confirm(confirmDeactivateMsg)) return;
    startTransition(async () => {
      const result = isActive
        ? await deactivateProperty(propId)
        : await reactivateProperty(propId);
      if ("error" in result && result.error) {
        showToast(isActive ? deactivateErrorMsg : activateErrorMsg, false);
      } else {
        showToast(isActive ? deactivateSuccessMsg : activateSuccessMsg, true);
      }
    });
  };

  return (
    <>
      <div className="pl-actions-col">
        <Link
          href={`/${locale}/admin/properties/${propId}/edit`}
          className="pl-action-btn pl-action-btn--edit"
          title={editLabel}
        >
          <span className="material-icons">edit</span>
        </Link>
        <button
          className={`pl-action-btn ${isActive ? "pl-action-btn--delete" : "pl-action-btn--edit"}`}
          title={isActive ? deactivateLabel : activateLabel}
          onClick={handleToggle}
          disabled={isPending}
        >
          <span className="material-icons">
            {isPending ? "hourglass_empty" : isActive ? "visibility_off" : "visibility"}
          </span>
        </button>
      </div>

      {toast && (
        <div className={`admin-toast admin-toast--${toast.ok ? "ok" : "error"}`}>
          <span className="material-icons" style={{ fontSize: 18 }}>
            {toast.ok ? "check_circle" : "error_outline"}
          </span>
          {toast.msg}
        </div>
      )}
    </>
  );
}
