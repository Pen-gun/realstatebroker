import type { Favourite } from "@/features/dashboard/schemas";

type FavouritesListProps = {
  favourites: Favourite[];
};

export function FavouritesList({ favourites }: FavouritesListProps) {
  return (
    <article className="rounded-3xl border border-[#e7dfd2] bg-white p-5 sm:p-6">
      <h2 className="text-2xl text-slate-900">My Favourites</h2>
      <p className="mb-4 mt-1 text-sm text-slate-600">Only your own favourites are shown here.</p>

      {favourites.length === 0 ? (
        <p className="rounded-xl border border-dashed border-[#e7dfd2] bg-slate-50 px-4 py-6 text-sm text-slate-600">
          You have not liked any property yet.
        </p>
      ) : (
        <div className="space-y-3">
          {favourites.map((item) => (
            <div key={item.id} className="rounded-2xl border border-[#e7dfd2] bg-emerald-50/50 p-4">
              <p className="font-semibold text-slate-900">{item.property.title}</p>
              <p className="text-sm text-slate-600">{item.property.city}</p>
              <p className="mt-1 text-sm font-medium text-slate-900">INR {item.property.price.toLocaleString("en-IN")}</p>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
