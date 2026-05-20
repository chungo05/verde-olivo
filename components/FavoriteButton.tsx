"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { useTranslation } from "./I18nProvider";

type FavoriteButtonProps = {
  propertyId: string;
  className?: string;
  initialFavorited?: boolean;
  onUnfavorite?: () => void;
};

export default function FavoriteButton({
  propertyId,
  className = "",
  initialFavorited,
  onUnfavorite,
}: FavoriteButtonProps) {
  const { user, loading } = useAuth();
  const { locale } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const [isFavorite, setIsFavorite] = useState(false);
  const [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (initialFavorited !== undefined) {
      setIsFavorite(initialFavorited);
      setLoaded(true);
      return;
    }

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
      .catch((err) => { console.error("Failed to load favorite status:", err); })
      .finally(() => {
        if (mounted) setLoaded(true);
      });

    return () => {
      mounted = false;
    };
  }, [propertyId, user, loading, locale, initialFavorited]);

  const handleToggle = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (busy || loading) return;
    if (!user) {
      router.push(`/${locale}/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    setBusy(true);

    try {
      const response = await fetch("/api/favorites", {
        method: isFavorite ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId }),
      });

      if (!response.ok) {
        console.error("Favorite request failed:", await response.text());
        return;
      }

      const nextFavorited = !isFavorite;
      setIsFavorite(nextFavorited);
      if (!nextFavorited && onUnfavorite) {
        onUnfavorite();
      }
    } catch (error) {
      console.error("Favorite request error:", error);
    } finally {
      setBusy(false);
    }
  };

  if (!loaded) {
    return (
      <div
        className={`w-10 h-10 rounded-full bg-white/90 shadow-sm ${className}`}
        aria-hidden="true"
      />
    );
  }

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
