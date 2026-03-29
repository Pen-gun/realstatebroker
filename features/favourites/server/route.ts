import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { favouriteSchema } from "@/features/schemas";
import type { AppVariables } from "@/lib/hono-types";
import { prisma } from "@/lib/prisma";
import { sessionMiddleware } from "@/lib/session-middleware";

const app = new Hono<{ Variables: AppVariables }>()
  .use("*", sessionMiddleware)
  .get("/", async (c) => {
    const user = c.get("user");

    const favourites = await prisma.favourite.findMany({
      where: {
        userId: user.id,
      },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            city: true,
            price: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return c.json({
      favourites: favourites.map((item) => ({
        id: item.id,
        property: item.property,
        createdAt: item.createdAt,
      })),
    });
  })
  .post("/", zValidator("json", favouriteSchema), async (c) => {
    const user = c.get("user");
    const { propertyId } = c.req.valid("json");

    const property = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!property) {
      return c.json({ error: "Property not found" }, 404);
    }

    const existing = await prisma.favourite.findUnique({
      where: {
        userId_propertyId: {
          userId: user.id,
          propertyId,
        },
      },
      select: { id: true },
    });

    if (existing) {
      return c.json({ error: "Property already in favourites" }, 409);
    }

    const favourite = await prisma.favourite.create({
      data: {
        userId: user.id,
        propertyId,
      },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            city: true,
            price: true,
          },
        },
      },
    });

    return c.json(
      {
        favourite: {
          id: favourite.id,
          property: favourite.property,
          createdAt: favourite.createdAt,
        },
      },
      201,
    );
  })
  .delete("/:propertyId", async (c) => {
    const user = c.get("user");
    const propertyId = c.req.param("propertyId");

    const deleted = await prisma.favourite.deleteMany({
      where: {
        userId: user.id,
        propertyId,
      },
    });

    if (deleted.count === 0) {
      return c.json({ error: "Favourite not found" }, 404);
    }

    return c.json({ success: true });
  });

export default app;
