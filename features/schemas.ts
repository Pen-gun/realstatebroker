import { z } from "zod";

export const authSchema = z.object({
  email: z.string().trim().min(1, "Email is required"),
  password: z.string().trim().min(1, "Password is required"),
});

export const registerSchema = authSchema.extend({
  name: z.string().trim().min(1, "Name is required"),
});

export const favouriteSchema = z.object({
  propertyId: z.string().min(1),
});
