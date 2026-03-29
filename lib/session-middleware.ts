import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { authCookieName, verifyAuthToken } from "@/lib/auth";
import type { AppVariables } from "@/lib/hono-types";
import { prisma } from "@/lib/prisma";

export const sessionMiddleware = createMiddleware<{ Variables: AppVariables }>(
  async (c, next) => {
    const authHeader = c.req.header("authorization");
    const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
    const cookieToken = getCookie(c, authCookieName);
    const token = bearerToken ?? cookieToken;

    if (!token) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    try {
      const payload = await verifyAuthToken(token);

      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
      });

      if (!user) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      c.set("user", user);
      await next();
    } catch {
      return c.json({ error: "Unauthorized" }, 401);
    }
  },
);
