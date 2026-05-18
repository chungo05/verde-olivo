"use client";

import { useState, useTransition, useEffect } from "react";
import Image from "next/image";
import type { UserWithRole } from "@/app/[locale]/admin/users/page";
import { updateUserRole } from "@/app/[locale]/admin/users/actions";

type RoleFilter = "all" | "admin" | "agent" | "user";

const ROLE_LABELS: Record<string, string> = {
  admin: "Administrator",
  agent: "Agent",
  user: "User",
};

const ROLE_ICONS: Record<string, string> = {
  admin: "shield",
  agent: "badge",
  user: "person",
};

export default function UserRolesTable({ users }: { users: UserWithRole[] }) {
  const [pending, startTransition] = useTransition();
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [search, setSearch] = useState("");
  const [localRoles, setLocalRoles] = useState<Record<string, string>>(
    Object.fromEntries(users.map((u) => [u.id, u.role]))
  );

  // Close dropdown on outside click
  useEffect(() => {
    if (!openDropdown) return;
    const close = () => setOpenDropdown(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [openDropdown]);

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  const handleRoleChange = (userId: string, newRole: "admin" | "agent" | "user") => {
    setOpenDropdown(null);
    const prevRole = localRoles[userId];
    setLocalRoles((prev) => ({ ...prev, [userId]: newRole }));
    startTransition(async () => {
      const result = await updateUserRole(userId, newRole);
      if (result.error) {
        setLocalRoles((prev) => ({ ...prev, [userId]: prevRole }));
        showToast(`Error: ${result.error}`, false);
      } else {
        showToast("Role updated successfully", true);
      }
    });
  };

  const roleCounts = {
    all: users.length,
    admin: users.filter((u) => localRoles[u.id] === "admin").length,
    agent: users.filter((u) => localRoles[u.id] === "agent").length,
    user:  users.filter((u) => localRoles[u.id] === "user").length,
  };

  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === "all" || localRoles[u.id] === roleFilter;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      (u.full_name?.toLowerCase().includes(q) ?? false) ||
      u.email.toLowerCase().includes(q);
    return matchesRole && matchesSearch;
  });

  return (
    <>
      {toast && (
        <div className={`admin-toast ${toast.ok ? "admin-toast--ok" : "admin-toast--error"}`}>
          <span className="material-icons">{toast.ok ? "check_circle" : "error"}</span>
          {toast.msg}
        </div>
      )}

      {/* Controls */}
      <div className="ud-controls">
        <div className="ud-search">
          <span className="material-icons ud-search-icon">search</span>
          <input
            type="text"
            className="ud-search-input"
            placeholder="Search by name, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="ud-add-btn">
          <span className="material-icons">add</span>
          Add User
        </button>
      </div>

      {/* Tabs */}
      <div className="ud-tabs">
        {(["all", "admin", "agent", "user"] as const).map((tab) => (
          <button
            key={tab}
            className={`ud-tab${roleFilter === tab ? " ud-tab--active" : ""}`}
            onClick={() => setRoleFilter(tab)}
          >
            {tab === "all" ? "All Users" : ROLE_LABELS[tab]}
            <span className="ud-tab-count">{roleCounts[tab]}</span>
          </button>
        ))}
      </div>

      {/* Column headers */}
      <div className="ud-col-headers">
        <div>User Details</div>
        <div>Role &amp; Status</div>
        <div>Info</div>
        <div className="ud-col-h--right">Actions</div>
      </div>

      {/* Card list */}
      <div className="ud-list">
        {filteredUsers.length === 0 && (
          <div className="ud-empty">No users found.</div>
        )}
        {filteredUsers.map((u, i) => {
          const currentRole = (localRoles[u.id] ?? u.role) as "admin" | "agent" | "user";
          const isFeatured = i === 0;
          const isOpen = openDropdown === u.id;
          const isActive = !!u.last_sign_in_at;

          return (
            <div key={u.id} className={`ud-card${isFeatured ? " ud-card--featured" : ""}`}>
              {/* User details */}
              <div className="ud-user-details">
                <div className="ud-avatar-wrap">
                  {u.avatar_url ? (
                    <Image
                      src={u.avatar_url}
                      alt={u.full_name ?? u.email}
                      width={48}
                      height={48}
                      className="ud-avatar"
                    />
                  ) : (
                    <div className="ud-avatar ud-avatar--placeholder">
                      <span className="material-icons">person</span>
                    </div>
                  )}
                  <span className={`ud-status-dot ud-status-dot--${isActive ? "active" : "inactive"}`} />
                </div>
                <div className="ud-user-info">
                  <div className="ud-user-name">
                    {u.full_name ?? <em className="ud-no-name">No name</em>}
                  </div>
                  <div className="ud-user-email">{u.email}</div>
                  <div className="ud-user-id">ID: #{u.id.slice(0, 8).toUpperCase()}</div>
                </div>
              </div>

              {/* Role & status */}
              <div className="ud-role-col">
                <span className={`ud-role-badge ud-badge--${currentRole}`}>
                  {ROLE_LABELS[currentRole]}
                </span>
                <div className={`ud-active-indicator ud-active-indicator--${isActive ? "active" : "inactive"}`}>
                  <span className="material-icons">
                    {isActive ? "check_circle" : "remove_circle_outline"}
                  </span>
                  {isActive ? "Active" : "Inactive"}
                </div>
              </div>

              {/* Meta info */}
              <div className="ud-meta-col">
                <div>
                  <div className="ud-meta-label">Registered</div>
                  <div className="ud-meta-value">
                    {new Date(u.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </div>
                <div>
                  <div className="ud-meta-label">Last Login</div>
                  <div className="ud-meta-value">
                    {u.last_sign_in_at
                      ? new Date(u.last_sign_in_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Never"}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="ud-actions-col">
                <div
                  className="ud-dropdown-wrap"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className={`ud-role-btn${isFeatured ? " ud-role-btn--featured" : ""}`}
                    onClick={() => setOpenDropdown(isOpen ? null : u.id)}
                    disabled={pending}
                  >
                    Change Role
                    <span className="material-icons">
                      {isOpen ? "expand_less" : "expand_more"}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="ud-dropdown">
                      {(["admin", "agent", "user"] as const).map((role) => (
                        <button
                          key={role}
                          className={`ud-dropdown-item${currentRole === role ? " ud-dropdown-item--active" : ""}`}
                          onClick={() => handleRoleChange(u.id, role)}
                        >
                          <span className="material-icons">{ROLE_ICONS[role]}</span>
                          {ROLE_LABELS[role]}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
