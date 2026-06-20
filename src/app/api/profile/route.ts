import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

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

  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const file = formData.get("avatar") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Файл не выбран" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Файл слишком большой (макс. 5MB)" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Только изображения" }, { status: 400 });
    }

    const ext = file.name.split(".").pop() || "jpg";
    const filename = `${user.email.replace(/[^a-zA-Z0-9]/g, "_")}.${ext}`;
    const avatarsDir = join(process.cwd(), "public", "avatars");

    await mkdir(avatarsDir, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(join(avatarsDir, filename), buffer);

    const avatarUrl = `/avatars/${filename}`;
    await pool.query(
      "UPDATE users SET avatar_url = $1 WHERE email = $2",
      [avatarUrl, user.email]
    );

    return NextResponse.json({ success: true, avatarUrl });
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
