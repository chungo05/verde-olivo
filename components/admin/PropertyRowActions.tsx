"use client";

import { useTransition, useState } from "react";
import Link from "next/link";
import { deleteProperty } from "@/app/[locale]/admin/properties/actions";

type Props = {
  propId: string;
  locale: string;
  editLabel: string;
  deleteLabel: string;
  confirmMsg: string;
  deleteSuccessMsg: string;
  deleteErrorMsg: string;
};

export default function PropertyRowActions({
  propId,
  locale,
  editLabel,
  deleteLabel,
  confirmMsg,
  deleteSuccessMsg,
  deleteErrorMsg,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  const handleDelete = () => {
    if (!window.confirm(confirmMsg)) return;
    startTransition(async () => {
      const result = await deleteProperty(propId);
      if ("error" in result && result.error) {
        showToast(deleteErrorMsg, false);
      } else {
        showToast(deleteSuccessMsg, true);
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
          className="pl-action-btn pl-action-btn--delete"
          title={deleteLabel}
          onClick={handleDelete}
          disabled={isPending}
        >
          <span className="material-icons">
            {isPending ? "hourglass_empty" : "delete_outline"}
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
