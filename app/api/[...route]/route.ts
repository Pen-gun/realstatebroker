import { Hono } from "hono";
import { handle } from "hono/vercel";
import auth from "@/features/auth/server/route";
import favourites from "@/features/favourites/server/route";
import properties from "@/features/properties/server/route";

export const runtime = "nodejs";

const app = new Hono().basePath("/api");

const routes = app
  .get("/health", (c) => c.json({ status: "ok" }))
  .route("/auth", auth)
  .route("/properties", properties)
  .route("/favourites", favourites);

export type AppType = typeof routes;

void routes;

app.onError((error, c) => {
  console.error(error);
  return c.json({ error: "Something went wrong" }, 500);
});

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
export const OPTIONS = handle(app);
