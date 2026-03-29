import { zValidator } from "@hono/zod-validator";
import bcrypt from "bcryptjs";
import { deleteCookie, setCookie } from "hono/cookie";
import { Hono } from "hono";
import { registerSchema, authSchema } from "@/features/schemas";
import { authCookieMaxAge, authCookieName, signAuthToken } from "@/lib/auth";
import type { AppVariables } from "@/lib/hono-types";
import { prisma } from "@/lib/prisma";
import { sessionMiddleware } from "@/lib/session-middleware";

const app = new Hono<{ Variables: AppVariables }>()
  .post("/register", zValidator("json", registerSchema), async (c) => {
    const { email, password, name } = c.req.valid("json");

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return c.json({ error: "Email is already registered" }, 409);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        role: "buyer",
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    const token = await signAuthToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    setCookie(c, authCookieName, token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      path: "/",
      maxAge: authCookieMaxAge,
    });

    return c.json({ user }, 201);
  })
  .post("/login", zValidator("json", authSchema), async (c) => {
    const { email, password } = c.req.valid("json");

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return c.json({ error: "Invalid email or password" }, 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return c.json({ error: "Invalid email or password" }, 401);
    }

    const token = await signAuthToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    setCookie(c, authCookieName, token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      path: "/",
      maxAge: authCookieMaxAge,
    });

    return c.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  })
  .get("/me", sessionMiddleware, async (c) => {
    return c.json({ user: c.get("user") });
  })
  .post("/logout", sessionMiddleware, async (c) => {
    deleteCookie(c, authCookieName, { path: "/" });
    return c.json({ success: true });
  });

export default app;
