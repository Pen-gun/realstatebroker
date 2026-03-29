import { z } from "zod";

export const userSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  email: z.email(),
  role: z.string().min(1),
});

export const propertySchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  city: z.string().min(1),
  price: z.number().int().nonnegative(),
});

export const favouriteSchema = z.object({
  id: z.string().min(1),
  createdAt: z.string().min(1),
  property: propertySchema,
});

export const meResponseSchema = z.object({
  user: userSchema,
});

export const propertiesResponseSchema = z.object({
  properties: z.array(propertySchema),
});

export const favouritesResponseSchema = z.object({
  favourites: z.array(favouriteSchema),
});

export const addFavouriteInputSchema = z.object({
  propertyId: z.string().min(1),
});

export const addFavouriteResponseSchema = z.object({
  favourite: favouriteSchema,
});

export const removeFavouriteResponseSchema = z.object({
  success: z.literal(true),
});

export const logoutResponseSchema = z.object({
  success: z.literal(true),
});

export type User = z.infer<typeof userSchema>;
export type Property = z.infer<typeof propertySchema>;
export type Favourite = z.infer<typeof favouriteSchema>;
