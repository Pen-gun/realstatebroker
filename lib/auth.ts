import { SignJWT, jwtVerify } from "jose";

const TOKEN_COOKIE = "rb_auth_token";
const TOKEN_TTL_SECONDS = 60 * 60 * 24;

export type AuthPayload = {
  userId: string;
  email: string;
  role: string;
  name: string;
};

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("Missing JWT_SECRET environment variable");
  }
  return new TextEncoder().encode(secret);
}

export async function signAuthToken(payload: AuthPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${TOKEN_TTL_SECONDS}s`)
    .sign(getJwtSecret());
}

export async function verifyAuthToken(token: string) {
  const { payload } = await jwtVerify(token, getJwtSecret());

  return {
    userId: String(payload.userId),
    email: String(payload.email),
    role: String(payload.role),
    name: String(payload.name),
  } as AuthPayload;
}

export const authCookieName = TOKEN_COOKIE;
export const authCookieMaxAge = TOKEN_TTL_SECONDS;
