import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET(request: Request) {
  const user = requireAuth(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await pool.query(
    "SELECT id, name, email, role, created_at, github_login, avatar_url FROM users WHERE email = $1",
    [user.email]
  );

  if (result.rows.length === 0) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const u = result.rows[0];
  return NextResponse.json({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    createdAt: u.created_at,
    githubLogin: u.github_login,
    avatarUrl: u.avatar_url,
  });
}

export async function PUT(request: Request) {
  const user = requireAuth(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name } = await request.json();

  if (!name || name.trim().length === 0) {
    return NextResponse.json({ error: "Имя обязательно" }, { status: 400 });
  }

  if (name.length > 100) {
    return NextResponse.json({ error: "Имя слишком длинное" }, { status: 400 });
  }

  await pool.query(
    "UPDATE users SET name = $1 WHERE email = $2",
    [name.trim(), user.email]
  );

  return NextResponse.json({ success: true, name: name.trim() });
}
