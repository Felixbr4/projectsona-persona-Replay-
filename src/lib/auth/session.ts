import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import prisma from "@/lib/db/prisma";

const AUTH_SECRET = process.env.AUTH_SECRET || "projecsona-super-secret-key-change-in-production-2026";
const COOKIE_NAME = "projecsona_session";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN" | string;
  emailVerified: boolean;
}

export interface SessionPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export function createSessionToken(user: { id: string; email: string; role: string }): string {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    AUTH_SECRET,
    { expiresIn: "7d" }
  );
}

export function verifySessionToken(token: string): SessionPayload | null {
  try {
    return jwt.verify(token, AUTH_SECRET) as SessionPayload;
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string) {
  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearSessionCookie() {
  const cookieStore = cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = verifySessionToken(token);
  if (!payload) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      emailVerified: true,
    },
  });

  if (!user || user.status === "BLOCKED") {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    emailVerified: Boolean(user.emailVerified),
  };
}

export async function requireUser(): Promise<SessionUser> {
  const session = await getSession();
  if (!session) {
    throw new Error("UNAUTHORIZED: Usuário não autenticado.");
  }
  return session;
}

export async function requireAdmin(): Promise<SessionUser> {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    throw new Error("FORBIDDEN: Acesso exclusivo para administradores.");
  }
  return session;
}
