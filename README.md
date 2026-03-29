# Real Estate Buyer Portal

## Run Locally

1. Create `.env` (or copy from `.env.example`) and set:

DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/realstatebroker?schema=public"
JWT_SECRET="your-long-random-secret"

2. Install dependencies:

pnpm install

3. Generate Prisma client:

pnpm prisma generate

4. Run database migrations:

pnpm prisma migrate dev --name init

5. Start the app:

pnpm dev

6. Open:

http://localhost:3000

## Run with Docker

1. Start app + PostgreSQL:

docker compose up --build

2. Open:

http://localhost:3000

3. Stop containers:

docker compose down