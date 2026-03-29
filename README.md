# Real Estate Buyer Portal Assignment

Full stack implementation of buyer auth + favourites portal using:

- Next.js (App Router)
- Hono (API routing in Next route handler)
- PostgreSQL
- Prisma ORM
- JWT auth (stored in HTTP-only cookie)

## Features Implemented

- User registration and login (email + password)
- Password hashing with bcrypt (no raw password storage)
- JWT-based authentication
- Protected buyer dashboard
- My Favourites list per user
- Add/remove property favourites
- Authorization checks so users can only access their own favourites
- Basic server-side validation and error handling
- Tiny DB layer with users, properties, favourites tables

## Project Structure

- app/(auth)/sign-in/page.tsx: Sign-in UI (route group)
- app/(auth)/sign-up/page.tsx: Sign-up UI (route group)
- app/(dashboard)/dashboard/page.tsx: Buyer dashboard UI (route group)
- app/api/[...route]/route.ts: Composed Hono API entrypoint
- features/auth/server/route.ts: Auth API routes
- features/properties/server/route.ts: Properties API routes
- features/favourites/server/route.ts: Favourites API routes
- lib/session-middleware.ts: Shared auth middleware
- lib/prisma.ts: Prisma client singleton
- lib/auth.ts: JWT helpers
- prisma/schema.prisma: Database schema

## Prerequisites

- Node.js 20+
- pnpm
- PostgreSQL running locally

## Environment

Create or update .env with:

DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/realstatebroker?schema=public"
JWT_SECRET="your-long-random-secret"

## Run the App

1. Install dependencies

pnpm install

2. Generate Prisma client

pnpm prisma generate

3. Apply migration

pnpm prisma migrate dev --name init_auth_favourites

4. Start dev server

pnpm dev

5. Open app

http://localhost:3000

## Example Flow

1. Open /sign-up
2. Create account (name, email, password)
3. Redirect to dashboard
4. Click Add Favourite on a property
5. Property appears in My Favourites
6. Click Remove Favourite to unlike
7. Logout and login again to verify favourites persistence

## API Endpoints

- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me
- POST /api/auth/logout
- GET /api/properties
- GET /api/favourites
- POST /api/favourites
- DELETE /api/favourites/:propertyId

## Notes

- Properties are auto-seeded on first GET /api/properties call.
- Auth token is set as HTTP-only cookie for safer browser storage.
- Favourites table has unique constraint on (userId, propertyId).

INSERT INTO "Property" ("id", "title", "city", "price", "createdAt", "updatedAt") VALUES
('np_prop_1', '2BHK Apartment at Baluwatar', 'Kathmandu', 18500000, NOW(), NOW()),
('np_prop_2', 'Lake View Flat near Lakeside', 'Pokhara', 14200000, NOW(), NOW()),
('np_prop_3', 'Family House at Imadol', 'Lalitpur', 22800000, NOW(), NOW()),
('np_prop_4', 'Commercial Shutter in Traffic Chowk', 'Butwal', 9800000, NOW(), NOW()),
('np_prop_5', 'Residential Plot near Itahari Chowk', 'Itahari', 12500000, NOW(), NOW()),
('np_prop_6', 'New Duplex House at Bharatpur', 'Chitwan', 20500000, NOW(), NOW());