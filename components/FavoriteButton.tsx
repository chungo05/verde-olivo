"use client";

import { useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";

type FavoriteButtonProps = {
  propertyId: string;
  className?: string;
};

export default function FavoriteButton({
  propertyId,
  className = "",
}: FavoriteButtonProps) {
  const { user, loading } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!propertyId || loading) return;

    if (!user) {
      setIsFavorite(false);
      setLoaded(true);
      return;
    }

    let mounted = true;
    fetch(`/api/favorites?propertyId=${encodeURIComponent(propertyId)}`)
      .then(async (response) => {
        if (!mounted) return;
        if (!response.ok) return;
        const json = await response.json();
        setIsFavorite(Boolean(json?.favorited));
      })
      .catch(() => {
        // Keep client-side state safe on errors.
      })
      .finally(() => {
        if (mounted) setLoaded(true);
      });

    return () => {
      mounted = false;
    };
  }, [propertyId, user, loading]);

  const handleToggle = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (busy || loading) return;
    if (!user) {
      const localeMatch = window.location.pathname.match(/^\/([^\/]+)(?:\/|$)/);
      const loginPath = localeMatch ? `/${localeMatch[1]}/login` : "/login";
      window.location.href = loginPath;
      return;
    }

    setBusy(true);

    try {
      const response = await fetch("/api/favorites", {
        method: isFavorite ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ propertyId }),
      });

      if (!response.ok) {
        console.error("Favorite request failed:", await response.text());
        return;
      }

      setIsFavorite((current) => !current);
    } catch (error) {
      console.error("Favorite request error:", error);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
        isFavorite ? "bg-mosque text-white" : "bg-white/90 text-nordic-dark"
      } hover:scale-105 shadow-sm ${className}`}
      onClick={handleToggle}
      disabled={busy}
      aria-pressed={isFavorite}
      title={isFavorite ? "Eliminar de favoritos" : "Agregar a favoritos"}
    >
      <span className="material-icons text-xl">
        {isFavorite ? "favorite" : "favorite_border"}
      </span>
    </button>
  );
}
