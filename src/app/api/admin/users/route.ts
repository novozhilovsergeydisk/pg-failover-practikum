import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import pool from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET(request: Request) {
  const admin = requireAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Требуется авторизация администратора" }, { status: 403 });
  }

  const result = await pool.query("SELECT id, name, email, role, created_at FROM users ORDER BY id");
  return NextResponse.json(result.rows);
}

export async function POST(request: Request) {
  const admin = requireAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Требуется авторизация администратора" }, { status: 403 });
  }

  const { name, email, password, role } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: "email и password обязательны" }, { status: 400 });
  }

  const exists = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
  if (exists.rows.length > 0) {
    return NextResponse.json({ error: "Пользователь уже существует" }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await pool.query(
    "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)",
    [name, email, hashedPassword, role || "user"]
  );

  return NextResponse.json({ success: true });
}
