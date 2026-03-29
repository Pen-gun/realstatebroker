"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { logout } from "@/features/dashboard/api";
import { FavouritesList } from "@/features/dashboard/components/favourites-list";
import { PropertyList } from "@/features/dashboard/components/property-list";
import {
  useCurrentUserQuery,
  useFavouritesQuery,
  usePropertiesQuery,
  useToggleFavouriteMutation,
} from "@/features/dashboard/queries";

export default function DashboardPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState<string | null>(null);
  const meQuery = useCurrentUserQuery();

  const user = meQuery.data?.user ?? null;
  const propertiesQuery = usePropertiesQuery(!!user);
  const favouritesQuery = useFavouritesQuery(!!user);

  const properties = useMemo(() => propertiesQuery.data?.properties ?? [], [propertiesQuery.data?.properties]);
  const favourites = useMemo(() => favouritesQuery.data?.favourites ?? [], [favouritesQuery.data?.favourites]);

  const favouritePropertyIds = useMemo(
    () => new Set(favourites.map((item) => item.property.id)),
    [favourites],
  );

  useEffect(() => {
    if (meQuery.error) {
      router.replace("/sign-in");
    }
  }, [meQuery.error, router]);

  const toggleFavouriteMutation = useToggleFavouriteMutation();

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      router.replace("/sign-in");
    },
    onError: () => {
      router.replace("/sign-in");
    },
  });

  const errorMessage =
    ((toggleFavouriteMutation.error as Error | null)?.message ??
      (propertiesQuery.error as Error | null)?.message ??
      (favouritesQuery.error as Error | null)?.message ??
      (meQuery.error as Error | null)?.message) || null;

  async function toggleFavourite(propertyId: string) {
    setIsSaving(propertyId);
    const isLiked = favouritePropertyIds.has(propertyId);

    toggleFavouriteMutation.mutate(
      {
        propertyId,
        isLiked,
      },
      {
        onSettled: () => {
          setIsSaving(null);
        },
      },
    );
  }

  function handleLogout() {
    logoutMutation.mutate();
  }

  if (meQuery.isLoading || (user && (propertiesQuery.isLoading || favouritesQuery.isLoading))) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center px-5 py-8">
        <p className="rounded-xl border border-[#e7dfd2] bg-white px-4 py-2 text-sm text-slate-700">Loading dashboard…</p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8">
      <section className="mb-6 rounded-3xl border border-[#e7dfd2] bg-[#fffaf2] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)] sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-800">Buyer Dashboard</p>
            <h1 className="mt-1 text-3xl text-slate-900 sm:text-4xl">Hello, {user?.name}</h1>
            <p className="mt-1 text-sm text-slate-600">Role: <span className="font-semibold text-slate-900">{user?.role}</span></p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Logout
          </button>
        </div>
      </section>

      {errorMessage ? <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</p> : null}

      <section className="grid gap-6 lg:grid-cols-2">
        <PropertyList
          properties={properties}
          favouritePropertyIds={favouritePropertyIds}
          savingPropertyId={isSaving}
          onToggleFavourite={toggleFavourite}
        />

        <FavouritesList favourites={favourites} />
      </section>
    </main>
  );
}
