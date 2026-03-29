import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addFavourite,
  fetchCurrentUser,
  fetchFavourites,
  fetchProperties,
  removeFavourite,
} from "@/features/dashboard/api";
import type { Favourite } from "@/features/dashboard/schemas";

export const dashboardQueryKeys = {
  me: ["dashboard", "me"] as const,
  properties: ["dashboard", "properties"] as const,
  favourites: ["dashboard", "favourites"] as const,
};

export function useCurrentUserQuery() {
  return useQuery({
    queryKey: dashboardQueryKeys.me,
    queryFn: fetchCurrentUser,
    retry: false,
  });
}

export function usePropertiesQuery(enabled: boolean) {
  return useQuery({
    queryKey: dashboardQueryKeys.properties,
    queryFn: fetchProperties,
    enabled,
  });
}

export function useFavouritesQuery(enabled: boolean) {
  return useQuery({
    queryKey: dashboardQueryKeys.favourites,
    queryFn: fetchFavourites,
    enabled,
  });
}

type ToggleFavouriteArgs = {
  propertyId: string;
  isLiked: boolean;
};

export function useToggleFavouriteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ propertyId, isLiked }: ToggleFavouriteArgs) => {
      if (isLiked) {
        await removeFavourite(propertyId);
        return { propertyId, isLiked };
      }

      const result = await addFavourite(propertyId);
      return { propertyId, isLiked, favourite: result.favourite };
    },
    onSuccess: ({ propertyId, isLiked, favourite }) => {
      queryClient.setQueryData<{ favourites: Favourite[] }>(dashboardQueryKeys.favourites, (current) => {
        if (!current) {
          return current;
        }

        if (isLiked) {
          return {
            favourites: current.favourites.filter((item) => item.property.id !== propertyId),
          };
        }

        if (!favourite) {
          return current;
        }

        return {
          favourites: [favourite, ...current.favourites],
        };
      });
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.favourites });
    },
  });
}
