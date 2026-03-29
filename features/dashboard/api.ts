import type { ZodType } from "zod";
import {
  addFavouriteInputSchema,
  addFavouriteResponseSchema,
  favouritesResponseSchema,
  logoutResponseSchema,
  meResponseSchema,
  propertiesResponseSchema,
  removeFavouriteResponseSchema,
} from "@/features/dashboard/schemas";

type ApiErrorBody = {
  error?: string;
};

async function parseApiError(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as ApiErrorBody;
    if (data.error) {
      return data.error;
    }
  } catch {
    // Ignore parse errors and use fallback.
  }

  return "Request failed";
}

async function requestAndParse<T>(
  url: string,
  schema: ZodType<T>,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(url, {
    credentials: "include",
    ...init,
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  const json = await response.json();
  return schema.parse(json);
}

export function fetchCurrentUser() {
  return requestAndParse("/api/auth/me", meResponseSchema);
}

export function fetchProperties() {
  return requestAndParse("/api/properties", propertiesResponseSchema);
}

export function fetchFavourites() {
  return requestAndParse("/api/favourites", favouritesResponseSchema);
}

export function addFavourite(propertyId: string) {
  const payload = addFavouriteInputSchema.parse({ propertyId });

  return requestAndParse("/api/favourites", addFavouriteResponseSchema, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export function removeFavourite(propertyId: string) {
  addFavouriteInputSchema.parse({ propertyId });

  return requestAndParse(`/api/favourites/${propertyId}`, removeFavouriteResponseSchema, {
    method: "DELETE",
  });
}

export function logout() {
  return requestAndParse("/api/auth/logout", logoutResponseSchema, {
    method: "POST",
  });
}
