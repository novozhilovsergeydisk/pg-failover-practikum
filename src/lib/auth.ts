import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "pg-practikum-secret-key-change-in-production";

export interface AuthPayload {
  email: string;
  name: string;
  role: string;
}

export function signToken(payload: AuthPayload, rememberMe = false): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: rememberMe ? "30d" : "24h" });
}

export function verifyToken(token: string): AuthPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthPayload;
  } catch {
    return null;
  }
}

export function getTokenFromRequest(request: Request): string | null {
  const authHeader = request.headers.get("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  return null;
}

export function requireAuth(request: Request): AuthPayload | null {
  const token = getTokenFromRequest(request);
  if (!token) return null;
  return verifyToken(token);
}

export function requireAdmin(request: Request): AuthPayload | null {
  const user = requireAuth(request);
  if (!user || user.role !== "admin") return null;
  return user;
}
