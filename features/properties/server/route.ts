import { Hono } from "hono";
import { prisma } from "@/lib/prisma";

const defaultProperties = [
  { title: "2BHK Apartment at Baluwatar", city: "Kathmandu", price: 18500000 },
  { title: "Lake View Flat near Lakeside", city: "Pokhara", price: 14200000 },
  { title: "Family House at Imadol", city: "Lalitpur", price: 22800000 },
  { title: "Commercial Shutter in Traffic Chowk", city: "Butwal", price: 9800000 },
  { title: "Residential Plot near Itahari Chowk", city: "Itahari", price: 12500000 },
  { title: "New Duplex House at Bharatpur", city: "Chitwan", price: 20500000 },
];

async function ensurePropertiesSeeded() {
  const count = await prisma.property.count();
  if (count > 0) {
    return;
  }

  await prisma.property.createMany({ data: defaultProperties });
}

const app = new Hono().get("/", async (c) => {
  await ensurePropertiesSeeded();

  const properties = await prisma.property.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      title: true,
      city: true,
      price: true,
    },
  });

  return c.json({ properties });
});

export default app;
