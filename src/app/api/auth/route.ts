import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import pool from "@/lib/db";
import { signToken } from "@/lib/auth";

export async function POST(request: Request) {
  const { action, name, email, password } = await request.json();

  if (action === "register") {
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Все поля обязательны" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Пароль минимум 6 символов" }, { status: 400 });
    }

    const exists = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (exists.rows.length > 0) {
      return NextResponse.json({ error: "Пользователь уже существует" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, 'user')",
      [name, email, hashedPassword]
    );

    const token = signToken({ name, email, role: "user" });
    return NextResponse.json({ success: true, user: { name, email, role: "user" }, token });
  }

  if (action === "login") {
    if (!email || !password) {
      return NextResponse.json({ error: "Email и пароль обязательны" }, { status: 400 });
    }

    const result = await pool.query(
      "SELECT name, email, password, role FROM users WHERE email = $1",
      [email]
    );
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Неверный email или пароль" }, { status: 401 });
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Неверный email или пароль" }, { status: 401 });
    }

    const token = signToken({ name: user.name, email: user.email, role: user.role || "user" });
    return NextResponse.json({
      success: true,
      user: { name: user.name, email: user.email, role: user.role || "user" },
      token,
    });
  }

  return NextResponse.json({ error: "Неизвестное действие" }, { status: 400 });
}
