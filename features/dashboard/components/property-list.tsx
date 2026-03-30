import type { Property } from "@/features/dashboard/schemas";

type PropertyListProps = {
  properties: Property[];
  favouritePropertyIds: Set<string>;
  savingPropertyId: string | null;
  onToggleFavourite: (propertyId: string) => void;
};

export function PropertyList({
  properties,
  favouritePropertyIds,
  savingPropertyId,
  onToggleFavourite,
}: PropertyListProps) {
  return (
    <article className="rounded-3xl border border-[#e7dfd2] bg-white p-5 sm:p-6">
      <h2 className="text-2xl text-slate-900">All Properties</h2>
      <p className="mb-4 mt-1 text-sm text-slate-600">Use the button to like or unlike properties.</p>
      <div className="space-y-3">
        {properties.map((property) => {
          const isLiked = favouritePropertyIds.has(property.id);

          return (
            <div key={property.id} className="rounded-2xl border border-[#e7dfd2] bg-slate-50 p-4">
              <p className="font-semibold text-slate-900">{property.title}</p>
              <p className="text-sm text-slate-600">{property.city}</p>
              <p className="mt-1 text-sm font-medium text-slate-900">Rs {property.price.toLocaleString("en-IN")}</p>
              <button
                disabled={savingPropertyId === property.id}
                onClick={() => onToggleFavourite(property.id)}
                className={`mt-3 rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                  isLiked
                    ? "bg-rose-100 text-rose-700 hover:bg-rose-200"
                    : "bg-teal-100 text-teal-800 hover:bg-teal-200"
                } disabled:opacity-60`}
              >
                {savingPropertyId === property.id ? "Updating..." : isLiked ? "Remove Favourite" : "Add Favourite"}
              </button>
            </div>
          );
        })}
      </div>
    </article>
  );
}
