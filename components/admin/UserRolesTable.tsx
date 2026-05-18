"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import type { UserWithRole } from "@/app/[locale]/admin/users/page";
import { updateUserRole } from "@/app/[locale]/admin/users/actions";

const ROLE_OPTIONS = ["admin", "agent", "user"] as const;

const ROLE_COLORS: Record<string, string> = {
  admin: "admin-badge--admin",
  agent: "admin-badge--agent",
  user: "admin-badge--user",
};

export default function UserRolesTable({ users }: { users: UserWithRole[] }) {
  const [pending, startTransition] = useTransition();
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  const handleRoleChange = (userId: string, newRole: "admin" | "agent" | "user") => {
    startTransition(async () => {
      const result = await updateUserRole(userId, newRole);
      if (result.error) {
        showToast(`Error: ${result.error}`, false);
      } else {
        showToast("Role updated successfully", true);
      }
    });
  };

  return (
    <>
      {toast && (
        <div className={`admin-toast ${toast.ok ? "admin-toast--ok" : "admin-toast--error"}`}>
          <span className="material-icons">{toast.ok ? "check_circle" : "error"}</span>
          {toast.msg}
        </div>
      )}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Current Role</th>
              <th>Change Role</th>
              <th>Registered</th>
              <th>Last Sign-in</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>
                  <div className="admin-user-cell">
                    {u.avatar_url ? (
                      <Image
                        src={u.avatar_url}
                        alt={u.full_name ?? u.email}
                        width={36}
                        height={36}
                        className="admin-user-avatar"
                      />
                    ) : (
                      <span className="material-icons admin-user-avatar-icon">
                        account_circle
                      </span>
                    )}
                    <span className="admin-user-name">
                      {u.full_name ?? <em className="admin-table-empty">No name</em>}
                    </span>
                  </div>
                </td>
                <td>{u.email}</td>
                <td>
                  <span className={`admin-badge ${ROLE_COLORS[u.role] ?? ""}`}>
                    {u.role}
                  </span>
                </td>
                <td>
                  <select
                    defaultValue={u.role}
                    disabled={pending}
                    onChange={(e) =>
                      handleRoleChange(u.id, e.target.value as "admin" | "agent" | "user")
                    }
                    className="admin-role-select"
                  >
                    {ROLE_OPTIONS.map((r) => (
                      <option key={r} value={r}>
                        {r.charAt(0).toUpperCase() + r.slice(1)}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="admin-table-date">
                  {new Date(u.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="admin-table-date">
                  {u.last_sign_in_at
                    ? new Date(u.last_sign_in_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : <span className="admin-table-empty">Never</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
