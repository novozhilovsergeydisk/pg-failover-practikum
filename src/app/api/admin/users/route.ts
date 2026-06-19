import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  const result = await pool.query("SELECT id, name, email, role, created_at FROM users ORDER BY id");
  return NextResponse.json(result.rows);
}

export async function POST(request: Request) {
  const { name, email, password, role } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: "email и password обязательны" }, { status: 400 });
  }

  const exists = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
  if (exists.rows.length > 0) {
    return NextResponse.json({ error: "Пользователь уже существует" }, { status: 409 });
  }

  await pool.query(
    "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)",
    [name, email, password, role || "user"]
  );

  return NextResponse.json({ success: true });
}
